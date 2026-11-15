import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

interface SaveBody {
  factory: Record<string, string>;
  score: number;
  band: string;
  answers: Record<number, string>;
  failed_ids: number[];
  ai_report?: Record<string, unknown>;
  report_id: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as SaveBody;

    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    let sb;
    let userId: string | null = null;

    if (token) {
      // Logged in: use the anon key + this user's token, so RLS enforces ownership naturally
      sb = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { global: { headers: { Authorization: `Bearer ${token}` } } }
      );
      const { data: userData } = await sb.auth.getUser(token);
      userId = userData?.user?.id ?? null;
    } else {
      // Not logged in: same behavior as before, service role, user_id stays null
      sb = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
    }

    // 1. Find or create factory
    let factoryId: string | null = null;
    try {
      if (userId) {
        const { data: existingFactory } = await sb
          .from('factories')
          .select('id')
          .eq('user_id', userId)
          .maybeSingle();

        if (existingFactory) {
          factoryId = (existingFactory as { id: string }).id;
          await sb.from('factories').update({
            factory_name: body.factory.factory_name || 'Unknown',
            country: body.factory.country || 'Bangladesh',
            tier_level: body.factory.tier_level || 'tier1',
            factory_type: body.factory.factory_type || 'rmd',
            contact_email: body.factory.email || null,
          }).eq('id', factoryId);
        } else {
          const { data: newFactory } = await sb
            .from('factories')
            .insert({
              user_id: userId,
              factory_name: body.factory.factory_name || 'Unknown',
              country: body.factory.country || 'Bangladesh',
              tier_level: body.factory.tier_level || 'tier1',
              factory_type: body.factory.factory_type || 'rmd',
              contact_email: body.factory.email || null,
            })
            .select('id')
            .single();
          factoryId = (newFactory as { id: string } | null)?.id ?? null;
        }
      } else {
        // Anonymous: legacy best-effort match by name+country, no ownership
        const { data: existingFactory } = await sb
          .from('factories')
          .select('id')
          .is('user_id', null)
          .eq('factory_name', body.factory.factory_name || 'Unknown')
          .eq('country', body.factory.country || 'Bangladesh')
          .maybeSingle();

        if (existingFactory) {
          factoryId = (existingFactory as { id: string }).id;
        } else {
          const { data: newFactory } = await sb
            .from('factories')
            .insert({
              factory_name: body.factory.factory_name || 'Unknown',
              country: body.factory.country || 'Bangladesh',
              tier_level: body.factory.tier_level || 'tier1',
              factory_type: body.factory.factory_type || 'rmd',
              contact_email: body.factory.email || null,
            })
            .select('id')
            .single();
          factoryId = (newFactory as { id: string } | null)?.id ?? null;
        }
      }
    } catch (e) {
      console.error('Factory save error:', String(e));
    }

    // 2. Insert assessment
    let assessmentId: string | null = null;
    try {
      const { data: asmData } = await sb
        .from('assessments')
        .insert({
          user_id: userId,
          local_report_id: body.report_id,
          factory_id: factoryId,
          session_data: body.answers,
          compliance_score: body.score,
          score_breakdown: { band: body.band, failed_ids: body.failed_ids },
          language_used: 'en',
        })
        .select('id')
        .single();
      assessmentId = (asmData as { id: string } | null)?.id ?? null;
    } catch (e) {
      console.error('Assessment save error:', String(e));
    }

    // 3. Insert AI report
    if (body.ai_report && assessmentId) {
      try {
        await sb.from('ai_reports').insert({
          assessment_id: assessmentId,
          ai_provider: 'gemini-1.5-flash',
          report_content: JSON.stringify(body.ai_report),
          improvement_tips: body.ai_report,
        });
      } catch (e) {
        console.error('AI report save error:', String(e));
      }
    }

    return NextResponse.json({ success: true, factory_id: factoryId, synced: !!userId });
  } catch (err) {
    console.error('Save error:', String(err));
    return NextResponse.json({ success: true, fallback: true });
  }
}