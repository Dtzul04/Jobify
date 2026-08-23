import Header from "./components/Header";
import JobList from "./components/JobList";
import { useEffect, useState } from "react";
import type { Job } from "./types";
import { searchJobs, wakeApi } from "./api";

export default function App() {
    const [employmentType, setEmploymentType] = useState('all');
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        wakeApi();
    }, []);

    async function onSearch(query: string) {
        setLoading(true);
        setHasSearched(true);
        setFailed(false);
        try {
            setJobs(await searchJobs(query, employmentType));
        } catch (error) {
            console.error(error);
            setJobs([]);
            setFailed(true);
        } finally {
            // Always stop the spinner, even if fetch throws
            setLoading(false);
        }
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
