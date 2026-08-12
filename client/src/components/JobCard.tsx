import type { Job } from "../types";
type JobCardProps = { job: Job };


export default function JobCard({ job }: JobCardProps) {
    return  (
        <div className="job-card">
            <h3>{job.title}</h3>
            <h2>{job.company}</h2>
            <p>{job.location}</p>
            <p>{job.employmentType}</p>
            <a href={job.applyUrl} target="_blank" rel="noopener noreferrer">Apply</a>
        </div>
    );
}