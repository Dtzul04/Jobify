import { geocodeLocations } from '@/lib/geocode';

// GET /api/locations?query= — location suggestions for the SearchBar Where field.
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query')?.trim();

    if (!query) {
        return Response.json({ error: 'Query is required' }, { status: 400 });
    }

    try {
        return Response.json(await geocodeLocations(query));
    } catch (error) {
        console.error('Error searching locations:', error);
        return Response.json({ error: 'Internal server error' }, { status: 500 });
    }
}
