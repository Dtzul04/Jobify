import type { Job } from '../types/index.js';

// Search fro jobs using the JSearch API
export const jsearch = async (query: string): Promise<Job[]> => {
    const response = await fetch(
        `https://jsearch.p.rapidapi.com/search-v2?query=${encodeURIComponent(query)}&page=1&num_pages=1&country=us`,
        {
            headers: {
                'X-RapidAPI-Key': process.env.JSEARCH_API_KEY ?? '',
                'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
            },
        }
    );

    if (!response.ok) {
        const body = await response.text();
        throw new Error(`JSearch request failed: ${response.status} ${body}`);
    }

    const payload = (await response.json()) as { data?: { jobs?: any[] } };
    const jobs = payload.data?.jobs ?? [];

    return jobs.map((job: any): Job => ({
        id: job.job_id,
        title: job.job_title,
        description: job.job_description,
        company: job.employer_name,
        location: [job.job_city, job.job_state].filter(Boolean).join(', '),
        employmentType: job.job_employment_type,
        applyUrl: job.job_apply_link,
    }));
};


