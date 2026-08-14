import type { Job, AIAnalysis } from '../types';
// Search for jobs
export const searchJobs = async (query: string, employmentType: string): Promise<Job[]> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/jobs?query=${encodeURIComponent(query)}&employmentType=${encodeURIComponent(employmentType)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    // Check if the response is ok
    const data = await response.json();
    return data as Job[];
}

// Analyze a job
export const analyzeJob = async (title: string, description: string): Promise<AIAnalysis> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/analyze`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
    });
    // Check if the response is ok
    const data = await response.json();
    return data as AIAnalysis;
}


