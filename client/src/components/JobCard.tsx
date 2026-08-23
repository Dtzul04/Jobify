import type { Job } from "../types";
type JobCardProps = { job: Job };

export default function JobCard({ job }: JobCardProps) {
    
    return  (
        <div className="flex flex-col gap-2 h-full rounded-lg bg-emerald-100 p-6 shadow-md">
            <h3 className="text-xl font-bold">{job.title}</h3>
            <h2 className="text-slate-700">{job.company}</h2>
            <p className="text-sm text-slate-500">{job.location}</p>
            <p className="text-sm text-slate-500">{job.employmentType}</p>
            <p className="text-sm text-slate-500 line-clamp-3">{job.description}</p>
            <p className="font-medium">{job.salaryRange && (<span>{job.salaryRange}</span>)}</p>
            <a href={job.applyUrl} target="_blank" rel="noopener noreferrer" className="rounded-md bg-white mt-auto shrink-0 px-2 py-2 gap-2 hover:bg-emerald-300 text-center">Apply</a>
        </div>
    );
}
