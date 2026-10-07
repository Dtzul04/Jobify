'use client';

import { useState } from 'react';

type SearchBarProps = {
    onSearch: (query: string) => void;
}

// The search bar for the header
export default function SearchBar(props: SearchBarProps) {
    const [search, setSearch] = useState<string>('');
    const [city, setCity] = useState<string>('');

    function handleSearch(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        // JSearch query: "nurse in Austin" when both fields are filled
        props.onSearch(city.trim() ? `${search} in ${city}` : search);
    }

    return (
        <div className="w-full rounded-lg bg-white p-3 sm:p-4 shadow-sm">
            <form onSubmit={handleSearch} className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <input
                    className="w-full min-w-0 rounded-md px-3 py-2 sm:flex-1"
                    type="text"
                    placeholder="Search for Jobs"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <input
                    className="w-full min-w-0 rounded-md px-3 py-2 sm:flex-1"
                    type="text"
                    placeholder="Location"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />
                <button
                    className="w-full sm:w-auto shrink-0 bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700"
                    type="submit"
                >
                    Search
                </button>
            </form>
        </div>
    )
}
