"use client";

import Header from "@/components/Header";
import JobList from "@/components/JobList";
import type { Job } from "@/types";
import { useState } from "react";
import { searchJobs } from "@/lib/fetchJobs";
import { useAsync } from "@/hooks/useAsync";

// Home page: owns search state, calls /api/jobs via fetchJobs and passes data to Header + JobList.
export default function Home() {
    const [employmentType, setEmploymentType] = useState('all');
    const [jobs, setJobs] = useState<Job[]>([]);
    const [hasSearched, setHasSearched] = useState(false);
    const { loading, failed, run } = useAsync();

    // Header/SearchBar call this with a query like "Nurse in Dallas"
    async function onSearch(query: string) {
        // false until first search — JobList uses this for the empty prompt.
        setHasSearched(true);
        setJobs([]);
        run(async () => {
            setJobs(await searchJobs(query, employmentType))
        });
    }

    return (
        <main className="flex flex-1 flex-col bg-surface-muted">
            <Header
                onSearch={onSearch}
                employmentType={employmentType}
                onEmploymentTypeChange={setEmploymentType}
            />
            <JobList
                jobs={jobs}
                loading={loading}
                hasSearched={hasSearched}
                failed={failed}
            />
        </main>
    );
}
