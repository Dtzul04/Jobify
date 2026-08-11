type FilterPanelProps = {
    value: string;
    onChange: (value: string) => void;
}

export default function FilterPanel({ value, onChange}: FilterPanelProps) {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
        >
            <option value="all">All</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
        </select>
    )
}