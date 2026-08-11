import { useState } from 'react';

export default function SearchBar() {
    const [search, setSearch] = useState<string>('');

    function handleSearch(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        console.log(search);
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