
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
    executive_summary: "Your factory has completed the DPP compliance assessment. Based on your self-reported data, we have identified key areas requiring attention to meet EU ESPR 2027 requirements. Please review the critical actions below.",
    compliance_band_explanation: "Your score indicates areas where immediate action is needed to achieve EU Digital Product Passport compliance before the 2027 mandate deadline.",
    strengths: [
      "Factory has engaged in the DPP compliance process",
      "Assessment data recorded for progress tracking",
      "Improvement roadmap now available for implementation"
    ],
    critical_actions: [
      {priority:1, category:"Factory Identity",    issue:"GS1 GLN number not registered",         fix_action:"Register at gs1.org/services/gln for a free Global Location Number. Mandatory for EU DPP traceability.", timeline:"1-2 weeks",  regulatory_reference:"EU ESPR Regulation Article 9"},
      {priority:2, category:"Chemical Compliance", issue:"REACH audit documentation missing",      fix_action:"Commission a REACH audit from SGS, Bureau Veritas, or Intertek in Bangladesh.",                          timeline:"4-6 weeks",  regulatory_reference:"REACH Regulation (EC) No 1907/2006"},
      {priority:3, category:"Physical Testing",    issue:"ISO test certifications missing",         fix_action:"Submit fabric samples to a BGMEA-approved lab for ISO 3759 shrinkage and ISO 16322-3 spirality tests.",  timeline:"3-4 weeks",  regulatory_reference:"ISO 3759:2011"},
      {priority:4, category:"Circularity",         issue:"Recycling instructions missing on labels", fix_action:"Add recycling symbols and end-of-life instructions to all garment labels.",                            timeline:"1 week",     regulatory_reference:"EU ESPR Annex I"}
    ],
    buyer_ready_statement: "This factory has initiated EU ESPR DPP compliance assessment and is actively implementing improvements to meet the 2027 mandate.",
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
      (score ?? 0) >= 90 ? 'DPP COMPLIANT' :
      (score ?? 0) >= 70 ? 'CONDITIONALLY COMPLIANT' :
      (score ?? 0) >= 50 ? 'DEVELOPING' : 'NON-COMPLIANT';

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
