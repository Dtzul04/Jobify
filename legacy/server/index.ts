import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { jobsRouter } from './routes/jobs.js';
import { analyzeRouter } from './routes/analyze.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
// health check to wake up the server
app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
});
app.use('/api', jobsRouter);
app.use('/api', analyzeRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
