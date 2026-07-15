
import { NextRequest, NextResponse } from 'next/server';

interface EmailBody {
  to: string;
  factory_name: string;
  score: number;
  band: string;
  report_id: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as EmailBody;
    const RESEND_KEY = process.env.RESEND_API_KEY;

    if (!RESEND_KEY) {
      return NextResponse.json({ success: false, reason: "No Resend key" });
    }

    const scoreColor = body.score >= 90 ? "#22c55e" : body.score >= 70 ? "#eab308" : body.score >= 50 ? "#f97316" : "#ef4444";
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://dpp-atlas.vercel.app";

    const html = [
      '<div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;">',
      '<div style="background:#0f172a;padding:24px;text-align:center;">',
      '<h1 style="color:#14b8a6;margin:0;font-size:1.4rem;">🌿 DPP Atlas</h1>',
      '<p style="color:#94a3b8;margin:8px 0 0;font-size:0.85rem;">EU ESPR Textile Compliance Platform</p>',
      '</div>',
      '<div style="padding:32px;">',
      '<h2 style="color:#0f172a;margin-bottom:8px;">Assessment Complete</h2>',
      '<p style="color:#64748b;">Dear <strong>' + body.factory_name + '</strong>,</p>',
      '<p style="color:#64748b;">Your DPP compliance assessment has been completed. Here is your result:</p>',
      '<div style="text-align:center;padding:24px;background:#f8fafc;border-radius:12px;margin:20px 0;">',
      '<div style="font-size:3.5rem;font-weight:800;color:' + scoreColor + ';">' + Math.min(100,body.score) + '</div>',
      '<div style="color:#64748b;font-size:0.9rem;">/100 Compliance Score</div>',
      '<div style="margin-top:8px;font-weight:700;color:' + scoreColor + ';">' + body.band + '</div>',
      '</div>',
      '<div style="margin:20px 0;">',
      '<a href="' + appUrl + '/en/report/' + body.report_id + '" style="background:#0d9488;color:white;padding:14px 28px;border-radius:10px;text-decoration:none;font-weight:700;display:inline-block;">',
      '📄 View Full AI Report',
      '</a>',
      '</div>',
      '<p style="color:#94a3b8;font-size:0.78rem;margin-top:24px;padding-top:16px;border-top:1px solid #f1f5f9;">',
      'Report ID: ' + body.report_id + '<br/>',
      'This report is AI-generated based on self-reported data. Not a legal certificate.',
      '</p>',
      '</div>',
      '</div>',
    ].join('');

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + RESEND_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "DPP Atlas <reports@dpp-atlas.vercel.app>",
        to: [body.to],
        subject: "Your DPP Compliance Report — " + body.factory_name + " — Score: " + Math.min(100,body.score) + "/100",
        html: html
      })
    });

    if (res.ok) {
      return NextResponse.json({ success: true });
    } else {
      const err = await res.text();
      console.error("Resend error:", err);
      return NextResponse.json({ success: false, reason: err });
    }
  } catch (err) {
    console.error("Email error:", String(err));
    return NextResponse.json({ success: false });
  }
}
