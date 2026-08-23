export interface JSearchJob {
    job_id: string;
    job_title: string;
    job_description: string;
    employer_name: string;
    job_city?: string;
    job_state?: string;
    job_employment_type: string;
    job_apply_link: string;
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