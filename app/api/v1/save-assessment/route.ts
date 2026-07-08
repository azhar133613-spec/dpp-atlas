
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      factory: Record<string,string>;
      score: number;
      band: string;
      answers: Record<number,string>;
      failed_ids: number[];
      ai_report?: Record<string,unknown>;
      report_id: string;
    };

    const sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. Upsert factory
    const { data: factoryRow, error: factoryErr } = await sb
      .from('factories')
      .upsert({
        factory_name: body.factory.factory_name || 'Unknown',
        country:      body.factory.country      || 'Bangladesh',
        tier_level:   body.factory.tier_level   || 'tier1',
        factory_type: body.factory.factory_type || 'rmd',
        contact_email:body.factory.email        || null,
      }, { onConflict: 'factory_name,country' })
      .select('id')
      .single();

    if (factoryErr) {
      console.error('Factory upsert error:', factoryErr.message);
    }

    const factoryId = (factoryRow as {id:string}|null)?.id ?? null;

    // 2. Insert assessment
    const { error: assessErr } = await sb
      .from('assessments')
      .insert({
        id:               body.report_id,
        factory_id:       factoryId,
        session_data:     body.answers,
        compliance_score: body.score,
        score_breakdown:  { band: body.band, failed_ids: body.failed_ids },
        language_used:    'en',
      });

    if (assessErr) {
      console.error('Assessment insert error:', assessErr.message);
    }

    // 3. Insert AI report if present
    if (body.ai_report) {
      await sb.from('ai_reports').insert({
        assessment_id:    body.report_id,
        ai_provider:      'gemini-1.5-flash',
        report_content:   JSON.stringify(body.ai_report),
        improvement_tips: body.ai_report,
      });
    }

    return NextResponse.json({ success: true, factory_id: factoryId });

  } catch (err) {
    console.error('Save assessment error:', String(err));
    // Return success anyway — localStorage is the fallback
    return NextResponse.json({ success: true, fallback: true });
  }
}
