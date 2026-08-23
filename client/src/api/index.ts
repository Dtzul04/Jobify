import type { Job, AIAnalysis } from '../types';

// Ignore errors — Render may still be asleep; search will retry
export function wakeApi() {
    fetch(`${import.meta.env.VITE_API_URL}/api/health`).catch(() => {});
}

export const searchJobs = async (query: string, employmentType: string): Promise<Job[]> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/jobs?query=${encodeURIComponent(query)}&employmentType=${encodeURIComponent(employmentType)}`);

    if (!response.ok) {
        throw new Error('Failed to search jobs');
    }

    return response.json() as Promise<Job[]>;
}

export const analyzeJob = async (title: string, description: string): Promise<AIAnalysis> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/analyze`, {
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
