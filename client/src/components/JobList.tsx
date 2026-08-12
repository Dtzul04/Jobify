import JobCard from "./JobCard";
import type { Job } from "../types";

type JobListProps = { jobs: Job[] };

export default function JobList({ jobs }: JobListProps) {
    if (jobs.length === 0) {
        return <div className="job-list">No jobs found</div>;
    }
    
    return  (
        <div className="job-list">
            {/* The jobs array is mapped to the JobCard component and we used the key prop to give each job a uniqeu value*/}
            {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
            ))}
        </div>
    )
}