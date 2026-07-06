
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { factory, score, answers, failed_ids } = body;
    const GEMINI_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_KEY) {
      return NextResponse.json({ success: true, report: fallbackReport(), fallback: true });
    }

    const scoreBand =
      score >= 90 ? 'DPP COMPLIANT' :
      score >= 70 ? 'CONDITIONALLY COMPLIANT' :
      score >= 50 ? 'DEVELOPING' : 'NON-COMPLIANT';

    const promptText = [
      'You are an expert EU ESPR Textile Compliance Advisor.',
      'Analyze this factory DPP assessment and generate a structured JSON report.',
      '',
      'FACTORY: ' + (factory?.factory_name || 'Unknown'),
      'COUNTRY: ' + (factory?.country || 'Bangladesh'),
      'TIER: ' + (factory?.tier_level || 'tier1'),
      'SCORE: ' + score + '/100',
      'BAND: ' + scoreBand,
      'FACTORY TYPE: ' + (factory?.factory_type || 'RMG Garment'),
      '',
      'FAILED QUESTION IDs (scored 0): ' + JSON.stringify(failed_ids || []),
      '',
      'RULES:',
      '- Be specific and actionable',
      '- Reference exact ISO/REACH/ESPR standards',
      '- For Bangladesh factories reference BGMEA where relevant',
      '- Keep executive summary to 2-3 sentences',
      '- List maximum 5 critical actions sorted by priority',
      '',
      'Respond ONLY with this JSON, no markdown backticks:',
      '{',
      '  "executive_summary": "2-3 sentence overview",',
      '  "compliance_band_explanation": "what this score means for EU market access",',
      '  "strengths": ["strength 1", "strength 2"],',
      '  "critical_actions": [{"priority":1,"category":"name","issue":"what failed","fix_action":"what to do","timeline":"2-4 weeks","regulatory_reference":"ISO/REACH ref"}],',
      '  "buyer_ready_statement": "one sentence for buyers",',
      '  "next_assessment_date": "reassessment recommendation",',
      '  "disclaimer": "This report is AI-generated based on self-reported data. It is an advisory tool and does not constitute legal certification. Independent lab testing and official certification bodies must be consulted for legally binding compliance."',
      '}',
    ].join('\n');

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

    const geminiData = await geminiRes.json();
    const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

    try {
      const aiReport = JSON.parse(cleaned);
      return NextResponse.json({ success: true, report: aiReport });
    } catch {
      return NextResponse.json({ success: true, report: fallbackReport(), fallback: true });
    }

  } catch (err) {
    console.error('Report generation error:', err);
    return NextResponse.json({ success: true, report: fallbackReport(), fallback: true });
  }
}

function fallbackReport() {
  return {
    executive_summary: "Your factory has completed the DPP compliance assessment. Based on your self-reported data, we have identified key areas requiring attention to meet EU ESPR 2027 requirements. Please review the critical actions below and prioritize implementation.",
    compliance_band_explanation: "Your current score indicates areas where immediate action is needed to achieve EU Digital Product Passport compliance before the 2027 mandate deadline.",
    strengths: [
      "Factory has engaged in the DPP compliance process",
      "Assessment data recorded for progress tracking",
      "Improvement roadmap now available for implementation"
    ],
    critical_actions: [
      { priority:1, category:"Factory Identity", issue:"GS1 Global Location Number not registered", fix_action:"Register at gs1.org/services/gln for a free GLN. This is mandatory for EU DPP traceability.", timeline:"1-2 weeks", regulatory_reference:"EU ESPR Regulation Article 9" },
      { priority:2, category:"Chemical Compliance", issue:"REACH compliance audit documentation needed", fix_action:"Commission a REACH audit from SGS, Bureau Veritas, or Intertek in Bangladesh.", timeline:"4-6 weeks", regulatory_reference:"REACH Regulation (EC) No 1907/2006 Article 33" },
      { priority:3, category:"Physical Testing", issue:"ISO test certifications may be missing", fix_action:"Submit fabric samples to a BGMEA-approved lab for ISO 3759 and ISO 16322-3 testing.", timeline:"3-4 weeks", regulatory_reference:"ISO 3759:2011" },
      { priority:4, category:"Circularity", issue:"End-of-life recycling instructions missing from product labels", fix_action:"Add recycling symbols and instructions to all garment labels.", timeline:"1 week", regulatory_reference:"EU ESPR Annex I" }
    ],
    buyer_ready_statement: "This factory has initiated EU ESPR DPP compliance assessment and is actively implementing improvements to meet the 2027 mandate.",
    next_assessment_date: "Reassess in 3 months after implementing critical actions",
    disclaimer: "This report is AI-generated based on self-reported data. It is an advisory tool and does not constitute legal certification. Independent lab testing and official certification bodies must be consulted for legally binding compliance."
  };
}
