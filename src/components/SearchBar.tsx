'use client';

import { useEffect, useState } from 'react';
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import type { RecentSearch } from "@/types";
import { searchLocations } from "@/lib/fetchJobs";
import {
    addRecentSearch,
    clearRecentSearches,
    getRecentSearches,
} from "@/lib/RecentSearches";

type SearchBarProps = {
    onSearch: (query: string, typeOverride?: string) => void;
    employmentType: string;
    onEmploymentTypeChange: (value: string) => void;
};

function buildQuery(role: string, city: string): string {
    const r = role.trim();
    const c = city.trim();
    return c ? `${r} in ${c}` : r;
}

function recentLabel(entry: RecentSearch): string {
    return buildQuery(entry.role || 'Any role', entry.city);
}

// Role + city form: location suggestions, recent searches, then onSearch on submit.
export default function SearchBar({
    onSearch,
    employmentType,
    onEmploymentTypeChange,
}: SearchBarProps) {
    const [search, setSearch] = useState('');
    const [city, setCity] = useState('');

    // Location suggestions
    const [locOpen, setLocOpen] = useState(false);
    const [locIndex, setLocIndex] = useState(0);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [lookingUp, setLookingUp] = useState(false);

    // Recent searches — lazy init from localStorage (safe on server via getRecentSearches)
    const [recents, setRecents] = useState<RecentSearch[]>(() => getRecentSearches());
    const [recentOpen, setRecentOpen] = useState(false);
    const [recentIndex, setRecentIndex] = useState(0);

    const showLocs = locOpen && city.trim().length > 0;
    const showRecents = recentOpen && recents.length > 0;

    useEffect(() => {
        const query = city.trim();
        if (!locOpen || query.length === 0) {
            return;
        }

        const controller = new AbortController();
        const timer = window.setTimeout(async () => {
            setLookingUp(true);
            try {
                const results = await searchLocations(query, controller.signal);
                setSuggestions(results);
                setLocIndex(0);
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
    }, [city, locOpen]);

    function pickLocation(location: string) {
        setCity(location);
        setLocOpen(false);
        setLocIndex(0);
    }

    function pickRecent(entry: RecentSearch) {
        setSearch(entry.role);
        setCity(entry.city);
        onEmploymentTypeChange(entry.employmentType);
        setRecentOpen(false);
        setRecentIndex(0);
        const query = buildQuery(entry.role, entry.city);
        if (query) {
            onSearch(query, entry.employmentType);
        }
    }

    function handleClearRecents() {
        clearRecentSearches();
        setRecents([]);
        setRecentOpen(false);
    }

    function handleSearch(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLocOpen(false);
        setRecentOpen(false);
        const query = buildQuery(search, city);
        if (query) {
            addRecentSearch(search.trim(), city.trim(), employmentType);
            setRecents(getRecentSearches());
        }
        onSearch(query);
    }

    function handleRoleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (!showRecents) {
            return;
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setRecentIndex((i) => (i + 1) % recents.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setRecentIndex((i) => (i - 1 + recents.length) % recents.length);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const entry = recents[recentIndex] ?? recents[0];
            if (entry) {
                pickRecent(entry);
            }
        } else if (e.key === 'Escape') {
            e.preventDefault();
            setRecentOpen(false);
        }
    }

    function handleCityKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (!showLocs) {
            return;
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (suggestions.length === 0) return;
            setLocIndex((i) => (i + 1) % suggestions.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (suggestions.length === 0) return;
            setLocIndex((i) => (i - 1 + suggestions.length) % suggestions.length);
        } else if (e.key === 'Enter' && suggestions.length > 0) {
            e.preventDefault();
            pickLocation(suggestions[locIndex] ?? suggestions[0]);
        } else if (e.key === 'Escape') {
            e.preventDefault();
            setLocOpen(false);
        }
    }

    return (
        <Card className="w-full overflow-visible">
            <form onSubmit={handleSearch} className="flex flex-col gap-2 sm:flex-row sm:items-center">
                {/* Role + recent searches */}
                <div className="relative min-w-0 sm:flex-1">
                    <Input
                        className="w-full"
                        placeholder="Search for Jobs"
                        value={search}
                        autoComplete="off"
                        role="combobox"
                        aria-autocomplete="list"
                        aria-expanded={showRecents}
                        aria-controls="recent-searches"
                        aria-activedescendant={
                            showRecents && recents[recentIndex]
                                ? `recent-option-${recentIndex}`
                                : undefined
                        }
                        onChange={(e) => setSearch(e.target.value)}
                        onFocus={() => {
                            setRecents(getRecentSearches());
                            setRecentOpen(true);
                            setRecentIndex(0);
                        }}
                        onBlur={() => {
                            window.setTimeout(() => setRecentOpen(false), 120);
                        }}
                        onKeyDown={handleRoleKeyDown}
                    />
                    {showRecents && (
                        <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-md border border-emerald-200/80 bg-surface shadow-lg">
                            <div className="flex items-center justify-between gap-2 border-b border-emerald-100 px-3 py-1.5">
                                <p className="text-xs font-medium text-text-muted">Recent searches</p>
                                <button
                                    type="button"
                                    className="rounded px-1.5 py-0.5 text-xs text-text-muted hover:bg-surface-muted hover:text-text"
                                    aria-label="Clear recent searches"
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={handleClearRecents}
                                >
                                    Clear
                                </button>
                            </div>
                            <ul id="recent-searches" role="listbox" className="max-h-56 overflow-auto py-1">
                                {recents.map((entry, index) => (
                                    <li
                                        key={`${entry.role}-${entry.city}-${entry.employmentType}-${index}`}
                                        id={`recent-option-${index}`}
                                        role="option"
                                        aria-selected={index === recentIndex}
                                        className={`cursor-pointer px-3 py-2 text-sm text-text ${
                                            index === recentIndex ? 'bg-surface-muted' : 'hover:bg-surface-muted'
                                        }`}
                                        onMouseDown={(e) => e.preventDefault()}
                                        onMouseEnter={() => setRecentIndex(index)}
                                        onClick={() => pickRecent(entry)}
                                    >
                                        <span className="block truncate">{recentLabel(entry)}</span>
                                        {entry.employmentType !== 'all' && (
                                            <span className="text-xs text-text-muted">{entry.employmentType}</span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* City + location suggestions */}
                <div className="relative min-w-0 sm:flex-1">
                    <Input
                        placeholder="Location"
                        value={city}
                        autoComplete="off"
                        role="combobox"
                        aria-autocomplete="list"
                        aria-expanded={showLocs}
                        aria-controls="location-suggestions"
                        aria-activedescendant={
                            showLocs && suggestions[locIndex]
                                ? `location-option-${locIndex}`
                                : undefined
                        }
                        onChange={(e) => {
                            setCity(e.target.value);
                            setLocOpen(true);
                            setLocIndex(0);
                        }}
                        onFocus={() => setLocOpen(true)}
                        onBlur={() => {
                            window.setTimeout(() => setLocOpen(false), 120);
                        }}
                        onKeyDown={handleCityKeyDown}
                    />
                    {showLocs && (
                        <ul
                            id="location-suggestions"
                            role="listbox"
                            className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-md border border-emerald-200/80 bg-surface py-1 shadow-lg"
                        >
                            {lookingUp && suggestions.length === 0 ? (
                                <li className="px-3 py-2 text-sm text-text-muted">Looking up locations...</li>
                            ) : suggestions.length === 0 ? (
                                <li className="px-3 py-2 text-sm text-text-muted">No locations found</li>
                            ) : (
                                suggestions.map((loc, index) => (
                                    <li
                                        key={`${loc}-${index}`}
                                        id={`location-option-${index}`}
                                        role="option"
                                        aria-selected={index === locIndex}
                                        className={`cursor-pointer px-3 py-2 text-sm text-text ${
                                            index === locIndex ? 'bg-surface-muted' : 'hover:bg-surface-muted'
                                        }`}
                                        onMouseDown={(e) => e.preventDefault()}
                                        onMouseEnter={() => setLocIndex(index)}
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
    );
}
