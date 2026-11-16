
import { NextRequest, NextResponse } from 'next/server';

interface CriticalAction {
  priority: number;
  category: string;
  issue: string;
  fix_action: string;
  timeline: string;
  regulatory_reference: string;
}

interface AiReport {
  executive_summary: string;
  compliance_band_explanation: string;
  strengths: string[];
  critical_actions: CriticalAction[];
  buyer_ready_statement: string;
  next_assessment_date: string;
  disclaimer: string;
}

function fallbackReport(): AiReport {
  return {
    executive_summary: "This is a general fallback report shown when the AI service is unavailable. It is NOT based on your specific answers. Please check each item below against your own records and with your buyer.",
    compliance_band_explanation: "The EU textile Digital Product Passport rules are still being drafted. Your score is a self-reported indication only and does not show legal compliance.",
    strengths: [
      "Factory has started a DPP self-assessment",
      "Assessment data recorded for progress tracking",
      "Improvement roadmap now available for implementation"
    ],
    critical_actions: [
      {priority:1, category:"Factory Identity",    issue:"GLN status to be confirmed",         fix_action:"Ask GS1 Bangladesh how to obtain a Global Location Number (GLN). GS1 identifiers appear in the draft DPP data model; confirm with your buyer whether they are required.", timeline:"1-2 weeks",  regulatory_reference:"EU ESPR (draft textile rules; confirm reference)"},
      {priority:2, category:"Chemical Compliance", issue:"Chemical compliance documents to be confirmed",      fix_action:"Ask your buyer or an accredited laboratory which chemical compliance documents (for example REACH-related declarations) they need.",                          timeline:"4-6 weeks",  regulatory_reference:"REACH Regulation (EC) No 1907/2006"},
      {priority:3, category:"Physical Testing",    issue:"ISO test reports to be confirmed",         fix_action:"Locate existing ISO 3759 shrinkage and ISO 16322-3 spirality test reports, or ask an accredited laboratory about testing.",  timeline:"3-4 weeks",  regulatory_reference:"ISO 3759:2011"},
      {priority:4, category:"Circularity",         issue:"Recycling instructions to be confirmed", fix_action:"Add recycling symbols and end-of-life instructions to all garment labels.",                            timeline:"1 week",     regulatory_reference:"EU ESPR (confirm reference)"}
    ],
    buyer_ready_statement: "This factory has completed a self-reported DPP readiness check. This is not a certificate or verified compliance.",
    next_assessment_date: "Reassess in 3 months after implementing critical actions",
    disclaimer: "This report is AI-generated based on self-reported data. It is an advisory tool and does not constitute legal certification. Independent lab testing and official certification bodies must be consulted for legally binding compliance."
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { factory?: Record<string,string>; score?: number; failed_ids?: number[] };
    const { factory, score, failed_ids } = body;

    const GEMINI_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_KEY) {
      return NextResponse.json({ success: true, report: fallbackReport(), fallback: true });
    }

    const scoreBand =
      (score ?? 0) >= 90 ? 'SELF-REPORTED: STRONG' :
      (score ?? 0) >= 70 ? 'SELF-REPORTED: MINOR GAPS' :
      (score ?? 0) >= 50 ? 'DEVELOPING' : 'SELF-REPORTED: MAJOR GAPS';

    const lines = [
      'You are an expert EU ESPR Textile Compliance Advisor.',
      'Analyze this factory DPP assessment and return ONLY valid JSON.',
      '',
      'FACTORY: ' + (factory?.factory_name ?? 'Unknown'),
      'COUNTRY: ' + (factory?.country ?? 'Bangladesh'),
      'SCORE: ' + String(score ?? 0) + '/100',
      'BAND: ' + scoreBand,
      'FAILED QUESTION IDs: ' + JSON.stringify(failed_ids ?? []),
      '',
      'Return ONLY this JSON structure with no markdown:',
      '{',
      '  "executive_summary": "2-3 sentence professional overview",',
      '  "compliance_band_explanation": "what this score means for EU market access",',
      '  "strengths": ["strength 1", "strength 2"],',
      '  "critical_actions": [',
      '    {',
      '      "priority": 1,',
      '      "category": "category name",',
      '      "issue": "what failed or is missing",',
      '      "fix_action": "exact step-by-step action to take",',
      '      "timeline": "e.g. 2-4 weeks",',
      '      "regulatory_reference": "ISO/REACH/ESPR reference"',
      '    }',
      '  ],',
      '  "buyer_ready_statement": "one sentence for EU buyers",',
      '  "next_assessment_date": "reassessment recommendation",',
      '  "disclaimer": "This report is AI-generated based on self-reported data. It is an advisory tool and does not constitute legal certification."',
      '}',
    ];
    const promptText = lines.join('\n');

    const geminiRes = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + GEMINI_KEY,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 1500 }
        })
      }
    );

    if (!geminiRes.ok) {
      return NextResponse.json({ success: true, report: fallbackReport(), fallback: true });
    }

    const geminiData = await geminiRes.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
    const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

    try {
      const parsed = JSON.parse(cleaned) as AiReport;
      return NextResponse.json({ success: true, report: parsed });
    } catch {
      return NextResponse.json({ success: true, report: fallbackReport(), fallback: true });
    }

  } catch (err) {
    console.error('Report generation error:', String(err));
    return NextResponse.json({ success: true, report: fallbackReport(), fallback: true });
  }
}
