"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiService = exports.GeminiApiError = void 0;
const axios_1 = __importDefault(require("axios"));
const gemini_1 = require("../config/gemini");
class GeminiApiError extends Error {
    statusCode;
    canRetry;
    details;
    constructor(message, statusCode = 500, canRetry = true, details) {
        super(message);
        this.name = 'GeminiApiError';
        this.statusCode = statusCode;
        this.canRetry = canRetry;
        this.details = details;
    }
}
exports.GeminiApiError = GeminiApiError;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
class GeminiService {
    static getApiKey() {
        return gemini_1.geminiConfig.apiKey;
    }
    static getModel() {
        return gemini_1.geminiConfig.primaryModel;
    }
    static getModels() {
        return gemini_1.geminiConfig.fallbackModels;
    }
    /**
     * Resilient JSON repair utility to handle LLM quirks:
     * - Strips markdown code block fences (```json ... ```)
     * - Removes illegal ASCII control characters
     * - Cleans conversational preface/postface
     * - Removes trailing commas before } and ]
     * - Auto-closes unclosed strings, objects, and arrays caused by response truncation
     */
    static repairJson(rawText) {
        if (!rawText || typeof rawText !== 'string' || !rawText.trim()) {
            throw new Error('Empty response received');
        }
        let cleaned = rawText.trim();
        // 1. Strip markdown fences
        cleaned = cleaned.replace(/^\s*```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim();
        // 2. Remove illegal control characters except tabs and newlines
        cleaned = cleaned.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '');
        // 3. Try immediate parse
        try {
            return JSON.parse(cleaned);
        }
        catch { }
        // 4. Strip trailing commas before } or ]
        cleaned = cleaned.replace(/,\s*([}\]])/g, '$1');
        try {
            return JSON.parse(cleaned);
        }
        catch { }
        // 5. Locate outermost object or array boundary
        const firstBrace = cleaned.indexOf('{');
        const firstBracket = cleaned.indexOf('[');
        let startIdx = -1;
        if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
            startIdx = firstBrace;
        }
        else if (firstBracket !== -1) {
            startIdx = firstBracket;
        }
        if (startIdx === -1) {
            throw new Error('No JSON object or array found in model response');
        }
        cleaned = cleaned.slice(startIdx);
        // 6. Track bracket stack, handle strings and escapes, and repair truncation
        const stack = [];
        let inString = false;
        let escape = false;
        for (let i = 0; i < cleaned.length; i++) {
            const char = cleaned[i];
            if (escape) {
                escape = false;
                continue;
            }
            if (char === '\\') {
                escape = true;
                continue;
            }
            if (char === '"') {
                inString = !inString;
                continue;
            }
            if (!inString) {
                if (char === '{' || char === '[') {
                    stack.push(char);
                }
                else if (char === '}') {
                    if (stack.length && stack[stack.length - 1] === '{')
                        stack.pop();
                }
                else if (char === ']') {
                    if (stack.length && stack[stack.length - 1] === '[')
                        stack.pop();
                }
            }
        }
        let repaired = cleaned;
        // Close unclosed quote if truncated inside a string
        if (inString) {
            repaired += '"';
        }
        // Strip trailing comma before closing remaining structures
        repaired = repaired.replace(/,\s*$/, '');
        // Close remaining unclosed brackets/braces in reverse order
        while (stack.length) {
            const open = stack.pop();
            repaired += open === '{' ? '}' : ']';
        }
        // Strip trailing commas again in case closing exposed any
        repaired = repaired.replace(/,\s*([}\]])/g, '$1');
        return JSON.parse(repaired);
    }
    /**
     * Safe parser that repairs JSON and unwraps single-element arrays if an object is expected.
     */
    static safeParseJson(rawText, modelName = 'gemini') {
        try {
            const parsed = this.repairJson(rawText);
            // If model wrapped response in an array [ { ... } ], unwrap the first element
            if (Array.isArray(parsed) && parsed.length === 1 && typeof parsed[0] === 'object' && parsed[0] !== null) {
                return parsed[0];
            }
            return parsed;
        }
        catch (parseErr) {
            console.error(`[GeminiService] Failed to parse JSON from model ${modelName}:`, parseErr.message);
            console.error(`[GeminiService] Raw text snippet:\n${rawText.slice(0, 1000)}`);
            throw new GeminiApiError('Gemini AI response could not be parsed as valid JSON. Please retry.', 502, true, { rawText: rawText.slice(0, 2000), model: modelName, parseError: parseErr.message });
        }
    }
    /**
     * Extracts model output text across various response structures:
     * - Gemini Interactions API (output_text, steps with model_output)
     * - Legacy generateContent response (candidates.content.parts)
     */
    static extractTextFromResponse(data) {
        // 1. Direct output_text convenience field (Interactions API)
        if (typeof data?.output_text === 'string' && data.output_text.trim()) {
            return data.output_text.trim();
        }
        // 2. Timeline steps (Interactions API /v1beta/interactions)
        if (Array.isArray(data?.steps)) {
            for (let i = data.steps.length - 1; i >= 0; i--) {
                const step = data.steps[i];
                if (step.type === 'model_output' || step.type === 'output' || !step.type) {
                    if (typeof step.text === 'string' && step.text.trim()) {
                        return step.text.trim();
                    }
                    if (Array.isArray(step.content)) {
                        const texts = step.content
                            .map((c) => {
                            if (typeof c === 'string')
                                return c;
                            if (typeof c?.text === 'string')
                                return c.text;
                            return '';
                        })
                            .filter(Boolean);
                        if (texts.length > 0)
                            return texts.join('\n').trim();
                    }
                    else if (typeof step.content?.text === 'string') {
                        return step.content.text.trim();
                    }
                }
            }
        }
        // 3. Fallback candidates structure
        if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
            return data.candidates[0].content.parts[0].text.trim();
        }
        return '';
    }
    /**
     * Invokes Gemini Interactions API with automatic model fallback, retry logic, and generous token limits.
     */
    static async generateInteraction(prompt, isJson = false, timeoutMs = 45000, options) {
        const apiKey = this.getApiKey();
        const models = this.getModels();
        let lastError = null;
        const interactionsUrl = `${gemini_1.geminiConfig.endpoints.interactions}?key=${apiKey}`;
        const maxTokens = options?.maxOutputTokens ?? 8192;
        for (const baseModel of models) {
            const modelVariants = baseModel.startsWith('models/')
                ? [baseModel, baseModel.replace(/^models\//, '')]
                : [baseModel, `models/${baseModel}`];
            for (const model of modelVariants) {
                const payloads = [];
                if (isJson) {
                    payloads.push({
                        model,
                        input: prompt,
                        generation_config: {
                            temperature: options?.temperature ?? 0.2,
                            max_output_tokens: maxTokens,
                        },
                        response_format: {
                            type: 'text',
                            mime_type: 'application/json',
                        },
                        ...(options?.previousInteractionId ? { previous_interaction_id: options.previousInteractionId } : {}),
                    });
                }
                // Standard text payload with token headroom
                payloads.push({
                    model,
                    input: prompt,
                    generation_config: {
                        temperature: options?.temperature ?? (isJson ? 0.2 : 0.7),
                        max_output_tokens: maxTokens,
                    },
                    ...(options?.previousInteractionId ? { previous_interaction_id: options.previousInteractionId } : {}),
                });
                // Baseline payload
                payloads.push({
                    model,
                    input: prompt,
                    ...(options?.previousInteractionId ? { previous_interaction_id: options.previousInteractionId } : {}),
                });
                for (const payload of payloads) {
                    let retryCount = 0;
                    const maxRetries = 1;
                    while (retryCount <= maxRetries) {
                        try {
                            const response = await axios_1.default.post(interactionsUrl, payload, {
                                headers: {
                                    'Content-Type': 'application/json',
                                    'x-goog-api-key': apiKey,
                                },
                                timeout: timeoutMs,
                            });
                            const rawText = this.extractTextFromResponse(response.data);
                            if (rawText) {
                                return {
                                    text: rawText,
                                    interactionId: response.data?.id,
                                    model,
                                    raw: response.data,
                                };
                            }
                            break;
                        }
                        catch (err) {
                            lastError = err;
                            const status = err?.response?.status;
                            const rawErrMsg = err?.response?.data?.error?.message || err.message || '';
                            const detailsDesc = err?.response?.data?.error?.details?.[0]?.violations?.[0]?.description ||
                                err?.response?.data?.error?.details?.[0]?.description ||
                                '';
                            const errMsg = detailsDesc ? `${rawErrMsg} (${detailsDesc})` : rawErrMsg;
                            // Authentication failure: stop immediately
                            if (status === 401 || status === 403) {
                                throw new GeminiApiError(`Gemini API authentication error (${status}): ${errMsg}. Please verify GEMINI_API_KEY in backend/.env.`, status, false);
                            }
                            // 503 High Demand Spikes: backoff retry then try next model
                            if (status === 503) {
                                if (retryCount < maxRetries) {
                                    console.warn(`[GeminiService] Model ${model} returned 503 (high demand). Retrying in 1.5s...`);
                                    await sleep(1500);
                                    retryCount++;
                                    continue;
                                }
                                else {
                                    console.warn(`[GeminiService] Model ${model} is overloaded (503). Trying fallback model...`);
                                    break;
                                }
                            }
                            // 429 Rate Limit: backoff retry then try next model
                            if (status === 429) {
                                if (retryCount < maxRetries) {
                                    console.warn(`[GeminiService] Rate limit hit for ${model}. Backing off for 2s before retry...`);
                                    await sleep(2000);
                                    retryCount++;
                                    continue;
                                }
                                else {
                                    console.warn(`[GeminiService] Model ${model} quota exhausted. Trying fallback model...`);
                                    break;
                                }
                            }
                            // 400 Bad Request indicates unsupported parameter in this payload variant -> try next payload
                            if (status === 400) {
                                break;
                            }
                            // 404 indicates model not found -> try next model
                            if (status === 404) {
                                break;
                            }
                            break;
                        }
                    }
                }
            }
        }
        const finalStatus = lastError?.response?.status || 503;
        const rawErrMsg = lastError?.response?.data?.error?.message || lastError?.message || '';
        const detailsDesc = lastError?.response?.data?.error?.details?.[0]?.violations?.[0]?.description ||
            lastError?.response?.data?.error?.details?.[0]?.description ||
            '';
        const finalMessage = detailsDesc ? `${rawErrMsg} (${detailsDesc})` : rawErrMsg;
        if (finalStatus === 429) {
            throw new GeminiApiError(`Gemini API rate limit or quota exceeded: ${finalMessage || 'Quota exhausted'}. Please wait a moment before retrying.`, 429, true, lastError?.response?.data);
        }
        if (finalStatus === 503) {
            throw new GeminiApiError(`Gemini AI service unavailable (503): High demand spikes detected on upstream Google servers. Please retry in a few moments.`, 503, true, lastError?.response?.data);
        }
        throw new GeminiApiError(`Gemini AI service error (${finalStatus}): ${finalMessage || 'Failed to communicate with Google Gemini API'}`, finalStatus, true, lastError?.response?.data);
    }
    /**
     * Generates structured and validated typed JSON using Gemini Interactions API with resilient repair.
     */
    static async generateStructuredJson(prompt, schemaHint, timeoutMs = 45000, options) {
        const enrichedPrompt = schemaHint
            ? `${prompt}\n\nSTRICT JSON INSTRUCTION: Return strictly valid JSON conforming to ${schemaHint}. Output ONLY the JSON object. Do not include markdown code block formatting (no \`\`\`json), no trailing commas, no conversational preamble or postscript. Must start with { and end with }.`
            : prompt;
        const result = await this.generateInteraction(enrichedPrompt, true, timeoutMs, {
            ...options,
            maxOutputTokens: options?.maxOutputTokens ?? 8192,
        });
        return this.safeParseJson(result.text, result.model);
    }
    /**
     * Generates plain text output.
     */
    static async generateText(prompt, options) {
        const timeout = options?.timeoutMs ?? gemini_1.geminiConfig.timeouts.chatMs;
        const result = await this.generateInteraction(prompt, false, timeout, options);
        return result.text;
    }
    /**
     * Generates conversational response preserving multi-turn chat context.
     */
    static async generateChatResponse(history, newMessage, systemPrompt = gemini_1.geminiConfig.systemPrompts.aiTutor) {
        const dialogueParts = [];
        dialogueParts.push(`[System Instructions]\n${systemPrompt}\n`);
        if (Array.isArray(history) && history.length > 0) {
            dialogueParts.push('[Previous Conversation History]');
            const recentTurns = history.slice(-10);
            for (const turn of recentTurns) {
                const roleLabel = turn.role === 'user' ? 'Student' : 'AI Tutor';
                dialogueParts.push(`${roleLabel}: ${turn.text.trim()}`);
            }
            dialogueParts.push('\n[Current Message]');
        }
        dialogueParts.push(`Student: ${newMessage.trim()}`);
        dialogueParts.push('AI Tutor:');
        const fullPrompt = dialogueParts.join('\n');
        return this.generateText(fullPrompt, { temperature: 0.6 });
    }
    /**
     * Transcribes spoken candidate audio using Gemini Multimodal Audio Understanding.
     */
    static async transcribeAudio(base64Audio, mimeType = 'audio/webm', context) {
        const apiKey = this.getApiKey();
        // Prioritize high-performance, ultra-reliable models that natively accept inline audio data
        const primary = this.getModel();
        const audioCapableModels = Array.from(new Set([
            primary,
            'gemini-flash-lite-latest',
            'gemini-3.1-flash-lite',
            'gemini-flash-latest',
            'gemini-3.5-flash-lite',
        ]));
        let lastError = null;
        // Clean mimeType (remove codecs=opus parameter if present for Gemini API compatibility)
        const normalizedMime = mimeType.split(';')[0].trim().toLowerCase() || 'audio/webm';
        const contextInstruction = context
            ? `Interview Context:
- Role: ${context.role || 'Software Engineer'}
- Topic: ${context.topic || 'Data Structures & Algorithms'}
- Current Interviewer Question: "${context.questionText || ''}"`
            : '';
        const promptText = `You are a high-accuracy technical speech recognition system for computer science and DSA technical coding interviews.
${contextInstruction}

TASK:
Accurately transcribe the candidate's spoken response into clear, fluent English text.
1. Transcribe the spoken words faithfully and verbatim.
2. Accurately recognize Indian English accents, global ESL speech, and rapid technical delivery.
3. Preserve all technical terminology, including:
   - Data Structures: Array, String, LinkedList, Stack, Queue, HashMap, HashSet, Tree, BST, Heap, PriorityQueue, Graph, Trie, SegmentTree, BIT.
   - Algorithms: Two Pointers, Sliding Window, Binary Search, QuickSort, MergeSort, BFS, DFS, Dijkstra, Bellman-Ford, Dynamic Programming, Greedy, Backtracking, Recursion.
   - Complexity Notations: O(1), O(log n), O(n), O(n log n), O(n^2), O(2^n), O(V + E), O(V^2), O(E log V).
   - Code concepts: loops, pointers, indices, base cases, recurrence, memoization, hash table collisions.
4. If the candidate corrects themselves, transcribe their words naturally as spoken.
5. If the audio contains only silence, static, or background noise with no words spoken, reply ONLY with: "[NO_SPEECH]".
6. Do NOT add meta commentary, explanations, or greeting headers. Return ONLY the transcribed text.`;
        for (const model of audioCapableModels) {
            const modelName = model.startsWith('models/') ? model.replace(/^models\//, '') : model;
            const url = gemini_1.geminiConfig.endpoints.generateContent(modelName, apiKey);
            const payload = {
                contents: [
                    {
                        parts: [
                            { text: promptText },
                            {
                                inlineData: {
                                    mimeType: normalizedMime,
                                    data: base64Audio,
                                },
                            },
                        ],
                    },
                ],
                generationConfig: {
                    temperature: 0.1,
                    maxOutputTokens: 2048,
                },
            };
            try {
                console.log(`[GeminiService] Transcribing audio with model ${modelName} (MIME: ${normalizedMime}, Base64: ${base64Audio.length} chars)...`);
                const response = await axios_1.default.post(url, payload, {
                    headers: { 'Content-Type': 'application/json' },
                    timeout: 35000,
                });
                const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
                if (typeof text === 'string') {
                    const cleaned = text.trim();
                    if (cleaned === '[NO_SPEECH]' ||
                        cleaned === '[No audible speech detected]' ||
                        cleaned === '[SILENT]' ||
                        cleaned === '<noise>') {
                        console.log(`[GeminiService] Audio contained no spoken speech on ${modelName}.`);
                        return '';
                    }
                    console.log(`[GeminiService] Audio successfully transcribed with ${modelName} (${cleaned.length} chars).`);
                    return cleaned;
                }
            }
            catch (err) {
                lastError = err;
                const status = err?.response?.status;
                const msg = err?.response?.data?.error?.message || err.message;
                console.warn(`[GeminiService] Audio transcription failed on ${modelName} (HTTP ${status}): ${msg}`);
                // If auth error, do not retry other models
                if (status === 401 || status === 403) {
                    throw new GeminiApiError(`Gemini API authentication failed (${status}): ${msg}. Please verify your GEMINI_API_KEY in backend/.env.`, status, false);
                }
            }
        }
        const errStatus = lastError?.response?.status || 500;
        const errMessage = lastError?.response?.data?.error?.message || lastError?.message || 'Audio processing error';
        throw new GeminiApiError(`Failed to transcribe audio with Gemini AI (${errStatus}): ${errMessage}`, errStatus, true, lastError?.response?.data);
    }
}
exports.GeminiService = GeminiService;
