import type { EmploymentType, RecentSearch } from "@/types";

// Drawer label in the browser. Same key every time we read/write.
const STORAGE_KEY = "jobify:recent-searches";
// Issue #19: bounded list — keep this documented max.
const MAX_RECENT = 5;

function isBrowser(): boolean {
    return typeof window !== "undefined";
}

function sameSearch(a: RecentSearch, b: RecentSearch): boolean {
    return (
        a.role === b.role &&
        a.city === b.city &&
        a.employmentType === b.employmentType
    );
}

// Read the notepad. Safe on the server and if storage is empty/corrupt.
export function getRecentSearches(): RecentSearch[] {
    if (!isBrowser()) {
        return [];
    }

    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            return [];
        }

        const parsed = JSON.parse(raw) as unknown;
        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed.filter((item): item is RecentSearch => {
            if (!item || typeof item !== "object") {
                return false;
            }
            const entry = item as Partial<RecentSearch>;
            return (
                typeof entry.role === "string" &&
                typeof entry.city === "string" &&
                typeof entry.employmentType === "string"
            );
        });
    } catch {
        return [];
    }
}

// Add one search to the front. Skip consecutive duplicates. Cap at MAX_RECENT.
export function addRecentSearch(
    role: string,
    city: string,
    employmentType: EmploymentType | string
): RecentSearch[] {
    if (!isBrowser()) {
        return [];
    }

    const trimmedRole = role.trim();
    const trimmedCity = city.trim();
    if (!trimmedRole && !trimmedCity) {
        return getRecentSearches();
    }

    const next: RecentSearch = {
        role: trimmedRole,
        city: trimmedCity,
        employmentType: employmentType as EmploymentType,
    };

    const current = getRecentSearches();
    const withoutConsecutiveDup =
        current[0] && sameSearch(current[0], next) ? current : [next, ...current];

    const limited = withoutConsecutiveDup.slice(0, MAX_RECENT);

    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(limited));
    } catch {
        // Quota / private mode — ignore; search still works without history.
    }

    return limited;
}

// Empty the drawer.
export function clearRecentSearches(): void {
    if (!isBrowser()) {
        return;
    }

    try {
        window.localStorage.removeItem(STORAGE_KEY);
    } catch {
        // Ignore storage failures.
    }
}
