import cors from 'cors';
import express from 'express';
import { createServer } from 'http';
import path from 'path';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import testDiscovery from './test-discovery.js';
import testRunner from './test-runner.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '../..');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(PROJECT_ROOT, 'test-results')));

// API Routes
app.get('/api/tests', async (req, res) => {
  try {
    const tests = await testDiscovery.discoverTests();
    res.json(tests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/results/:runId', async (req, res) => {
  try {
    const { runId } = req.params;
    // TODO: Load results from storage
    res.json({ runId, status: 'completed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/screenshots/:testId', async (req, res) => {
  try {
    const { testId } = req.params;
    const screenshotsDir = path.join(PROJECT_ROOT, 'test-results', 'screenshots');
    // TODO: List screenshots for test
    res.json({ testId, screenshots: [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// WebSocket connection
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });

  socket.on('run:tests', async (data) => {
    const { testIds, options = {} } = data;
    console.log('Running tests:', testIds);
    
    try {
      await testRunner.runTests(testIds, options, (event, data) => {
        socket.emit(event, data);
      });
    } catch (error) {
      socket.emit('test:error', { error: error.message });
    }
  });

  socket.on('stop:tests', () => {
    testRunner.stopTests();
    socket.emit('test:stopped', { message: 'Tests stopped' });
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`🚀 WebTest Server running on http://localhost:${PORT}`);
});

