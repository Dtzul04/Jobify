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