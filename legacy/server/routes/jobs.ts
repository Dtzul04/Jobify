import { Router, type Request, type Response } from 'express';
import { jsearch } from '../services/jsearch.js';
import type { EmploymentType } from '../types/index.js';

// JSearch wants these exact strings. Anything else becomes "all".
const TYPES: EmploymentType[] = ['all', 'FULLTIME', 'PARTTIME', 'CONTRACTOR', 'INTERN'];

function toEmploymentType(value: string): EmploymentType {
    return TYPES.includes(value as EmploymentType) ? (value as EmploymentType) : 'all';
}

export const jobsRouter = Router();

jobsRouter.get('/jobs', async (req: Request, res: Response) => {
    const query = req.query.query;
    if (typeof query !== 'string' || !query) {
        return res.status(400).json({ error: 'Query is required' });
    }

    // Query params are string | string[] | undefined
    const raw = req.query.employmentType;
    const employmentType = toEmploymentType(typeof raw === 'string' ? raw : 'all');

    try {
        return res.json(await jsearch(query, employmentType));
    } catch (error) {
        console.error('Error searching for jobs:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
