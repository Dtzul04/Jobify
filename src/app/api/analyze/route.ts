import { analyzeJob } from '@/lib/gemini';
import { isRateLimit } from '@/lib/rateLimit';

// One job at a time: the card click calls this, not the search
export async function POST(request: Request) {
    // The user's IP tells us who is making the request
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown';

    // Too many summaries in the last minute: stop before calling Gemini
    if (isRateLimit(ip)) {
        return Response.json({ error: 'Too many summaries. Please wait a minute and try again.' }, { status: 429 });
    }

    const { title, description } = await request.json();

    // Gemini needs both to write a summary
    if (!title || !description) {
        return Response.json({ error: 'Title and description are required' }, { status: 400 });
    }

    try {
        return Response.json(await analyzeJob(title, description));
    } catch (error) {
        // Log the real error for us, then send the user a friendly message
        console.error('Error analyzing job:', error);

        // Only real Error objects have .message
        const message = error instanceof Error ? error.message : '';

        // These strings must match the errors thrown in gemini.ts
        if (message === 'Gemini request timed out') {
            return Response.json({ error: 'Took too long to respond. Please try again.' }, { status: 504});
        }

        if (message === 'Gemini returned invalid JSON') {
            return Response.json({ error: 'The summary came back broken. Please try again.' }, { status: 502})
        }

        // Any other error, like Gemini being busy
        return Response.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
    }
}
