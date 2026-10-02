import type { AIAnalysis } from '@/types';
import { GoogleGenAI } from "@google/genai";

// Called from POST /api/analyze with one job's title + description
export const analyzeJob = async (title: string, description: string): Promise<AIAnalysis> => {
    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY ?? '',
    });

    // We ask for JSON in prompt; the model still sometimes wraps it in a markdown
    const prompt = `Rewrite this job posting in plain language a tired job seeker can understand.

        Rules for summary:
        - Exactly 2 short sentences
        - No jargon, buzzwords, or marketing filler (no "fast-paced", "rockstar", "synergy", "self-starter")
        - Say what the job is, who it is for, and what you would actually do day to day
        - Do not copy sentences from the original posting

        Respond with ONLY valid JSON (no markdown, no extra text):
        {
        "summary": "two short plain-language sentences",
        "keySkills": ["3 to 6 everyday skill names"],
        "salaryRange": "plain salary if clearly stated, otherwise omit"
        }

        Title: ${title}
        Description: ${description}
        `;

    // No built-in timeout on the SDK so we race Gemini against the 30s timer.
    const GEMINI_TIMEOUT_MS = 30_000;

    const response = await Promise.race([
        ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: prompt,
        }),
        new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Gemini request timed out')), GEMINI_TIMEOUT_MS)
        ),
    ]);

    // Turn model output into plain text, then into a JS object.
    const text = response.text ?? '';
    const cleaned = text.replace(/```json\n|```/g, '').trim();
    
    let parsed: Record<string, unknown>; 
    try {
        parsed = JSON.parse(cleaned || '{}') as Record<string, unknown>;
    } catch {
        throw new Error('Gemini returned invalid JSON');
    }

    // Do not trust parsed fields and Gemini can send wrong types.
    const summary = typeof parsed.summary === 'string' ? parsed.summary : '';
    const keySkills = Array.isArray(parsed.keySkills)
        ? parsed.keySkills.filter((s): s is string => typeof s === 'string')
        : [];
    const salaryRange = typeof parsed.salaryRange === 'string' ? parsed.salaryRange : '';
 
    return {
        summary: summary ?? '',
        keySkills: keySkills ?? [],
        salaryRange: salaryRange || undefined,
    };
};