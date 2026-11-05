"use client";

import Header from "@/components/Header";
import JobList from "@/components/JobList";
import CompareView from "@/components/CompareView";
import type { Job } from "@/types";
import { useState } from "react";
import { searchJobs } from "@/lib/fetchJobs";
import { useAsync } from "@/hooks/useAsync";

const MAX_COMPARE = 3;

// Home page: owns search state, calls /api/jobs via fetchJobs and passes data to Header + JobList.
export default function Home() {
    const [employmentType, setEmploymentType] = useState('all');
    const [jobs, setJobs] = useState<Job[]>([]);
    const [hasSearched, setHasSearched] = useState(false);
    // Selected jobs for side-by-side compare (bounded list).
    const [selectedJobs, setSelectedJobs] = useState<Job[]>([]);
    const { loading, failed, run } = useAsync();
    const [compareMessage, setCompareMessage] = useState("");

    // Header/SearchBar call this with a query like "Nurse in Dallas"
    async function onSearch(query: string) {
        // false until first search — JobList uses this for the empty prompt.
        setHasSearched(true);
        setJobs([]);
        setSelectedJobs([]);
        setCompareMessage("");
        run(async () => {
            setJobs(await searchJobs(query, employmentType))
        });
    }

    // Add or remove a job from the compare list. Cap at MAX_COMPARE.
    function onToggleCompare(job: Job) {
        const alreadySelected = selectedJobs.some((j) => j.id === job.id);

        if (alreadySelected) {
            setSelectedJobs(selectedJobs.filter((j) => j.id !== job.id));
            setCompareMessage("");
            return;
        }

        if (selectedJobs.length >= MAX_COMPARE) {
            setCompareMessage(`You can compare up to ${MAX_COMPARE} jobs.`);
            return;
        }

        setSelectedJobs([...selectedJobs, job]);
        setCompareMessage("");
    }

    return (
        <main className="flex flex-1 flex-col bg-surface-muted">
            <Header
                onSearch={onSearch}
                employmentType={employmentType}
                onEmploymentTypeChange={setEmploymentType}
            />

            {compareMessage && (
                <p className="mx-6 mb-2 text-sm text-text-muted">{compareMessage}</p>
            )}

            {selectedJobs.length > 0 && (
                <CompareView jobs={selectedJobs} onRemove={onToggleCompare} />
            )}

            <JobList
                jobs={jobs}
                loading={loading}
                hasSearched={hasSearched}
                failed={failed}
                selectedJobs={selectedJobs}
                onToggleCompare={onToggleCompare}
            />
        </main>
    );
}
