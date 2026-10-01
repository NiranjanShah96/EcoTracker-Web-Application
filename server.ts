import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProduction = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;

const app = express();
app.use(express.json());

// Initialize server-side Gemini client
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// Fallback generator for Environmental Insights when API is offline/not configured
function generateRuleBasedInsights(data: {
  transportation: number;
  electricity: number;
  food: number;
  waste: number;
  total: number;
}) {
  const { transportation, electricity, food, waste, total } = data;
  const categories = [
    { name: 'Transportation', value: transportation },
    { name: 'Electricity', value: electricity },
    { name: 'Food', value: food },
    { name: 'Waste', value: waste },
  ].sort((a, b) => b.value - a.value);

  const largest = categories[0];
  const largestPercent = total > 0 ? Math.round((largest.value / total) * 100) : 0;

  const actionsByCategory: Record<string, string[]> = {
    Transportation: [
      'Shift 2 days of solo commuting to public transit, carpooling, or campus shuttle to cut transport emissions by ~25%.',
      'Combine errands and use active mobility (walking or cycling) for trips under 3 km.',
      'Maintain correct tire pressure and practice eco-driving (smooth acceleration) if driving a car.',
      'Explore electric bike sharing or campus micromobility options.',
    ],
    Electricity: [
      'Set air conditioning or heating to optimal thermostat levels (24°C / 75°F in summer) to reduce compressor load.',
      'Unplug phantom-load devices (chargers, gaming consoles, desktop monitors) when not in use.',
      'Switch remaining halogen/incandescent bulbs to efficient LEDs.',
      'Take advantage of natural daylight in study spaces and activate power-saving modes on computers.',
    ],
    Food: [
      'Incorporate 2 to 3 plant-rich or meatless days per week, which significantly lowers dietary methane and nitrous oxide.',
      'Plan weekly groceries and meal-prep to eliminate food spoilage in refrigerators.',
      'Choose locally grown and seasonal ingredients to avoid excessive cold-chain transport emissions.',
      'Carry a reusable water flask and lunch container to prevent disposable packaging.',
    ],
    Waste: [
      'Establish a strict 3-stream sorting system: dry recyclables, compostable organics, and non-recyclables.',
      'Replace single-use plastics (shopping bags, coffee cups, cutlery) with durable alternatives.',
      'Participate in student book and gadget swaps or digital-first lecture notes instead of printing.',
      'Compost food scraps if your dorm, campus, or local municipality offers organic waste drop-off.',
    ],
  };

  return {
    summary: `Your estimated monthly carbon footprint is ${total.toFixed(1)} kg CO₂e. At ${largestPercent}% of your total impact, ${largest.name} represents your primary emission driver.`,
    mainEmissionSource: `${largest.name} (${largest.value.toFixed(1)} kg CO₂e / ${largestPercent}%)`,
    keyObservations: [
      `${largest.name} accounts for more than ${largestPercent}% of your emissions, making it the highest-leverage area for reduction.`,
      `Your total of ${total.toFixed(1)} kg CO₂e per month translates to approximately ${(total * 12 / 1000).toFixed(2)} tonnes CO₂e annually.`,
      `Categories like ${categories[categories.length - 1].name} are currently kept relatively low (${categories[categories.length - 1].value.toFixed(1)} kg CO₂e).`,
      `Notice: All calculations are practical estimates for student awareness and do not reflect industrial audit measurements.`,
    ],
    recommendedActions: actionsByCategory[largest.name] || actionsByCategory.Transportation,
    expectedImprovementAreas: [
      `Immediate 15-25% reduction in ${largest.name} emissions through behavioral adjustments.`,
      `Estimated savings of ${(largest.value * 0.25).toFixed(1)} kg CO₂e per month achievable within 30 days.`,
      `Potential annual reduction of ${(total * 0.20 * 12).toFixed(0)} kg CO₂e with consistent sustainable habits.`,
    ],
  };
}

