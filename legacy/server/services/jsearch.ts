import type { JSearchJob, EmploymentType, Job } from '../types/index.js';

export async function jsearch(query: string, employmentType: EmploymentType): Promise<Job[]> {
    let url = `https://jsearch.p.rapidapi.com/search-v2?query=${encodeURIComponent(query)}&page=1&num_pages=1&country=us`;
    if (employmentType !== 'all') {
        url += `&employment_types=${employmentType}`;
    }

    try {
        const response = await fetch(url, {
            headers: {
                'X-RapidAPI-Key': process.env.JSEARCH_API_KEY ?? '',
                'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch jobs from JSearch API');
        }

        // JSearch puts the listings at data.jobs, not the top level
        const payload = (await response.json()) as { data?: { jobs?: JSearchJob[] } };
        const jobs = payload.data?.jobs ?? [];

        // Map RapidAPI field names to the Job shape the UI uses
        return jobs.map((job): Job => ({
            id: job.job_id,
            title: job.job_title,
            description: job.job_description,
            company: job.employer_name,
            location: [job.job_city, job.job_state].filter(Boolean).join(', '),
            employmentType: job.job_employment_type as EmploymentType,
            applyUrl: job.job_apply_link,
        }));
    } catch (error) {
        console.error('JSearch API request failed:', error);
        throw new Error('Failed to fetch jobs from JSearch API');
    }
}
