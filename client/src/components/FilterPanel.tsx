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
            <option value="Full-time">Full-time</option>
            <option value="Part-Time">Part-time</option>
            <option value="Contractor">Contract</option>
            <option value="Internship">Internship</option>
        </select>
    )
}
