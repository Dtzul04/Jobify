type PhotonFeature = {
    properties?: {
        name?: string;
        state?: string;
        country?: string;
    };
};

const REMOTE = ['Remote', 'Remote - US', 'Remote - Worldwide'];
const LIMIT = 8;

function formatPlace(properties: PhotonFeature['properties']): string | null {
    if (!properties?.name) {
        return null;
    }

    const parts = [properties.name, properties.state, properties.country].filter(
        (part): part is string => Boolean(part),
    );

    return [...new Set(parts)].join(', ');
}

function remoteMatches(query: string): string[] {
    const q = query.toLowerCase();
    return REMOTE.filter((loc) => loc.toLowerCase().includes(q));
}

// Server-only worldwide place lookup (Photon). Remote options stay local so "rem" still works.
export async function geocodeLocations(query: string): Promise<string[]> {
    const remote = remoteMatches(query);
    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=${LIMIT}&lang=en`;

    try {
        const response = await fetch(url, {
            signal: AbortSignal.timeout(8_000),
            headers: {
                'User-Agent': 'Jobify/0.1 (https://github.com/Dtzul04/Jobify)',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch locations');
        }

        const payload = (await response.json()) as { features?: PhotonFeature[] };
        const places = (payload.features ?? [])
            .map((feature) => formatPlace(feature.properties))
            .filter((place): place is string => Boolean(place));

        return [...new Set([...remote, ...places])].slice(0, LIMIT);
    } catch (error) {
        console.error('Location lookup failed:', error);
        if (remote.length > 0) {
            return remote;
        }
        throw new Error('Failed to fetch locations');
    }
}
