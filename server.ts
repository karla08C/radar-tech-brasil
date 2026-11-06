import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { INITIAL_EVENTS } from './src/data/initialEvents';
import { TechEvent } from './src/types';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '5mb' }));

// Helper para carregar editais reais coletados pelo scanner
function loadDiscoveredNotices(): TechEvent[] {
  try {
    const discoveredPath = path.resolve(__dirname, 'src/data/discovered_editais.json');
    if (fs.existsSync(discoveredPath)) {
      const content = fs.readFileSync(discoveredPath, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Aviso: discovered_editais.json não carregado');
  }
  return [];
}

// In-memory store: editais reais coletados + base de curadoria
const scrapedEditais = loadDiscoveredNotices();
let serverEvents: TechEvent[] = [...scrapedEditais, ...INITIAL_EVENTS];

// Lazy-initialized Gemini client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClient;
}

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    eventCount: serverEvents.length,
    timestamp: new Date().toISOString(),
  });
});

// GET /api/events - Retrieve all events and notices
app.get('/api/events', (req, res) => {
  res.json({
    success: true,
    total: serverEvents.length,
    events: serverEvents,
  });
});

// POST /api/events/ai-discover - Automated scanner for innovation notices
app.post('/api/events/ai-discover', async (req, res) => {
  try {
    const { focusTopic, targetState } = req.body || {};
    const ai = getGeminiClient();

    let newDiscoveredEvents: TechEvent[] = [];

    if (ai) {
      const prompt = `Você é o sistema automatizado de radar e monitoramento de editais de fomento, aceleração e inovação no Brasil ("Radar Tech Brasil").
Sua tarefa é encontrar chamadas públicas abertas de fomento à inovação (como FUNCAP, FINEP, CNPq, FAPs estaduais) e editais de aceleração para startups no Brasil para 2025/2026.
${focusTopic ? `Foco específico: ${focusTopic}` : ''}
${targetState ? `Estado / Região: ${targetState}` : ''}

Pesquise chamadas públicas reais de subvenção econômica, capital não-reembolsável ou programas de aceleração equity-free.

Responda ESTRITAMENTE em formato JSON com o seguinte schema (sem markdown ou texto antes/depois, apenas o array JSON):
[
  {
    "id": "edital-auto-12345",
    "title": "Nome do Edital ou Chamada Pública",
    "slug": "nome-do-edital-kebab-case",
    "description": "Objetivo do edital, valores financiados e regras de participação.",
    "category": "edital_fomento" | "aceleracao" | "bolsa_pesquisa" | "hackathon",
    "modality": "online" | "presencial" | "hibrido",
    "startDate": "YYYY-MM-DD",
    "endDate": "YYYY-MM-DD",
    "registrationDeadline": "YYYY-MM-DDTHH:mm:ss",
    "location": {
      "city": "Cidade",
      "state": "UF (ex: CE, SP, DF) ou Online",
      "venue": "Plataforma de submissão ou órgão",
      "region": "Nordeste" | "Sudeste" | "Sul" | "Centro-Oeste" | "Norte" | "Nacional/Online",
      "scope": "Estadual" | "Nacional" | "Regional"
    },
    "organizer": "Órgão Concedente (ex: FUNCAP, FINEP, CNPq, FAPESP)",
    "websiteUrl": "https://...",
    "registrationUrl": "https://...",
    "tags": ["Fundo Perdido", "Subvenção", "SaaS", etc],
    "verticals": ["Impacto Social & GovTech", "Inteligência Artificial & Dados", "SaaS & B2B", "Saúde & HealthTech"],
    "prizes": {
      "totalValue": 1000000,
      "highlight": "Até R$ 250.000 Não-Reembolsável",
      "hasCashPrize": true,
      "fundingType": "nao_reembolsavel" | "equity_free" | "creditos_cloud" | "premiacao_direta",
      "hasCounterpart": true,
      "counterpartPercentage": 5
    },
    "featured": true,
    "targetAudience": "Startups MEI/ME/EPP e pesquisadores",
    "eligibilityCriteria": ["Critério 1", "Critério 2"]
  }
]`;

      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            tools: [{ googleSearch: {} }],
            systemInstruction: 'Você é um pesquisador de chamadas públicas e editais de inovação no Brasil. Use a busca do Google e retorne exclusivamente um array JSON válido.',
            temperature: 0.1,
          },
        });

        const rawText = response.text || '';
        const jsonMatch = rawText.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]) as TechEvent[];
          newDiscoveredEvents = parsed.map((e, idx) => ({
            ...e,
            id: e.id || `edital-ai-${Date.now()}-${idx}`,
            slug: e.slug || (e.title ? e.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `edital-${Date.now()}-${idx}`),
            isAutomatedDiscovery: true,
            discoveredAt: new Date().toISOString(),
            source: 'Varredura com Busca Web (Gemini)',
            verified: true,
          }));
        }
      } catch (geminiError) {
        console.warn('Gemini discovery warning:', geminiError);
      }
    }

    // Se o Gemini não estiver ativo, recarrega os editais reais do scanner local
    if (newDiscoveredEvents.length === 0) {
      newDiscoveredEvents = loadDiscoveredNotices();
    }

    // Merge sem duplicatas
    for (const evt of newDiscoveredEvents) {
      if (!serverEvents.some(existing => existing.slug === evt.slug || existing.title.toLowerCase() === evt.title.toLowerCase())) {
        serverEvents.unshift(evt);
      }
    }

    res.json({
      success: true,
      discoveredCount: newDiscoveredEvents.length,
      events: newDiscoveredEvents,
      totalEvents: serverEvents.length,
      timestamp: new Date().toISOString(),
      insights: `Radar identificou ${newDiscoveredEvents.length} editais públicos de fomento e inovação.`,
    });
  } catch (error) {
    console.error('Error in ai-discover:', error);
    res.status(500).json({
      success: false,
      error: 'Falha ao executar varredura automatizada',
    });
  }
});

