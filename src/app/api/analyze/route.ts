import { analyzeJob } from '@/lib/gemini';

// One job at a time — the card click calls this, not the search
export async function POST(request: Request) {
    const { title, description } = await request.json();

    if (!title || !description) {
        return Response.json({ error: 'Title and description are required' }, { status: 400 });
    }

    try {
        return Response.json(await analyzeJob(title, description));
    } catch (error) {
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

        return Response.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
    }
}
