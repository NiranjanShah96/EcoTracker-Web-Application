import { AIInsightsData, EmissionBreakdown, ChatMessage } from '../types';

export async function fetchAIInsights(breakdown: EmissionBreakdown): Promise<{
  success: boolean;
  insights: AIInsightsData;
  source?: string;
  note?: string;
}> {
  try {
    const res = await fetch('/api/gemini/insights', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(breakdown),
    });

    if (!res.ok) {
      throw new Error(`Server returned status ${res.status}`);
    }

    const data = await res.json();
    if (data.insights) {
      return {
        success: true,
        insights: data.insights,
        source: data.source,
        note: data.note,
      };
    }
    throw new Error('Invalid response structure from insights API');
  } catch (error: any) {
    console.warn('API Insights fetch failed, using client fallback:', error);
    // Client-side fallback if server route unreachable
    const categories = [
      { name: 'Transportation', value: breakdown.transportation },
      { name: 'Electricity', value: breakdown.electricity },
      { name: 'Food', value: breakdown.food },
      { name: 'Waste', value: breakdown.waste },
    ].sort((a, b) => b.value - a.value);

    const largest = categories[0];
    const pct = breakdown.total > 0 ? Math.round((largest.value / breakdown.total) * 100) : 0;

    return {
      success: true,
      source: 'offline-client-engine',
      note: 'Analyzed using offline environmental heuristic model.',
      insights: {
        summary: `Your calculated footprint is ${breakdown.total.toFixed(1)} kg CO₂e per month. ${largest.name} is your highest emission category at ${pct}%.`,
        mainEmissionSource: `${largest.name} (${largest.value.toFixed(1)} kg CO₂e / ${pct}%)`,
        keyObservations: [
          `${largest.name} constitutes the largest single share (${pct}%) of your total environmental footprint.`,
          `Your footprint of ${breakdown.total.toFixed(1)} kg/mo corresponds to ~${((breakdown.total * 12) / 1000).toFixed(2)} metric tonnes CO₂e per year.`,
          `Active steps in ${largest.name} offer the fastest leverage for meeting sustainable living targets.`,
          `Reminder: All metrics are educational estimates for student awareness.`,
        ],
        recommendedActions: [
          `Target immediate reductions in ${largest.name} by choosing eco-friendly alternatives.`,
          `Track recurring energy and travel habits on a weekly basis to identify peak usage days.`,
          `Adopt active travel (walking or cycling) for campus trips under 3 km.`,
          `Combine plant-based meals and reusable hydration to lower daily indirect emissions.`,
        ],
        expectedImprovementAreas: [
          `Potential monthly reduction of ${(breakdown.total * 0.2).toFixed(1)} kg CO₂e with habit adjustments.`,
          `Long-term improvement toward 1.5°C climate goals (<200 kg CO₂e/month).`,
        ],
      },
    };
  }
}

export async function sendChatMessage(
  message: string,
  history: ChatMessage[],
  userFootprint?: EmissionBreakdown | null
): Promise<{ success: boolean; reply: string; source?: string }> {
  try {
    const formattedHistory = history.map((h) => ({
      role: h.role,
      text: h.text,
    }));

    const res = await fetch('/api/gemini/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        history: formattedHistory,
        userFootprint,
      }),
    });

    if (!res.ok) {
      throw new Error(`Server returned status ${res.status}`);
    }

    const data = await res.json();
    return {
      success: true,
      reply: data.reply || 'Here is an eco-friendly tip: focus on public transit and energy conservation!',
      source: data.source,
    };
  } catch (error) {
    console.warn('Chat request failed, providing local answer:', error);
    return {
      success: true,
      source: 'offline-local-reply',
      reply:
        'As an environmental mentor, my top advice for students is to walk or cycle for short distances, power down gaming rigs and laptops when not studying, and carry a refillable water flask to avoid single-use plastics!',
    };
  }
}

export async function checkServerStatus(): Promise<{
  status: string;
  hasApiKey: boolean;
  model: string;
}> {
  try {
    const res = await fetch('/api/status');
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // ignore
  }
  return { status: 'offline', hasApiKey: false, model: 'gemini-3.8-flash' };
}

export async function fetchSimulatorExplanation(data: {
  currentTotal: number;
  newTotal: number;
  reductionKg: number;
  percentageReduction: number;
  categoryModified: string;
  scenarioDescription: string;
}): Promise<{
  success: boolean;
  explanation: string;
  practicalTips: string[];
  annualImpact: string;
  source?: string;
  note?: string;
}> {
  try {
    const res = await fetch('/api/gemini/simulator-explain', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error(`Server returned status ${res.status}`);
    }

    const json = await res.json();
    return {
      success: true,
      explanation: json.explanation,
      practicalTips: json.practicalTips || [],
      annualImpact: json.annualImpact || '',
      source: json.source,
      note: json.note,
    };
  } catch (error) {
    console.warn('Simulator explanation fetch failed, using heuristic fallback:', error);
    const annualKg = (data.reductionKg * 12).toFixed(1);
    const trees = Math.ceil((data.reductionKg * 12) / 22);

    return {
      success: true,
      explanation: `Adjusting ${data.categoryModified.toLowerCase()} habits in this scenario yields a direct reduction of ${data.reductionKg.toFixed(1)} kg CO₂e every month (${data.percentageReduction}% net footprint reduction).`,
      practicalTips: [
        'Phase in this habit over 2 to 3 days per week to establish sustainable routines.',
        'Coordinate with roommates or classmates to share commute rides or meal prep.',
        'Track ongoing progress in EcoTrack to confirm real-world savings.',
      ],
      annualImpact: `Over an academic year, this adjustment prevents ~${annualKg} kg CO₂e, equal to the annual carbon absorption of ${trees} mature trees!`,
      source: 'offline-heuristic',
      note: 'Using local environmental heuristics model.',
    };
  }
}