// Fallback chatbot answers
const FAQ_ANSWERS: Record<string, string> = {
  'what is a carbon footprint':
    'A carbon footprint is the total amount of greenhouse gases (predominantly carbon dioxide and methane, measured in kg or tonnes of CO₂ equivalent) generated by our personal daily activities, including travel, electricity consumption, diet, and trash disposal. Understanding your footprint is the first step toward reducing climate impact.',
  'how can i reduce my transportation emissions':
    'For students, the highest-impact travel steps are: 1) Walking or cycling for distances under 3 km; 2) Using campus shuttles, buses, and metro instead of single-passenger cars or cabs; 3) Carpooling with fellow students; and 4) Keeping vehicle tires properly inflated.',
  'why is electricity usage important':
    'In most regions, grid electricity is still produced by burning fossil fuels like coal or natural gas. Whenever we run air conditioning, leave high-powered computers running, or keep lights on in empty rooms, power plants burn fuel to supply that energy, directly releasing carbon dioxide into the atmosphere.',
  'what are simple eco-friendly habits for students':
    'Great student habits include: 1) Carrying a refillable water bottle and insulated mug; 2) Doing "Meatless Mondays" or choosing more plant-based canteen meals; 3) Unplugging laptops and power strips when heading to class; 4) Taking stairs instead of elevators for 1-3 floors; and 5) Using digital textbooks and note apps to eliminate paper waste.',
};

// API: Check server and Gemini status
app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY'),
    model: 'gemini-3.8-flash',
  });
});

// API: AI Insights for Footprint Analysis
app.post('/api/gemini/insights', async (req, res) => {
  const { transportation = 0, electricity = 0, food = 0, waste = 0, total = 0 } = req.body || {};

  const cleanTotal = Number(total) || (Number(transportation) + Number(electricity) + Number(food) + Number(waste));
  const data = {
    transportation: Number(transportation) || 0,
    electricity: Number(electricity) || 0,
    food: Number(food) || 0,
    waste: Number(waste) || 0,
    total: cleanTotal,
  };

  // If Gemini API is not configured, return high-quality heuristic response
  if (!aiClient) {
    const fallback = generateRuleBasedInsights(data);
    return res.json({
      success: true,
      source: 'offline-heuristic',
      insights: fallback,
      note: 'Analyzed using built-in environmental benchmark engine. Connect a Gemini API key for live generative synthesis.',
    });
  }

  try {
    const prompt = `You are an environmental awareness assistant.
Analyze the user's estimated carbon footprint.

User data:
Transportation: ${data.transportation.toFixed(1)} kg CO2e
Electricity: ${data.electricity.toFixed(1)} kg CO2e
Food: ${data.food.toFixed(1)} kg CO2e
Waste: ${data.waste.toFixed(1)} kg CO2e
Total: ${data.total.toFixed(1)} kg CO2e

Tasks:
1. Identify the largest emission category.
2. Explain the result in simple language.
3. Provide 3-5 realistic ways to reduce emissions.
4. Prioritize suggestions based on the user's largest emission source.
5. Avoid unrealistic or extreme recommendations.
6. Clearly state that the values are estimates.
7. Do not provide medical, financial, or other unrelated advice.

Return the response using:
- Summary
- Main emission source
- Key observations
- Recommended actions
- Expected improvement areas`;

    let response;
    try {
      response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction:
            'You are EcoTrack AI, an encouraging, professional college environmental mentor. Always produce actionable, practical tips suitable for students and individuals. Values are estimates.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: {
                type: Type.STRING,
                description: 'Executive 2-3 sentence overview explaining the footprint',
              },
              mainEmissionSource: {
                type: Type.STRING,
                description: 'The single largest category and its contribution',
              },
              keyObservations: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '3 to 4 concise bullet observations on the breakdown',
              },
              recommendedActions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '3 to 5 realistic, high-impact actions prioritized by largest emission',
              },
              expectedImprovementAreas: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '2 to 3 projected improvements if recommendations are implemented',
              },
            },
            required: [
              'summary',
              'mainEmissionSource',
              'keyObservations',
              'recommendedActions',
              'expectedImprovementAreas',
            ],
          },
        },
      });
    } catch (primaryErr: any) {
      // If 503 high demand on 3.8 flash, try gemini-flash-latest
      if (primaryErr?.status === 503 || primaryErr?.message?.includes('503')) {
        response = await aiClient.models.generateContent({
          model: 'gemini-flash-latest',
          contents: prompt + '\nReturn strictly valid JSON matching the requested schema.',
          config: {
            responseMimeType: 'application/json',
          },
        });
      } else {
        throw primaryErr;
      }
    }

    const text = response.text;
    if (!text) {
      throw new Error('Empty response from Gemini API');
    }

    const parsed = JSON.parse(text);
    return res.json({
      success: true,
      source: 'gemini-3.8-flash',
      insights: parsed,
    });
  } catch (err: any) {
    console.error('Gemini API Error in /api/gemini/insights:', err);
    // Graceful fallback to rule-based insights so user experience never fails
    const fallback = generateRuleBasedInsights(data);
    return res.json({
      success: true,
      source: 'offline-heuristic',
      insights: fallback,
      note: 'Using fallback environmental engine due to temporary AI service unavailability.',
    });
  }
});

