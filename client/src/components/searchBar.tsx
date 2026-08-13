import { useState } from 'react';

type SearchBarProps = {
    onSearch: (query: string) => void;
}

export default function SearchBar(props: SearchBarProps) {
    const [search, setSearch] = useState<string>('');

    function handleSearch(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        props.onSearch(search);
    }

    return (
        <div className="w-full rounded-lg bg-white p-4 shadow-sm">
            <form onSubmit={handleSearch} className="flex items-center gap-2">
                <input
                    className="min-w-0 flex-1 rounded-md px-3 py-2"
                    type="text"
                    placeholder="Search for Jobs"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button
                    className="shrink-0 bg-teal-600 text-white px-4 py-2 rounded-md"
                    type="submit"
                >
                    Search
                </button>
            </form>
        </div>
    )
}
