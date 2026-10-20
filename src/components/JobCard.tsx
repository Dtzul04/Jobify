"use client";

import { useState } from "react";
import type { AIAnalysis, Job } from "@/types";
import { analyzeJob } from "@/lib/fetchJobs";
import { useAsync } from "@/hooks/useAsync";
import Card from "@/components/ui/Card";

type JobCardProps = { job: Job };

// One job tile: click card for POST /api/analyze summary; Apply opens listing (no summary).
export default function JobCard({ job }: JobCardProps) {
    const { loading, failed, error, run } = useAsync();
    const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);

    // One Gemini call per card unless retry after failure.
    async function onCardClick() {
        if (!job.description) {
            return;
        }

        if (loading || analysis) {
            return;
        }

        run(async () => {
            setAnalysis(await analyzeJob(job.title, job.description));
        });
    }

    return (
        <Card
            role="button"
            tabIndex={0}
            onClick={onCardClick}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    onCardClick();
                }
            }}
            className="flex h-full cursor-pointer flex-col gap-3 border border-emerald-200/70 p-6 shadow-md transition duration-200 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-lg"
        >
            <div className="space-y-1">
                <h3 className="text-xl font-bold leading-snug text-text">{job.title}</h3>
                <p className="text-base font-medium text-text">{job.company}</p>
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-text-muted">
                {job.location && <span>{job.location}</span>}
                {job.employmentType && (
                    <span className="rounded-full bg-surface-muted px-2 py-0.5 text-xs font-medium">
                        {job.employmentType}
                    </span>
                )}
            </div>
            {job.salaryRange && (
                <p className="text-sm font-medium text-brand">{job.salaryRange}</p>
            )}
            <p className="text-sm text-text-muted line-clamp-3">
                {job.description || "No description at this time"}
            </p>

            {job.description && !analysis && !loading && !failed && (
                <p className="text-xs text-text-muted">Click the card for a plain-English summary</p>
            )}
            {loading && <p className="text-sm text-text-muted">Summarizing...</p>}

            {analysis && (
                <div
                    className="space-y-2 rounded-md border border-emerald-200/80 bg-surface-muted/80 p-3 text-sm"
                    onClick={(e) => e.stopPropagation()}
                >
                    <p className="font-medium text-text">Summary</p>
                    <p className="text-text-muted">{analysis.summary}</p>
                    {analysis.keySkills.length > 0 && (
                        <p className="text-text-muted">
                            <span className="font-medium text-text">Skills: </span>
                            {analysis.keySkills.join(", ")}
                        </p>
                    )}
                    {analysis.salaryRange && (
                        <p className="text-text-muted">
                            <span className="font-medium text-text">Salary (AI): </span>
                            {analysis.salaryRange}
                        </p>
                    )}
                </div>
            )}

            {failed && (
                <div className="flex flex-wrap items-center gap-2 text-sm text-text-muted">
                    <p>{error}</p>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onCardClick();
                        }}
                        className="rounded-md bg-surface-muted px-2 py-1 hover:bg-emerald-200"
                    >
                        Try again
                    </button>
                </div>
            )}

            {job.applyUrl ? (
                <a
                    href={job.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="mt-auto shrink-0 rounded-md bg-brand px-3 py-2 text-center text-sm font-medium text-white hover:bg-brand-hover"
                >
                    Apply
                </a>
            ) : (
                <p className="mt-auto shrink-0 py-2 text-center text-sm text-text-muted">
                    No link available
                </p>
            )}
        </Card>
    );
}
