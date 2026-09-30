import type { Job, AIAnalysis } from '../types';

const API_URL = import.meta.env.VITE_API_URL;

function wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// Ignore errors — Render may still be asleep; search will retry
export function wakeApi() {
    fetch(`${API_URL}/api/health`).catch(() => {});
}

export const searchJobs = async (query: string, employmentType: string): Promise<Job[]> => {
    const url = `${API_URL}/api/jobs?query=${encodeURIComponent(query)}&employmentType=${encodeURIComponent(employmentType)}`;
    let lastError: unknown;

    // Render free tier often drops the first request while the box boots
    for (let attempt = 1; attempt <= 5; attempt++) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to search jobs');
            }
            return (await response.json()) as Job[];
        } catch (error) {
            lastError = error;
            if (attempt < 5) {
                await wait(10000);
            }
        }
    }

    throw lastError;
}

export const analyzeJob = async (title: string, description: string): Promise<AIAnalysis> => {
    const response = await fetch(`${API_URL}/api/analyze`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
    });

    if (!response.ok) {
        throw new Error('Failed to analyze job');
    }

    return response.json() as Promise<AIAnalysis>;
}
