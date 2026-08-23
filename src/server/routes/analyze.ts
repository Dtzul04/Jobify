import { Router, type Request, type Response } from 'express';
import { analyzeJob } from '../services/gemini.js';

export const analyzeRouter = Router();

// One job at a time — the card click calls this, not the search
analyzeRouter.post('/analyze', async (req: Request, res: Response) => {
    const { title, description } = req.body;

    if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required' });
    }

    try {
        return res.json(await analyzeJob(title, description));
    } catch (error) {
        console.error('Error analyzing job:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
