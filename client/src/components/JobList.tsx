import JobCard from "./JobCard";
import type { Job } from "../types";

type JobListProps = { jobs: Job[], loading: boolean, hasSearched: boolean };

export default function JobList({ jobs, loading, hasSearched }: JobListProps) {
    let content;

    if (loading) {
        content = (
            <div className="flex flex-col items-center gap-3 py-20">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-200 border-t-teal-600" />
                <p className="text-slate-600">Searching...</p>
            </div>
        );
    } else if (!hasSearched) {
        content = <div className="py-20 text-center text-slate-600">Search to see jobs</div>;
    } else if (jobs.length === 0) {
        content = <div className="py-20 text-center text-slate-600">No results found.</div>;
    } else {
        content = (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {jobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                ))}
            </div>
        );
    }

    return (
        <section className="flex-1 mx-6 mb-6 rounded-2xl border border-emerald-200 bg-white/70 p-6">
            {content}
        </section>
    );
}
