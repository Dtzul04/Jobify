type FilterPanelProps = {
    value: string;
    onChange: (value: string) => void;
}

// Employment-type filter; value lives on page.tsx and is sent with searchJobs.
export default function FilterPanel({ value, onChange }: FilterPanelProps) {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full lg:w-auto rounded-lg bg-white px-3 py-2 shadow-sm"
        >
            <option value="all">All</option>
            <option value="FULLTIME">Full-time</option>
            <option value="PARTTIME">Part-time</option>
            <option value="CONTRACTOR">Contract</option>
            <option value="INTERN">Internship</option>
        </select>
    )
}
