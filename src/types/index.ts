export interface JSearchJob {
    job_id?: string | null;
    job_title?: string | null;
    job_description?: string | null;
    employer_name?: string | null;
    job_city?: string | null;
    job_state?: string | null;
    job_employment_type?: string | null;
    job_apply_link?: string | null;
}

export interface Job {
    id: string;
    title: string;
    description: string;
    company: string;
    location: string;
    employmentType?: string;
    salaryRange?: string;
    applyUrl: string;
}

export interface AIAnalysis {
    summary: string;
    keySkills: string[];
    salaryRange?: string;
}

export type EmploymentType = 'all' | 'FULLTIME' | 'PARTTIME' | 'CONTRACTOR' | 'INTERN';