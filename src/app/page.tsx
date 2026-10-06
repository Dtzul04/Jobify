"use client";

import Header from "@/components/Header";
import JobList from "@/components/JobList";
import { useState } from "react";
import type { Job } from "@/types";
import { searchJobs } from "@/lib/fetchJobs";
import { useAsync } from "@/hooks/useAsync";

export default function Home() {
    const [employmentType, setEmploymentType] = useState('all');
    const [jobs, setJobs] = useState<Job[]>([]);
    const [hasSearched, setHasSearched] = useState(false);
    const { loading, failed, run } = useAsync();

    async function onSearch(query: string) {
        setHasSearched(true);
        setJobs([])
        run(async () => {
            setJobs(await searchJobs(query, employmentType));
        })
    }

    return (
        <main className="min-h-screen bg-emerald-100 flex flex-col">
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