// API: AI Chat Assistant
app.post('/api/gemini/chat', async (req, res) => {
  const { message = '', history = [], userFootprint = null } = req.body || {};

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Check built-in FAQ triggers if no AI or network issue
  const lower = message.trim().toLowerCase();

  if (!aiClient) {
    let reply = '';
    for (const [key, val] of Object.entries(FAQ_ANSWERS)) {
      if (lower.includes(key)) {
        reply = val;
        break;
      }
    }
    if (!reply) {
      reply = `Thank you for asking about "${message.trim()}". As an environmental advisor, my main advice is to target your highest emission areas (transportation and electricity usually make up 70% of a student's footprint). Try walking for short distances, conserving energy during peak hours, and minimizing single-use items! (Running in demo mode: add GEMINI_API_KEY for dynamic conversations).`;
    }
    return res.json({
      success: true,
      source: 'offline-heuristic',
      reply,
    });
  }

  try {
    const footprintContextStr = userFootprint
      ? `User's latest footprint: Total: ${userFootprint.total} kg CO₂e (Transport: ${userFootprint.transportation} kg, Electricity: ${userFootprint.electricity} kg, Food: ${userFootprint.food} kg, Waste: ${userFootprint.waste} kg).`
      : 'User has not yet calculated their footprint.';

    const systemInstruction = `You are EcoTrack Chat Assistant, a friendly, student-focused environmental science mentor.
${footprintContextStr}
Guidelines:
- Answer in simple, clear, student-friendly language.
- Provide realistic and actionable sustainability advice.
- Keep responses concise (2 to 4 short paragraphs or bullet points).
- Clearly remind users that carbon calculations are estimates.
- Never give medical, legal, or financial advice.`;

    const chatContents: any[] = [];
    if (Array.isArray(history)) {
      for (const item of history.slice(-6)) {
        if (item && (item.role === 'user' || item.role === 'model') && typeof item.text === 'string' && item.text.trim()) {
          // Gemini multi-turn must start with a 'user' turn
          if (chatContents.length === 0 && item.role !== 'user') {
            continue;
          }
          // Do not allow consecutive turns with identical role
          if (chatContents.length > 0 && chatContents[chatContents.length - 1].role === item.role) {
            chatContents[chatContents.length - 1].parts[0].text += `\n${item.text}`;
            continue;
          }
          chatContents.push({
            role: item.role,
            parts: [{ text: item.text }],
          });
        }
      }
    }

    // Append the active user query
    if (chatContents.length > 0 && chatContents[chatContents.length - 1].role === 'user') {
      chatContents[chatContents.length - 1].parts[0].text += `\n${message}`;
    } else {
      chatContents.push({
        role: 'user',
        parts: [{ text: message }],
      });
    }

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: chatContents,
      config: {
        systemInstruction,
      },
    });

    const text = response.text || 'I am ready to help you reduce your environmental footprint. What would you like to know?';
    return res.json({
      success: true,
      source: 'gemini-3.8-flash',
      reply: text,
    });
  } catch (err: any) {
    console.error('Gemini API Error in /api/gemini/chat:', err);
    let reply = '';
    for (const [key, val] of Object.entries(FAQ_ANSWERS)) {
      if (lower.includes(key)) {
        reply = val;
        break;
      }
    }
    if (!reply) {
      reply =
        'A great way to cut environmental impact is by choosing active travel (cycling/walking), turning off unused electronics, opting for plant-forward campus meals, and avoiding disposable plastic bottles. (Temporary AI network limitation; showing guidance).';
    }
    return res.json({
      success: true,
      source: 'offline-heuristic',
      reply,
    });
  }
});

