import SearchBar from "./SearchBar";
import FilterPanel from "./FilterPanel";

type HeaderProps = {
    onSearch: (query: string) => void;
    employmentType: string;
    onEmploymentTypeChange: (value: string) => void;
}

export default function Header({ onSearch, employmentType, onEmploymentTypeChange }: HeaderProps) {
    return (
        <header className="flex flex-col gap-4 px-4 py-6 text-slate-900 md:px-8 md:py-10 lg:flex-row lg:items-center lg:gap-6">
            <div className="shrink-0 min-w-0">
                <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-600 to-emerald-600">Jobify</h1>
                <p className="mt-1 text-lg md:text-2xl text-slate-600">
                    Searching jobs with a simple search
                </p>
            </div>
            <div className="w-full min-w-0 lg:flex-1">
                <SearchBar onSearch={onSearch} />
            </div>
            <div className="w-full lg:w-auto lg:shrink-0">
                <FilterPanel value={employmentType} onChange={onEmploymentTypeChange} />
            </div>
        </header>
    )
}
