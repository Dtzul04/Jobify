'use client';

import { useEffect, useState } from 'react';
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { searchLocations } from "@/lib/fetchJobs";

type SearchBarProps = {
    onSearch: (query: string) => void;
}

// Collects role + city, suggests locations as you type, then calls onSearch on submit.
export default function SearchBar(props: SearchBarProps) {
    const [search, setSearch] = useState<string>('');
    const [city, setCity] = useState<string>('');
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [lookingUp, setLookingUp] = useState(false);

    const showList = open && city.trim().length > 0;

    useEffect(() => {
        const query = city.trim();
        if (!open || query.length === 0) {
            return;
        }

        const controller = new AbortController();

        const timer = window.setTimeout(async () => {
            setLookingUp(true);
            try {
                const results = await searchLocations(query, controller.signal);
                setSuggestions(results);
                setActiveIndex(0);
            } catch (error) {
                if (error instanceof Error && error.name === 'AbortError') {
                    return;
                }
                setSuggestions([]);
            } finally {
                setLookingUp(false);
            }
        }, 300);

        return () => {
            window.clearTimeout(timer);
            controller.abort();
        };
    }, [city, open]);

    function pickLocation(location: string) {
        setCity(location);
        setOpen(false);
        setActiveIndex(0);
    }

    function handleSearch(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setOpen(false);
        // JSearch query: "nurse in Austin" when both fields are filled
        props.onSearch(city.trim() ? `${search} in ${city}` : search);
    }

    function handleCityKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (!showList) {
            return;
        }

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (suggestions.length === 0) {
                return;
            }
            setActiveIndex((i) => (i + 1) % suggestions.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (suggestions.length === 0) {
                return;
            }
            setActiveIndex((i) => (i - 1 + suggestions.length) % suggestions.length);
        } else if (e.key === 'Enter' && suggestions.length > 0) {
            e.preventDefault();
            pickLocation(suggestions[activeIndex] ?? suggestions[0]);
        } else if (e.key === 'Escape') {
            e.preventDefault();
            setOpen(false);
        }
    }

    return (
        <Card className="w-full overflow-visible">
            <form onSubmit={handleSearch} className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Input
                    className="sm:flex-1"
                    placeholder="Search for Jobs"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <div className="relative min-w-0 sm:flex-1">
                    <Input
                        placeholder="Location"
                        value={city}
                        autoComplete="off"
                        role="combobox"
                        aria-autocomplete="list"
                        aria-expanded={showList}
                        aria-controls="location-suggestions"
                        aria-activedescendant={
                            showList && suggestions[activeIndex]
                                ? `location-option-${activeIndex}`
                                : undefined
                        }
                        onChange={(e) => {
                            setCity(e.target.value);
                            setOpen(true);
                            setActiveIndex(0);
                        }}
                        onFocus={() => setOpen(true)}
                        onBlur={() => {
                            window.setTimeout(() => setOpen(false), 120);
                        }}
                        onKeyDown={handleCityKeyDown}
                    />
                    {showList && (
                        <ul
                            id="location-suggestions"
                            role="listbox"
                            className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-md border border-emerald-200/80 bg-surface py-1 shadow-lg"
                        >
                            {lookingUp && suggestions.length === 0 ? (
                                <li className="px-3 py-2 text-sm text-text-muted">
                                    Looking up locations...
                                </li>
                            ) : suggestions.length === 0 ? (
                                <li className="px-3 py-2 text-sm text-text-muted">
                                    No locations found
                                </li>
                            ) : (
                                suggestions.map((loc, index) => (
                                    <li
                                        key={`${loc}-${index}`}
                                        id={`location-option-${index}`}
                                        role="option"
                                        aria-selected={index === activeIndex}
                                        className={`cursor-pointer px-3 py-2 text-sm text-text ${
                                            index === activeIndex ? 'bg-surface-muted' : 'hover:bg-surface-muted'
                                        }`}
                                        onMouseDown={(e) => e.preventDefault()}
                                        onMouseEnter={() => setActiveIndex(index)}
                                        onClick={() => pickLocation(loc)}
                                    >
                                        {loc}
                                    </li>
                                ))
                            )}
                        </ul>
                    )}
                </div>
                <Button type="submit" className="w-full sm:w-auto">
                    Search
                </Button>
            </form>
        </Card>
    )
}
