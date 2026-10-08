"use client";

import { useState } from "react";
import type { AIAnalysis, Job } from "@/types";
import { analyzeJob } from "@/lib/fetchJobs";
import { useAsync } from "@/hooks/useAsync";

type JobCardProps = { job: Job };

export default function JobCard({ job }: JobCardProps) {
    const { loading, failed, error, run } = useAsync();
    const [analysis, setAnalysis] = useState<AIAnalysis| null>(null);

    async function onCardClick() {
        // Nothing for Gemini to summarize without a description
        if (!job.description) {
            return;
        }

        // One Gemini call per card unless the last try failed
        if (loading || analysis) {
            return;
        }

        // useAsync tracks the loading and failure for this request
        run(async () => {
            setAnalysis(await analyzeJob(job.title, job.description));
        });
    }

    // Whole card is clickable to request a summary 
    return (
        <div
            role="button"
            tabIndex={0}
            onClick={onCardClick}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    onCardClick();
                }
            }}
            className="flex flex-col gap-2 h-full rounded-lg bg-emerald-100 p-6 shadow-md cursor-pointer"
        >
            <h3 className="text-xl font-bold">{job.title}</h3>
            <h2 className="text-slate-700">{job.company}</h2>
            <p className="text-sm text-slate-500">{job.location}</p>
            <p className="text-sm text-slate-500">{job.employmentType}</p>
            <p className="text-sm text-slate-500 line-clamp-3">{job.description || "No description at this time"}</p>
            {job.description && !analysis && !loading && !failed && (
                <p className="text-xs text-slate-400">Click the card for a plain-English summary</p>
            )}
            {job.salaryRange && <p className="font-medium">{job.salaryRange}</p>}
            {loading && <p className="text-sm text-slate-600">Summarizing...</p>}
            {/* Error message from the route, with a retry button */}
            {failed && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                    <p>{error}</p>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation(); // Keep the click from also hitting the card
                            onCardClick();
                        }}
                        className="rounded-md bg-white px-2 py-1 hover:bg-emerald-300"
                    >
                        Try again
                    </button>
                </div>
            )}
            {/* Some jobs may come back without an apply link */}
            {job.applyUrl ? (
                <a
                    href={job.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()} // Apply should not start a summary
                    className="rounded-md bg-white mt-auto shrink-0 px-2 py-2 hover:bg-emerald-300 text-center"
                >
                    Apply
                </a>
            ) : (
                <p className="mt-auto shrink-0 px-2 py-2 text-center text-sm text-slate-500">
                    No link available
                </p>
            )}
        </div>
    );
}
