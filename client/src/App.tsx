import Header from "./components/Header";
import JobList from "./components/JobList";
import { useState } from "react";
import type { Job } from "./types";
import { searchJobs } from "./api";

export default function App() {
    const [employmentType, setEmploymentType] = useState('all');
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    // Function to handle the search
    async function onSearch(query: string) {
        setLoading(true);
        setHasSearched(true);
        const results = await searchJobs(query, employmentType);
        setJobs(results);
        setLoading(false);
    }
    
    return (
        <main className="min-h-screen bg-emerald-100 flex flex-col"> 
        <Header
            onSearch={onSearch}
            employmentType={employmentType}
            onEmploymentTypeChange={setEmploymentType}
        />      

        <JobList
            jobs={employmentType === 'all' ? jobs : jobs.filter(job => job.employmentType === employmentType)}
            loading={loading}
            hasSearched={hasSearched}
        />
        </main>
    );
}