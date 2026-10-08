import type { Job, AIAnalysis } from '@/types';

export const searchJobs = async (query: string, employmentType: string): Promise<Job[]> => {
    const url = `/api/jobs?query=${encodeURIComponent(query)}&employmentType=${encodeURIComponent(employmentType)}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to search jobs');
    }
    return (await response.json() as Job[]);
}

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
