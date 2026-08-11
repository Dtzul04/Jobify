import JobCard from "./JobCard";

type JobListProps = {
    jobs: {
        id: number;
        title: string;
        company: string;
        location: string;
        employmentType: string;
        applyUrl: string;
    }[];
}

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