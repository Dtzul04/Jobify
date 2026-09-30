import SearchBar from "./searchBar";
import FilterPanel from "./FilterPanel";

type HeaderProps = {
    onSearch: (query: string) => void;
    employmentType: string;
    onEmploymentTypeChange: (value: string) => void;
}

export default function Header({ onSearch, employmentType, onEmploymentTypeChange }: HeaderProps) {
    return (
        <header className="flex items-center gap-6 px-8 py-10 text-slate-900">
            <div className="shrink-0 min-w-0">
                <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-600 to-emerald-600">Jobify</h1>
                <p className="mt-1 text-2xl text-slate-600">
                    Searching jobs with a simple search
                </p>
            </div>
            <div className="flex-1 min-w-0">
                <SearchBar onSearch={onSearch} />
            </div>
            <div className="shrink-0">
                <FilterPanel value={employmentType} onChange={onEmploymentTypeChange} />
            </div>
        </header>
    )
}
