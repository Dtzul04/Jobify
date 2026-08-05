import express, { type Request, type Response } from 'express';
import cors from 'cors';

// Initialize Express
const app = express();

// Middleware
app.use(cors());

// Routes
app.get('/', (req: Request, res: Response) => {
    res.send('Hello World');
});

app.listen(3001, () => {
    console.log('Server is running on port 3001');
})



