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
        <div className="search-bar">
            <form onSubmit={handleSearch}>
                <input type="text" placeholder="Search for Jobs" value={search} onChange={(e) => setSearch(e.target.value) } />
                <button type="submit">Search</button>
            </form>
        </div>
    )
}