import type { Job, AIAnalysis } from '@/types';

// Browser helper: GET /api/jobs (server calls JSearch).
export const searchJobs = async (query: string, employmentType: string): Promise<Job[]> => {
    const url = `/api/jobs?query=${encodeURIComponent(query)}&employmentType=${encodeURIComponent(employmentType)}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to search jobs');
    }
    return (await response.json() as Job[]);
}

// Browser helper: POST /api/analyze (server calls Gemini).
export const analyzeJob = async (title: string, description: string): Promise<AIAnalysis> => {
    const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
    });

    // Pass the route's user-friendly message on to JobCard
    if (!response.ok) {
        const body = await response.json();
        throw new Error(body.error ?? 'Something went wrong. Please try again.');
    }

    return response.json() as Promise<AIAnalysis>;
}

// Browser helper: GET /api/locations (server looks up many places).
export const searchLocations = async (query: string, signal?: AbortSignal): Promise<string[]> => {
    const url = `/api/locations?query=${encodeURIComponent(query)}`;
    const response = await fetch(url, { signal });
    if (!response.ok) {
        throw new Error('Failed to search locations');
    }
    return (await response.json()) as string[];
}
