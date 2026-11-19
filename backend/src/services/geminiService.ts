import axios from 'axios';
import { geminiConfig } from '../config/gemini';

export class GeminiApiError extends Error {
  public statusCode: number;
  public canRetry: boolean;
  public details?: any;

  constructor(message: string, statusCode: number = 500, canRetry: boolean = true, details?: any) {
    super(message);
    this.name = 'GeminiApiError';
    this.statusCode = statusCode;
    this.canRetry = canRetry;
    this.details = details;
  }
}

export interface InteractionOptions {
  previousInteractionId?: string;
  temperature?: number;
  timeoutMs?: number;
  maxOutputTokens?: number;
}

export interface InteractionResult {
  text: string;
  interactionId?: string;
  model: string;
  raw?: any;
}

export interface ChatMessage {
  role: 'user' | 'bot' | 'model' | 'assistant';
  text: string;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class GeminiService {
  public static getApiKey(): string {
    return geminiConfig.apiKey;
  }

  public static getModel(): string {
    return geminiConfig.primaryModel;
  }

  public static getModels(): string[] {
    return geminiConfig.fallbackModels;
  }

  /**
   * Resilient JSON repair utility to handle LLM quirks:
   * - Strips markdown code block fences (```json ... ```)
   * - Removes illegal ASCII control characters
   * - Cleans conversational preface/postface
   * - Removes trailing commas before } and ]
   * - Auto-closes unclosed strings, objects, and arrays caused by response truncation
   */
  public static repairJson<T = any>(rawText: string): T {
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
    } catch {}

    // 4. Strip trailing commas before } or ]
    cleaned = cleaned.replace(/,\s*([}\]])/g, '$1');
    try {
      return JSON.parse(cleaned);
    } catch {}

    // 5. Locate outermost object or array boundary
    const firstBrace = cleaned.indexOf('{');
    const firstBracket = cleaned.indexOf('[');
    let startIdx = -1;

    if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
      startIdx = firstBrace;
    } else if (firstBracket !== -1) {
      startIdx = firstBracket;
    }

    if (startIdx === -1) {
      throw new Error('No JSON object or array found in model response');
    }

    cleaned = cleaned.slice(startIdx);

    // 6. Track bracket stack, handle strings and escapes, and repair truncation
    const stack: string[] = [];
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
        } else if (char === '}') {
          if (stack.length && stack[stack.length - 1] === '{') stack.pop();
        } else if (char === ']') {
          if (stack.length && stack[stack.length - 1] === '[') stack.pop();
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
  public static safeParseJson<T>(rawText: string, modelName: string = 'gemini'): T {
    try {
      const parsed = this.repairJson<T>(rawText);
      // If model wrapped response in an array [ { ... } ], unwrap the first element
      if (Array.isArray(parsed) && parsed.length === 1 && typeof parsed[0] === 'object' && parsed[0] !== null) {
        return parsed[0] as T;
      }
      return parsed;
    } catch (parseErr: any) {
      console.error(`[GeminiService] Failed to parse JSON from model ${modelName}:`, parseErr.message);
      console.error(`[GeminiService] Raw text snippet:\n${rawText.slice(0, 1000)}`);
      throw new GeminiApiError(
        'Gemini AI response could not be parsed as valid JSON. Please retry.',
        502,
        true,
        { rawText: rawText.slice(0, 2000), model: modelName, parseError: parseErr.message }
      );
    }
  }

  /**
   * Extracts model output text across various response structures:
   * - Gemini Interactions API (output_text, steps with model_output)
   * - Legacy generateContent response (candidates.content.parts)
   */
  public static extractTextFromResponse(data: any): string {
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
              .map((c: any) => {
                if (typeof c === 'string') return c;
                if (typeof c?.text === 'string') return c.text;
                return '';
              })
              .filter(Boolean);
            if (texts.length > 0) return texts.join('\n').trim();
          } else if (typeof step.content?.text === 'string') {
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
  public static async generateInteraction(
    prompt: string,
    isJson: boolean = false,
    timeoutMs: number = 45000,
    options?: InteractionOptions
  ): Promise<InteractionResult> {
    const apiKey = this.getApiKey();
    const models = this.getModels();
    let lastError: any = null;

    const interactionsUrl = `${geminiConfig.endpoints.interactions}?key=${apiKey}`;
    const maxTokens = options?.maxOutputTokens ?? 8192;

    for (const baseModel of models) {
      const modelVariants = baseModel.startsWith('models/')
        ? [baseModel, baseModel.replace(/^models\//, '')]
        : [baseModel, `models/${baseModel}`];

      for (const model of modelVariants) {
        const payloads: any[] = [];

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
              const response = await axios.post(interactionsUrl, payload, {
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
            } catch (err: any) {
              lastError = err;
              const status = err?.response?.status;
              const rawErrMsg = err?.response?.data?.error?.message || err.message || '';
              const detailsDesc =
                err?.response?.data?.error?.details?.[0]?.violations?.[0]?.description ||
                err?.response?.data?.error?.details?.[0]?.description ||
                '';
              const errMsg = detailsDesc ? `${rawErrMsg} (${detailsDesc})` : rawErrMsg;

              // Authentication failure: stop immediately
              if (status === 401 || status === 403) {
                throw new GeminiApiError(
                  `Gemini API authentication error (${status}): ${errMsg}. Please verify GEMINI_API_KEY in backend/.env.`,
                  status,
                  false
                );
              }

              // 503 High Demand Spikes: backoff retry then try next model
              if (status === 503) {
                if (retryCount < maxRetries) {
                  console.warn(`[GeminiService] Model ${model} returned 503 (high demand). Retrying in 1.5s...`);
                  await sleep(1500);
                  retryCount++;
                  continue;
                } else {
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
                } else {
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
    const detailsDesc =
      lastError?.response?.data?.error?.details?.[0]?.violations?.[0]?.description ||
      lastError?.response?.data?.error?.details?.[0]?.description ||
      '';
    const finalMessage = detailsDesc ? `${rawErrMsg} (${detailsDesc})` : rawErrMsg;

    if (finalStatus === 429) {
      throw new GeminiApiError(
        `Gemini API rate limit or quota exceeded: ${finalMessage || 'Quota exhausted'}. Please wait a moment before retrying.`,
        429,
        true,
        lastError?.response?.data
      );
    }

    if (finalStatus === 503) {
      throw new GeminiApiError(
        `Gemini AI service unavailable (503): High demand spikes detected on upstream Google servers. Please retry in a few moments.`,
        503,
        true,
        lastError?.response?.data
      );
    }

    throw new GeminiApiError(
      `Gemini AI service error (${finalStatus}): ${finalMessage || 'Failed to communicate with Google Gemini API'}`,
      finalStatus,
      true,
      lastError?.response?.data
    );
  }

  /**
   * Generates structured and validated typed JSON using Gemini Interactions API with resilient repair.
   */
  public static async generateStructuredJson<T>(
    prompt: string,
    schemaHint?: string,
    timeoutMs: number = 45000,
    options?: InteractionOptions
  ): Promise<T> {
    const enrichedPrompt = schemaHint
      ? `${prompt}\n\nSTRICT JSON INSTRUCTION: Return strictly valid JSON conforming to ${schemaHint}. Output ONLY the JSON object. Do not include markdown code block formatting (no \`\`\`json), no trailing commas, no conversational preamble or postscript. Must start with { and end with }.`
      : prompt;

    const result = await this.generateInteraction(enrichedPrompt, true, timeoutMs, {
      ...options,
      maxOutputTokens: options?.maxOutputTokens ?? 8192,
    });

    return this.safeParseJson<T>(result.text, result.model);
  }

  /**
   * Generates plain text output.
   */
  public static async generateText(
    prompt: string,
    options?: InteractionOptions
  ): Promise<string> {
    const timeout = options?.timeoutMs ?? geminiConfig.timeouts.chatMs;
    const result = await this.generateInteraction(prompt, false, timeout, options);
    return result.text;
  }

  /**
   * Generates conversational response preserving multi-turn chat context.
   */
  public static async generateChatResponse(
    history: ChatMessage[],
    newMessage: string,
    systemPrompt: string = geminiConfig.systemPrompts.aiTutor
  ): Promise<string> {
    const dialogueParts: string[] = [];

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
}
