import { useState } from "react";
import type { AIAnalysis, Job } from "../types";
import { analyzeJob } from "../api";

type JobCardProps = { job: Job };

export default function JobCard({ job }: JobCardProps) {
    const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
    const [loading, setLoading] = useState(false);
    const [failed, setFailed] = useState(false);

    async function onCardClick() {
        // One Gemini call per card unless the last try failed
        if (loading || analysis) {
            return;
        }

        setFailed(false);
        setLoading(true);
        try {
            setAnalysis(await analyzeJob(job.title, job.description));
        } catch (error) {
            console.error(error);
            setFailed(true);
        } finally {
            setLoading(false);
        }
    }

    // 
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
            <p className="text-sm text-slate-500 line-clamp-3">{job.description}</p>
            {!analysis && !loading && (
                <p className="text-xs text-slate-400">Click the card for a plain-English summary</p>
            )}
            {job.salaryRange && <p className="font-medium">{job.salaryRange}</p>}
            {loading && <p className="text-sm text-slate-600">Summarizing...</p>}
            {failed && <p className="text-sm text-slate-600">Could not summarize. Click to try again.</p>}
            {analysis && (
                <div className="rounded-md bg-white/70 p-3 text-sm text-slate-700">
                    <p>{analysis.summary}</p>
                    {analysis.keySkills.length > 0 && (
                        <p className="mt-2">{analysis.keySkills.join(", ")}</p>
                    )}
                    {analysis.salaryRange && (
                        <p className="mt-2 font-medium">{analysis.salaryRange}</p>
                    )}
                </div>
            )}
            <a
                href={job.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()} // Apply should not start a summary
                className="rounded-md bg-white mt-auto shrink-0 px-2 py-2 hover:bg-emerald-300 text-center"
            >
                Apply
            </a>
        </div>
    );
}
