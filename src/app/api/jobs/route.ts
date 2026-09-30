import { jsearch } from '@/lib/jsearch';
import type { EmploymentType } from '@/types';

// JSearch wants these exact strings. Anything else becomes "all".
const TYPES: EmploymentType[] = ['all', 'FULLTIME', 'PARTTIME', 'CONTRACTOR', 'INTERN'];

function toEmploymentType(value: string): EmploymentType {
    return TYPES.includes(value as EmploymentType) ? (value as EmploymentType) : 'all';
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const query = searchParams.get('query');
    if (!query) {
        return Response.json({ error: 'Query is required' }, { status: 400 });
    }

    const employmentType = toEmploymentType(searchParams.get('employmentType') ?? 'all');

    try {
        return Response.json(await jsearch(query, employmentType));
    } catch (error) {
        console.error('Error searching for jobs:', error);
        return Response.json({ error: 'Internal server error' }, { status: 500 });
    }
}
