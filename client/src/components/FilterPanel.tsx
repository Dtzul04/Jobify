type FilterPanelProps = {
    value: string;
    onChange: (value: string) => void;
}

export default function FilterPanel({ value, onChange }: FilterPanelProps) {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="rounded-lg bg-white px-3 py-2 shadow-sm"
        >
            <option value="all">All</option>
            <option value="FULLTIME">Full-time</option>
            <option value="PARTTIME">Part-time</option>
            <option value="CONTRACTOR">Contract</option>
            <option value="INTERN">Internship</option>
        </select>
    )
}
