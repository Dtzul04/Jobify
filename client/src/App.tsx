import Header from "./components/Header";
import SearchBar from "./components/searchBar";
import JobList from "./components/JobList";
import FilterPanel from "./components/FilterPanel";
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
        <main>
        <Header />

        <SearchBar onSearch={onSearch} />

        <FilterPanel value={employmentType} onChange={setEmploymentType} />        

        {/* We pass the jobs array to the JobList component */}
        <JobList jobs={jobs} />

        </main>
    );
}