import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { WebSocketServer } from 'ws';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { createServer } from 'http';
import { getApps, initializeApp as adminInitializeApp } from 'firebase-admin/app';

// Initialize Firebase Admin (Only once)
if (!getApps().length) {
  try {
    // If you have a service account JSON, you'd load it.
    // Assuming environment has GOOGLE_APPLICATION_CREDENTIALS or Firebase default credentials
    adminInitializeApp();
  } catch (error) {
    console.warn("Firebase admin initialization warning:", error);
  }
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Needed for POST body parsing
  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.post('/api/generate', async (req, res) => {
    try {
      const { prompt, systemInstruction } = req.body;
      const interaction = await ai.interactions.create({
        model: 'gemini-3.5-flash',
        input: prompt,
        system_instruction: systemInstruction,
      });
      res.json({ result: interaction.output_text });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/tts', async (req, res) => {
    try {
      const { text } = req.body;
      const interaction = await ai.interactions.create({
        model: 'gemini-3.1-flash-tts-preview',
        input: text,
        response_modalities: ['AUDIO']
      });
      
      let audioBase64 = null;
      for (const step of interaction.steps) {
        if (step.type === 'model_output') {
          const audioContent = step.content?.find(c => c.type === 'audio');
          if (audioContent && audioContent.data) {
            audioBase64 = audioContent.data;
          }
        }
      }
      
      res.json({ audio: audioBase64 });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  const httpServer = createServer(app);
  const wss = new WebSocketServer({ server: httpServer, path: '/live' });

  wss.on('connection', async (clientWs) => {
    try {
      const session = await ai.live.connect({
        model: 'gemini-3.1-flash-live-preview',
        callbacks: {
          onmessage: (message: LiveServerMessage) => {
            const audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audio) {
              clientWs.send(JSON.stringify({ audio }));
            }
            if (message.serverContent?.interrupted) {
              clientWs.send(JSON.stringify({ interrupted: true }));
            }
          },
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          systemInstruction: 'You are an English teacher and conversation partner. Help the user practice their spoken English. Correct their mistakes gently, ask engaging questions, and adapt to their level.',
        },
      });

      clientWs.on('message', (data) => {
        try {
          const { audio } = JSON.parse(data.toString());
          if (audio) {
            session.sendRealtimeInput({
              audio: { data: audio, mimeType: 'audio/pcm;rate=16000' },
            });
          }
        } catch (err) {
          console.error("Error parsing websocket message", err);
        }
      });
      
      clientWs.on('close', () => {
        session.close();
      });
    } catch (err) {
      console.error("Live API Connection error", err);
      clientWs.close();
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
