import Header from "./components/Header";
import JobList from "./components/JobList";
import { useState } from "react";
import type { Job } from "./types";
import { searchJobs } from "./api";

export default function App() {
    const [employmentType, setEmploymentType] = useState('all');
    const [jobs, setJobs] = useState<Job[]>([]);

    // Function to handle the search
    async function onSearch(query: string) {
        const results = await searchJobs(query);
        setJobs(results);
    }
    
    return (
        <main className="bg-emerald-100 flex flex-col gap-4"> 
        <Header
            onSearch={onSearch}
            employmentType={employmentType}
            onEmploymentTypeChange={setEmploymentType}
        />      

        {/* We pass the jobs array to the JobList component */}
        <JobList jobs={jobs} />

        </main>
    );
}