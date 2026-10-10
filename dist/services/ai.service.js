"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiService = exports.AiService = void 0;
/**
 * AI Copilot Service
 * Interfaces with LLM providers (Gemini / OpenAI) or deterministic template fallback.
 */
class AiService {
    async generateSummary(extractedText, fields) {
        return {
            summaryEn: 'Extracted summary content',
            summaryTe: '',
            provider: 'template',
        };
    }
}
exports.AiService = AiService;
exports.aiService = new AiService();
