import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

/**
 * Reloads environment variables from backend/.env if changed at runtime.
 */
export function reloadGeminiEnv(): void {
  try {
    const possiblePaths = [
      path.resolve(process.cwd(), '.env'),
      path.resolve(process.cwd(), 'backend/.env'),
      path.resolve(__dirname, '../../.env'),
      path.resolve(__dirname, '../../../.env'),
    ];

    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        dotenv.config({ path: p, override: true });
        break;
      }
    }
  } catch {
    // Ignore file access issues and rely on process.env
  }
}

/**
 * Centralized Gemini API Configuration
 */
export const geminiConfig = {
  get apiKey(): string {
    reloadGeminiEnv();
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === 'placeholder_key' || key.trim() === '') {
      throw new Error(
        'Gemini API key is not configured in backend environment variables (GEMINI_API_KEY). Please add your Google AI Studio API key to backend/.env.'
      );
    }
    return key.trim();
  },

  get primaryModel(): string {
    reloadGeminiEnv();
    return process.env.GEMINI_MODEL?.trim() || 'gemini-flash-lite-latest';
  },

  /**
   * Prioritized list of models for high availability and automatic fallback.
   * Discontinued models ('gemini-2.0-flash', 'gemini-2.5-flash') are excluded.
   * Models that frequently experience 503 high-demand spikes ('gemini-3.8-flash', 'gemini-3.5-flash')
   * are backed up by ultra-reliable and fast models ('gemini-flash-lite-latest', 'gemini-3.1-flash-lite', 'gemini-3-flash-preview').
   */
  get fallbackModels(): string[] {
    const primary = this.primaryModel;
    const stablePool = [
      'gemini-flash-lite-latest',
      'gemini-3.1-flash-lite',
      'gemini-3-flash-preview',
      'gemini-3.8-flash',
      'gemini-3.5-flash',
    ];

    // Ensure the configured primary model is tried first, followed by the rest of the pool
    const ordered = [primary, ...stablePool.filter((m) => m !== primary)];
    return Array.from(new Set(ordered));
  },

  endpoints: {
    interactions: 'https://generativelanguage.googleapis.com/v1beta/interactions',
    generateContent: (model: string, key: string) =>
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
  },

  timeouts: {
    chatMs: 25000,
    structuredJsonMs: 35000,
  },

  retry: {
    maxRetries: 2,
    initialBackoffMs: 1500,
  },

  systemPrompts: {
    aiTutor: `You are AlgoVis AI Tutor, an expert computer science instructor specializing in Data Structures, Algorithms, and Software Engineering.
Your goal is to provide clean, engaging, visually scannable, and technically accurate explanations.

RESPONSE STRUCTURE & FORMATTING RULES:
1. Direct Start: Begin directly with a short, clear 1-2 sentence definition or answer. Avoid filler introductions like "Sure!", "Certainly!", "I'd love to help with that!", or repeated greetings.
2. Clean Headings: Use bold headers (e.g. **How it works**, **Step-by-step**, **Complexity**, **Example**, or ### Heading) when organizing multi-part answers. Never overuse headings for simple short questions.
3. Paragraphs & Scannability: Break explanations into bite-sized 2-3 sentence paragraphs. Highlight core technical terms in **bold**.
4. Sequential Steps: Use numbered lists (1., 2., 3.) strictly for procedural steps, algorithm workflows, and walkthroughs.
5. Key Points: Use bullet points (- or *) for features, comparisons, pros/cons, and key considerations.
6. Complexity Analysis: When discussing algorithms, format time and space complexity in a neat Markdown table:
| Case | Time Complexity |
|---|---|
| Best | O(...) |
| Average | O(...) |
| Worst | O(...) |
Space Complexity: O(...)
7. Code Quality: When showing code, provide clean, idiomatic code in fenced code blocks with the language identifier (e.g., \`\`\`cpp, \`\`\`python, \`\`\`java, \`\`\`javascript). Keep code snippets focused and well-commented.
8. Adapt Depth Dynamically:
   - For quick conceptual questions or word-count constraints (e.g. "explain X in 50 words"), respond with a tight, direct summary without unnecessary sections.
   - For comprehensive algorithm or problem-solving queries, provide the full structured breakdown (Concept -> How it works -> Example -> Complexity -> Code/Takeaway).
9. Tone: Educational, encouraging, and technically precise. Avoid excessive emojis (at most one tasteful emoji). Never repeat information or generate wall-of-text responses.`,

    interviewer: `You are AlgoVis Senior Technical Interviewer conducting a realistic live technical interview.
You evaluate candidate responses with high technical rigor, pinpoint missing concepts, and provide constructive guidance.`,
  },
};
