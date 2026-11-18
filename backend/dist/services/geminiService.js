"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiService = exports.GeminiApiError = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
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
    /**
     * Reloads backend/.env on demand so changes to GEMINI_API_KEY or GEMINI_MODEL
     * take effect immediately in running servers without requiring a manual restart.
     */
    static reloadEnvIfNeeded() {
        try {
            const possiblePaths = [
                path_1.default.resolve(process.cwd(), '.env'),
                path_1.default.resolve(process.cwd(), 'backend/.env'),
                path_1.default.resolve(__dirname, '../../.env'),
                path_1.default.resolve(__dirname, '../../../.env'),
            ];
            for (const p of possiblePaths) {
                if (fs_1.default.existsSync(p)) {
                    dotenv_1.default.config({ path: p, override: true });
                    break;
                }
            }
        }
        catch {
            // Ignore file access issues and use process.env
        }
    }
    /**
     * Retrieves and validates the Gemini API key from environment variables.
     */
    static getApiKey() {
        this.reloadEnvIfNeeded();
        const key = process.env.GEMINI_API_KEY;
        if (!key || key === 'placeholder_key' || key.trim() === '') {
            throw new GeminiApiError('Gemini API key is not configured in backend environment variables (GEMINI_API_KEY). Please configure a valid Google AI Studio API key in backend/.env.', 500, false);
        }
        return key.trim();
    }
    /**
     * Returns the primary configured model name.
     * Defaults to 'gemini-3.8-flash' as recommended by Google.
     */
    static getModel() {
        this.reloadEnvIfNeeded();
        return process.env.GEMINI_MODEL?.trim() || 'gemini-3.8-flash';
    }
    /**
     * Returns the prioritized list of supported models for fallback resolution.
     * Discontinued models ('gemini-2.0-flash', 'gemini-2.5-flash') are completely excluded.
     */
    static getModels() {
        const primary = this.getModel();
        const supported = ['gemini-3.8-flash', 'gemini-3.5-flash'];
        const models = [primary, ...supported.filter((m) => m !== primary)];
        return Array.from(new Set(models));
    }
    /**
     * Cleans potential markdown code blocks (```json ... ```) or conversational wrapper text
     * to extract pure valid JSON.
     */
    static cleanJsonText(rawText) {
        let cleaned = rawText.trim();
        if (cleaned.startsWith('```json')) {
            cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        }
        else if (cleaned.startsWith('```')) {
            cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }
        cleaned = cleaned.trim();
        // If conversational prose envelopes the JSON, locate the outermost JSON structure
        const firstBrace = cleaned.indexOf('{');
        const firstBracket = cleaned.indexOf('[');
        let startIdx = -1;
        let endIdx = -1;
        if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
            startIdx = firstBrace;
            endIdx = cleaned.lastIndexOf('}');
        }
        else if (firstBracket !== -1) {
            startIdx = firstBracket;
            endIdx = cleaned.lastIndexOf(']');
        }
        if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
            cleaned = cleaned.substring(startIdx, endIdx + 1);
        }
        return cleaned.trim();
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
                            .map((c) => (typeof c === 'string' ? c : c?.text || ''))
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
     * Central invocation method utilizing Google's Gemini Interactions API.
     * Features:
     * - Endpoint: https://generativelanguage.googleapis.com/v1beta/interactions
     * - Automatic backoff retry on 429 rate limit
     * - Fallback across supported models if one model quota is exhausted
     * - Detailed Google error reporting
     */
    static async generateInteraction(prompt, isJson = false, timeoutMs = 25000, options) {
        const apiKey = this.getApiKey();
        const models = this.getModels();
        let lastError = null;
        const interactionsUrl = `https://generativelanguage.googleapis.com/v1beta/interactions?key=${apiKey}`;
        for (const baseModel of models) {
            // Test both "gemini-3.8-flash" and "models/gemini-3.8-flash"
            const modelVariants = baseModel.startsWith('models/')
                ? [baseModel, baseModel.replace(/^models\//, '')]
                : [baseModel, `models/${baseModel}`];
            for (const model of modelVariants) {
                // Construct payload variants (structured format -> minimal payload)
                const payloads = [];
                if (isJson) {
                    payloads.push({
                        model,
                        input: prompt,
                        generation_config: {
                            temperature: options?.temperature ?? 0.3,
                        },
                        response_format: {
                            type: 'text',
                            mime_type: 'application/json',
                        },
                        ...(options?.previousInteractionId ? { previous_interaction_id: options.previousInteractionId } : {}),
                    });
                    payloads.push({
                        model,
                        input: prompt,
                        generation_config: {
                            temperature: options?.temperature ?? 0.3,
                        },
                        ...(options?.previousInteractionId ? { previous_interaction_id: options.previousInteractionId } : {}),
                    });
                }
                else {
                    payloads.push({
                        model,
                        input: prompt,
                        generation_config: {
                            temperature: options?.temperature ?? 0.7,
                        },
                        ...(options?.previousInteractionId ? { previous_interaction_id: options.previousInteractionId } : {}),
                    });
                }
                // Minimal baseline payload accepted by any Interactions API revision
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
                            // Authentication failure: abort immediately
                            if (status === 401 || status === 403) {
                                throw new GeminiApiError(`Gemini API authentication error (${status}): ${errMsg}. Please verify GEMINI_API_KEY in backend/.env.`, status, false);
                            }
                            // Rate limit / Quota exceeded (429)
                            if (status === 429) {
                                if (retryCount < maxRetries) {
                                    console.warn(`[GeminiService] Rate limit hit for ${model}. Backing off for 2.5s before retry...`);
                                    await sleep(2500);
                                    retryCount++;
                                    continue;
                                }
                                else {
                                    console.warn(`[GeminiService] Model ${model} quota exhausted: ${errMsg}. Trying fallback model...`);
                                    break; // Move to next payload or fallback model
                                }
                            }
                            // 400 Bad Request indicates unsupported field in this payload variant -> try next payload variant
                            if (status === 400) {
                                break;
                            }
                            // 404 indicates model or endpoint not found -> try next model variant
                            if (status === 404) {
                                break;
                            }
                            break;
                        }
                    }
                }
            }
        }
        // If all models and payload variations failed
        const finalStatus = lastError?.response?.status || 503;
        const rawErrMsg = lastError?.response?.data?.error?.message || lastError?.message || '';
        const detailsDesc = lastError?.response?.data?.error?.details?.[0]?.violations?.[0]?.description ||
            lastError?.response?.data?.error?.details?.[0]?.description ||
            '';
        const finalMessage = detailsDesc ? `${rawErrMsg} (${detailsDesc})` : rawErrMsg;
        if (finalStatus === 429) {
            throw new GeminiApiError(`Gemini API rate limit or quota exceeded: ${finalMessage || 'Quota exhausted'}. If you just created this key in Google AI Studio, please wait 30-60 seconds for quota propagation, or verify your project quota tier at https://aistudio.google.com/apikey.`, 429, true, lastError?.response?.data);
        }
        throw new GeminiApiError(`Gemini AI assessment service unavailable (${finalStatus}): ${finalMessage || 'Failed to communicate with Google Gemini Interactions API'}`, finalStatus, true, lastError?.response?.data);
    }
    /**
     * Generates structured and validated typed JSON using Gemini Interactions API.
     */
    static async generateStructuredJson(prompt, schemaHint, timeoutMs = 25000, options) {
        const result = await this.generateInteraction(prompt, true, timeoutMs, options);
        const cleaned = this.cleanJsonText(result.text);
        try {
            const parsed = JSON.parse(cleaned);
            return parsed;
        }
        catch (parseErr) {
            console.error(`Failed to parse Gemini JSON output for model ${result.model}:`, cleaned);
            throw new GeminiApiError('Gemini AI response could not be parsed as valid JSON. Please retry.', 502, true, { rawText: cleaned, model: result.model });
        }
    }
    /**
     * Generates plain text output (e.g. for general assistant responses and chatbot).
     */
    static async generateText(prompt, options) {
        const timeout = options?.timeoutMs ?? 20000;
        const result = await this.generateInteraction(prompt, false, timeout, options);
        return result.text;
    }
}
exports.GeminiService = GeminiService;
