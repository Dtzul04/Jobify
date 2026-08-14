import JobCard from "./JobCard";
import type { Job } from "../types";

type JobListProps = { jobs: Job[] };

export default function JobList({ jobs }: JobListProps) {
    if (jobs.length === 0) {
        return <div className="job-list">Search to see jobs</div>;
    }

    return  (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-15 py-10 bg-emerald-50 ">
            {/* The jobs array is mapped to the JobCard component and we used the key prop to give each job a uniqeu value*/}
            {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
            ))}
        </div>
    )
}