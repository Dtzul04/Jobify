import type { AIAnalysis } from '../types/index.js';
import { GoogleGenAI } from "@google/genai";

export const analyzeJob = async (title: string, description: string): Promise<AIAnalysis> => {
    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY ?? '',
    });

    // Prompt for the AI to analyze the job posting and return the summary, key skills, and salary range
    const prompt = `Analyze this job posting and respond with ONLY valid JSON (no markdown):
    {
      "summary": "2-3 sentence summary",
      "keySkills": ["skill1", "skill2"],
      "salaryRange": "optional string or omit"
    }
    Title: ${title}
    Description: ${description}
    `;

    // Generate content using the Gemini API
    const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
    })

    const text = response.text ?? '';

    // Clean the text to remove the markdown code block
    const cleaned = text?.replace(/```json\n|```/g, '').trim();
    const parsed = JSON.parse(cleaned ?? '{}');

    // Return the summary, key skills, and salary range
    return {
        summary: parsed.summary ?? '',
        keySkills: parsed.keySkills ?? [],
        salaryRange: parsed.salaryRange ?? '',
    };
};