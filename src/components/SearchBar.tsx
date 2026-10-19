'use client';

import { useState } from 'react';
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";

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
        <Card className="w-full">
            <form onSubmit={handleSearch} className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Input
                    className="sm:flex-1"
                    placeholder="Search for Jobs"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Input
                    className="sm:flex-1"
                    placeholder="Location"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />
                <Button type="submit" className="w-full sm:w-auto">
                    Search
                </Button>
            </form>
        </Card>
    )
}
