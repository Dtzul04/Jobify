import express, { type Request, type Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { jsearch } from './services/jsearch.js';
import { analyzeJob } from './services/gemini.js';

// Load environment variables from .env file
dotenv.config();

// Initialize Express
const app = express();

const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

/* Routes */

// Search for jobs
app.get('/api/jobs', async (req: Request, res: Response) => {
    const query = typeof req.query.query === 'string' ? req.query.query : undefined;
    const employmentType = typeof req.query.employmentType === 'string' ? req.query.employmentType : 'all';

    if (!query) {
        return res.status(400).json({ error: 'Query is required' });
    }

    try {
        const jobs = await jsearch(query, employmentType);
        return res.json(jobs);
    } catch (error) {
        console.error('Error searching for jobs:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Analyze a job posting
app.post('/api/analyze', async (req: Request, res: Response) => {
    const { title, description} = req.body;

    if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required' });
    }

    try {
        const analysis = await analyzeJob(title, description);
        return res.json(analysis);
    } catch (error) {
        console.error(`Error analyzing job: ${error}`)
        return res.status(500).json({ message: 'Internal server error'});
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



