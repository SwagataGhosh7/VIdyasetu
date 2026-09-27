import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// API route for Samiksha AI / Prescriptive Analysis
app.post('/api/ai/analyze', async (req, res) => {
  try {
    const { prompt, context } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(200).json({
        success: true,
        text: "Note: GEMINI_API_KEY is not configured in environment. Displaying synthesized rule-based prescriptive guidance based on National Achievement Survey (NAS), UDISE+, and Samagra Shiksha PAB guidelines.\n\nRecommended Action Priority: 1. Deploy Cluster Resource Persons for bi-weekly FLN Math pedagogy co-teaching. 2. Rationalize PTR across high-enrolment clusters. 3. Sanction functional girls' toilet maintenance from composite school grant."
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const systemInstruction = `You are "Samiksha AI", the Senior Decision Support & Action Advisory Engine for India's District Education Officers (DEOs) and Block Education Officers (BEOs).
Your mission is to help education administrators interpret multi-source educational data (UDISE+, PARAKH Foundational Learning Study - FLS, National Achievement Survey - NAS, ASER 2024, NFHS Dropout rates, and Samagra Shiksha PAB 2026-27 approvals).
Always provide concrete, actionable, role-assigned, and time-bound recommendations.
Structure recommendations into:
1. Data Diagnostic & Root Cause (triangulating outcomes with input infrastructure/PTR)
2. Prescriptive Intervention with Target Beneficiaries & Methodology
3. Assigned Accountability (Who: BEO, CRC Coordinator, Headmaster, or Civil Works AE)
4. Time Horizon & Review Milestone (30-day, 60-day, 90-day targets)
5. Applicable Scheme/Fund head (Samagra Shiksha PAB, Composite School Grant, FLN TLM grant, etc.)
Be authoritative, constructive, administrative yet deeply pedagogic and practical.`;

    const fullPrompt = `${systemInstruction}\n\n[ADMINISTRATIVE CONTEXT]:\n${JSON.stringify(context || {}, null, 2)}\n\n[OFFICER QUERY/REQUEST]:\n${prompt}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: fullPrompt,
    });

    res.json({
      success: true,
      text: response.text || "No response generated.",
    });
  } catch (error: any) {
    console.error("Gemini API error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to generate AI insights.",
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`VidyaSetu Education Decision Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