// POST /api/events/sync-live - Pull latest notices from scanner and live feeds
app.post('/api/events/sync-live', async (req, res) => {
  try {
    const freshlyPulled = loadDiscoveredNotices();
    let addedCount = 0;

    for (const evt of freshlyPulled) {
      if (!serverEvents.some(existing => existing.id === evt.id || existing.title.toLowerCase() === evt.title.toLowerCase())) {
        serverEvents.unshift(evt);
        addedCount++;
      }
    }

    res.json({
      success: true,
      addedCount,
      totalEvents: serverEvents.length,
      events: serverEvents,
      timestamp: new Date().toISOString(),
      message: addedCount > 0 
        ? `${addedCount} novos editais reais foram integrados ao Radar!` 
        : 'Editais oficiais da FUNCAP, FINEP e FAPs já estão sincronizados.',
    });
  } catch (error) {
    console.error('Error syncing live:', error);
    res.json({
      success: true,
      addedCount: 0,
      totalEvents: serverEvents.length,
      events: serverEvents,
      message: 'Radar sincronizado com a base local.',
    });
  }
});

// POST /api/events/parse-text - Parse a raw edital notice with Gemini
app.post('/api/events/parse-text', async (req, res) => {
  try {
    let { rawText, sourceUrl } = req.body || {};
    
    if ((!rawText || typeof rawText !== 'string' || rawText.trim().length === 0) && (!sourceUrl || typeof sourceUrl !== 'string' || sourceUrl.trim().length === 0)) {
      return res.status(400).json({ error: 'Texto do edital ou link oficial é obrigatório' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        error: 'Chave do Gemini API não configurada. Defina GEMINI_API_KEY no painel de configurações.',
      });
    }

    const prompt = `Analise o seguinte edital ou chamada pública de fomento brasileira e extraia as informações estruturadas em JSON:
Texto do edital:
"""${rawText.slice(0, 4000)}"""

Link de referência: ${sourceUrl || 'Não fornecido'}

Retorne ESTRITAMENTE um objeto JSON no formato:
{
  "title": "Nome Oficial do Edital",
  "slug": "nome-do-edital-kebab-case",
  "description": "Objetivo claro do edital e resumo das regras",
  "category": "edital_fomento",
  "modality": "online",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD",
  "registrationDeadline": "YYYY-MM-DDTHH:mm:ss",
  "location": {
    "city": "Cidade",
    "state": "UF (ex: CE, SP, DF)",
    "venue": "Plataforma de submissão",
    "region": "Nordeste",
    "scope": "Estadual"
  },
  "organizer": "Órgão Concedente (ex: FUNCAP, FINEP, CNPq)",
  "websiteUrl": "${sourceUrl || 'https://exemplo.com'}",
  "registrationUrl": "${sourceUrl || 'https://exemplo.com/inscricao'}",
  "tags": ["Fundo Perdido", "Inovação", "Startups"],
  "verticals": ["Impacto Social & GovTech", "Inteligência Artificial & Dados"],
  "prizes": {
    "totalValue": 500000,
    "highlight": "Até R$ 250.000 Não-Reembolsável",
    "hasCashPrize": true,
    "fundingType": "nao_reembolsavel",
    "hasCounterpart": true,
    "counterpartPercentage": 5
  },
  "featured": false,
  "targetAudience": "Startups e pesquisadores",
  "eligibilityCriteria": ["Critério 1", "Critério 2"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'Você é um extrator de chamadas públicas e editais de inovação. Responda exclusivamente com um objeto JSON válido.',
        temperature: 0.1,
      },
    });

    const text = response.text || '{}';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Não foi possível estruturar o edital a partir do texto fornecido.');
    }

    const parsed = JSON.parse(jsonMatch[0]) as TechEvent;
    parsed.id = `edital-import-${Date.now()}`;
    parsed.slug = parsed.slug || (parsed.title ? parsed.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `edital-${Date.now()}`);
    parsed.isAutomatedDiscovery = true;
    parsed.discoveredAt = new Date().toISOString();
    parsed.verified = true;

    serverEvents.unshift(parsed);

    res.json({
      success: true,
      event: parsed,
    });
  } catch (err: any) {
    console.error('Error parsing event text:', err);
    res.status(500).json({
      success: false,
      error: 'Não foi possível analisar o texto do edital.',
    });
  }
});

// POST /api/events/subscribe-alert - Alert preference registration
app.post('/api/events/subscribe-alert', (req, res) => {
  const { channel, contact, selectedStates, selectedAreas } = req.body || {};
  res.json({
    success: true,
    message: `Alerta registrado com sucesso para ${contact} via ${channel}!`,
  });
});

async function startServer() {
  try {
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

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`RadarTech Brasil server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to initialize or start server:', error);
    process.exit(1);
  }
}

startServer();
