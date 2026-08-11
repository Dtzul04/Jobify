import Header from "./components/Header";
import SearchBar from "./components/searchBar";
import JobList from "./components/JobList";
import FilterPanel from "./components/FilterPanel";
import { useState } from "react";

export default function App() {
    const [employmentType, setEmploymentType] = useState('all');
    
    return (
        <main>
        <Header />

        <SearchBar />

        <FilterPanel value={employmentType} onChange={setEmploymentType} />        

        {/* We pass the jobs array to the JobList component */}
        <JobList jobs={[]} />

        </main>
    );
}