// SIMULATOR EXPLAIN ENDPOINT (Uses AI ONLY for qualitative explanation & student suggestions)
app.post('/api/gemini/simulator-explain', async (req, res) => {
  const {
    currentTotal = 0,
    newTotal = 0,
    reductionKg = 0,
    percentageReduction = 0,
    categoryModified = 'Transportation',
    scenarioDescription = 'Simulation change',
  } = req.body || {};

  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    const aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const prompt = `You are EcoTrack AI, an encouraging college environmental mentor.
The student ran a "What-If Simulation" for personal sustainability.
DO NOT recalculate the numbers. The application has already determined:
- Baseline monthly footprint: ${currentTotal} kg CO2e
- New simulated footprint: ${newTotal} kg CO2e
- Exact carbon reduction: ${reductionKg} kg CO2e per month
- Percentage reduction: ${percentageReduction}%
- Action modified: ${categoryModified}
- Scenario: "${scenarioDescription}"

Tasks:
1. Provide a concise, motivating 2-3 sentence explanation of why this specific change reduces carbon so effectively.
2. Provide 3 practical, realistic action tips for a college student living in a dorm or apartment to accomplish this change.
3. Provide an educational annual impact comparison (e.g., equivalent trees, passenger car miles avoided, or semester savings).
4. Values are estimates for student awareness. Do not provide medical, financial, or extreme advice.`;

    let response;
    try {
      response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction:
            'You are EcoTrack AI, explaining simulated carbon reductions in simple student-friendly language. Always output strictly valid JSON matching the schema.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              explanation: {
                type: Type.STRING,
                description: 'Clear explanation of why this change yields carbon savings',
              },
              practicalTips: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '3 realistic tips for college students to adopt this habit',
              },
              annualImpact: {
                type: Type.STRING,
                description: 'Annual or semester impact perspective',
              },
            },
            required: ['explanation', 'practicalTips', 'annualImpact'],
          },
        },
      });
    } catch (err: any) {
      if (err?.status === 503 || err?.message?.includes('503')) {
        response = await aiClient.models.generateContent({
          model: 'gemini-flash-latest',
          contents: prompt + '\nReturn strictly valid JSON matching the requested schema.',
          config: {
            responseMimeType: 'application/json',
          },
        });
      } else {
        throw err;
      }
    }

    const text = response.text;
    if (!text) throw new Error('Empty response from model');

    const parsed = JSON.parse(text);
    return res.json({
      success: true,
      explanation: parsed.explanation,
      practicalTips: parsed.practicalTips,
      annualImpact: parsed.annualImpact,
      source: 'gemini-3.8-flash',
    });
  } catch (error: any) {
    console.warn('Gemini simulator explain error, using heuristic fallback:', error?.message);

    // Rule-based high quality fallback
    const annualKg = (reductionKg * 12).toFixed(1);
    const trees = Math.ceil((reductionKg * 12) / 22);

    let defaultExplanation = `By adjusting ${categoryModified.toLowerCase()} habits in this scenario, you directly reduce ${reductionKg} kg CO₂e every month (${percentageReduction}% total footprint reduction).`;
    if (categoryModified === 'Transportation') {
      defaultExplanation = `Replacing solo car combustion trips with shared transit or active cycling eliminates fuel burn and cold-start tailpipe emissions, saving ${reductionKg} kg CO₂e monthly (${percentageReduction}% reduction).`;
    } else if (categoryModified === 'Electricity') {
      defaultExplanation = `Reducing compressor load and electronics standby draw lowers continuous kilowatt-hour demand on the power grid, avoiding ${reductionKg} kg CO₂e monthly (${percentageReduction}% reduction).`;
    } else if (categoryModified === 'Food') {
      defaultExplanation = `Shifting toward plant-rich meals significantly reduces agricultural methane, feed crop land clearing, and cold-chain livestock transport, trimming ${reductionKg} kg CO₂e monthly (${percentageReduction}% reduction).`;
    } else if (categoryModified === 'Waste') {
      defaultExplanation = `Diverting organic and recyclable items from landfills stops anaerobic methane generation while reducing petroleum-based single-use plastic production by ${reductionKg} kg CO₂e monthly.`;
    }

    return res.json({
      success: true,
      explanation: defaultExplanation,
      practicalTips: [
        `Incorporate this change gradually (e.g. 2 to 3 days per week) to build consistent campus habits.`,
        `Coordinate with roommates or classmates to share resources, carpool, or meal-prep together.`,
        `Track your weekly consistency on EcoTrack to verify that real-world reductions match this simulation.`,
      ],
      annualImpact: `Over an academic year, this single behavioral adjustment saves approximately ${annualKg} kg CO₂e—the carbon absorption equivalent of planting ${trees} mature trees!`,
      source: 'offline-heuristic',
      note: 'Analyzed using environmental benchmark model.',
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EcoTrack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
