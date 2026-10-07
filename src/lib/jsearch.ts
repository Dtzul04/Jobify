import type { JSearchJob, EmploymentType, Job } from '@/types';

function withFallback(value: string | null | undefined, fallback: string): string {
    const cleaned = value?.trim();

    if (cleaned) {
        return cleaned;
    }

    return fallback;
}

export async function jsearch(query: string, employmentType: EmploymentType): Promise<Job[]> {
    let url = `https://jsearch.p.rapidapi.com/search-v2?query=${encodeURIComponent(query)}&page=1&num_pages=1&country=us`;
    if (employmentType !== 'all') {
        url += `&employment_types=${employmentType}`;
    }

    try {
        // Abort if the RapidAPI takes longer thant 15s
        const response = await fetch(url, {
            signal: AbortSignal.timeout(15_000),
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
        return jobs.map((job, index): Job => ({
            id: withFallback(job.job_id, `job-${index}`),
            title: withFallback(job.job_title, 'Untitled role'),
            description: withFallback(job.job_description, ''),
            company: withFallback(job.employer_name, 'Untitled company name'),
            location: withFallback([job.job_city, job.job_state].filter(Boolean).join(', '), 'Location not listed'),
            employmentType: job.job_employment_type?.trim() || undefined,
            applyUrl: withFallback(job.job_apply_link, ''),
        }));
    } catch (error) {
        console.error('JSearch API request failed:', error);
        throw new Error('Failed to fetch jobs from JSearch API');
    }
}
