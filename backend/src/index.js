import express from 'express';
import cors from 'cors';
import presetsRouter from './routes/presets.js';

const app = express();
const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5174';

app.use(cors({ origin: CORS_ORIGIN.split(','), credentials: true }));
app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Routes
app.use('/api/presets', presetsRouter);

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
