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
        return Response.json({ error: 'Internal server error' }, { status: 500 });
    }
}
