import type { JSearchJob } from '../types/index.js';
import type { EmploymentType } from '../types/index.js';
import type { Job } from '../types/index.js';

export async function jsearch(query: string, employmentType: EmploymentType): Promise<Job[]> {
    let url = `https://jsearch.p.rapidapi.com/search-v2?query=${encodeURIComponent(query)}&page=1&num_pages=1&country=us`;
    // add the employment type to the URL if it is not all
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

        // parse the response as a JSON object
        const payload = (await response.json()) as { data?: { jobs?: JSearchJob[] } };
        const jobs = payload.data?.jobs ??[];

        return jobs.map((job: JSearchJob): Job => ({
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


