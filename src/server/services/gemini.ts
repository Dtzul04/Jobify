import type { AIAnalysis } from '../types/index.js';
import { GoogleGenAI } from "@google/genai";

export const analyzeJob = async (title: string, description: string): Promise<AIAnalysis> => {
    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY ?? '',
    });

    // Prompt for the AI to analyze the job posting and return the summary, key skills, and salary range
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