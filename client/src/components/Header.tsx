import SearchBar from "./searchBar";
import FilterPanel from "./FilterPanel";

type HeaderProps = {
    onSearch: (query: string) => void;
    employmentType: string;
    onEmploymentTypeChange: (value: string) => void;
}

export default function Header({ onSearch, employmentType, onEmploymentTypeChange }: HeaderProps) {
    return (
        <header className="flex items-center gap-20 px-20 pr-45 py-8 text-slate-900">
            <div className= "min-w-0">
                <h1 className="text-6xl font-bold">Jobify</h1>
                <p className="mt-1 text-2xl text-slate-600">
                    Searching jobs with a simple search
                </p>
            </div>
            <div className="max-w-lg ml-auto w-full min-w-0">
                <SearchBar onSearch={onSearch} />
            </div>
            <div className="min-w-0 flex">
                <FilterPanel value={employmentType} onChange={onEmploymentTypeChange} />
            </div>
        </header>
    )
}
