const fs = require('fs');

fs.mkdirSync('app[locale]verify', {recursivetrue});

fs.writeFileSync('app[locale]page.tsx', `
use client;
import { useState, useEffect } from react;

export default function Page({ params } { params { locale string } }) {
  const loc = params.locale;
  const isBn = loc === bn;
  const [count, setCount] = useState(0);

  useEffect(() = {
    let n = 0;
    const t = setInterval(() = {
      n += 103;
      if (n = 6200) { setCount(6200); clearInterval(t); }
      else setCount(n);
    }, 16);
    return () = clearInterval(t);
  }, []);

  const FTYPES = [
    {idrmd,   icon👕, nameRMG  Garment,      descReady-made garments, shirts, trousers, jackets},
    {idknit,  icon🧶, nameKnitwear,            descT-shirts, polo shirts, sweaters, knitwear},
    {iddenim, icon👖, nameDenim,               descDenim fabric, jeans, denim products},
    {idspin,  icon🌀, nameSpinning  Yarn,     descCotton yarn, synthetic yarn, blended yarn},
    {iddye,   icon🎨, nameDyeing & Finishing,  descFabric dyeing, printing, finishing},
    {idsweat, icon🧣, nameSweater  Woolen,    descSweaters, cardigans, woolen products},
    {idhome,  icon🛏️, nameHome Textile,        descBedsheets, towels, curtains, home goods},
    {idacc,   icon🔗, nameAccessories  Trim,  descLabels, buttons, zippers, packaging},
  ];

  const NEWS = [
    {dJul 2026, tEU ESPR Regulation enters enforcement phase for textiles,  tagREGULATION,    c#ef4444},
    {dJun 2026, tBangladesh BGMEA signs MOU with EU DPP working group,      tagBANGLADESH,    c#3b82f6},
    {dJun 2026, tISO 3759 updated with new shrinkage requirements for 2027, tagISO UPDATE,    c#eab308},
    {dMay 2026, tGOTS certification now required for organic cotton DPP,    tagCERTIFICATION, c#22c55e},
  ];

  return (
    main style={{minHeight100vh, background#ffffff, fontFamilysystem-ui,sans-serif, color#0f172a, margin0, padding0}}

      { NAV }
      nav style={{displayflex, alignItemscenter, justifyContentspace-between, padding0 32px, height64px, borderBottom1px solid #f1f5f9, positionsticky, top0, backgroundrgba(255,255,255,0.96), backdropFilterblur(8px), zIndex100, flexWrapwrap, gap8px}}
        div style={{displayflex, alignItemscenter, gap8px}}
          span style={{fontSize1.4rem}}🌿span
          span style={{fontWeight800, fontSize1.1rem, color#0f172a}}DPP Atlasspan
          span style={{fontSize0.65rem, background#dcfce7, color#16a34a, padding2px 8px, borderRadius99px, fontWeight700}}BETAspan
        div
        div style={{displayflex, gap16px, alignItemscenter, flexWrapwrap}}
          a href={#types}       style={{color#64748b, textDecorationnone, fontSize0.875rem}}Factory Typesa
          a href={#resources}   style={{color#64748b, textDecorationnone, fontSize0.875rem}}Resourcesa
          a href={+loc+verify} style={{color#64748b, textDecorationnone, fontSize0.875rem}}Verifya
          a href={isBnenbn} style={{color#64748b, textDecorationnone, fontSize0.875rem, padding5px 10px, border1px solid #e2e8f0, borderRadius8px}}
            {isBn  🇬🇧 EN  🇧🇩 বাংলা}
          a
          a href={+loc+login}  style={{color#64748b, textDecorationnone, fontSize0.875rem}}Logina
          a href={+loc+enroll} style={{background#0d9488, colorwhite, textDecorationnone, padding10px 20px, borderRadius10px, fontWeight700, fontSize0.875rem}}
            {isBn  শুরু করুন  Get Started}
          a
        div
      nav

      { HERO }
      section style={{displaygrid, gridTemplateColumnsrepeat(auto-fit,minmax(300px,1fr)), gap48px, alignItemscenter, maxWidth1200px, margin0 auto, padding80px 32px}}
        div
          div style={{displayinline-flex, alignItemscenter, gap8px, background#f0fdfa, border1px solid #99f6e4, borderRadius99px, padding6px 14px, marginBottom24px}}
            span style={{width8px, height8px, background#10b981, borderRadius50%, displayinline-block}}span
            span style={{color#0f766e, fontSize0.8rem, fontWeight600}}EU ESPR 2027 Compliance Platform — Freespan
          div
          h1 style={{fontSizeclamp(2rem,4vw,3.2rem), fontWeight800, lineHeight1.15, marginBottom20px, color#0f172a}}
            {isBn  বাংলাদেশ টেক্সটাইল  Bangladesh Textile}
            br
            span style={{color#0d9488}}{isBn  DPP কমপ্লায়েন্স  DPP Compliance}span
            br
            {isBn  সহজ করুন  Made Simple}
          h1
          p style={{color#64748b, fontSize1.05rem, lineHeight1.7, marginBottom32px, maxWidth480px}}
            {isBn
               বিনামূল্যে AI-চালিত EU ESPR DPP মূল্যায়ন। আপনার কারখানার ধরন অনুযায়ী কাস্টম প্রশ্ন। তাৎক্ষণিক ভেরিফিকেশন ব্যাজ।
               Free AI-powered EU ESPR Digital Product Passport assessment. Custom questions per factory type. Instant verification badge for buyers.}
          p
          div style={{displayflex, gap12px, flexWrapwrap, marginBottom40px}}
            a href={+loc+enroll} style={{background#0d9488, colorwhite, textDecorationnone, padding14px 28px, borderRadius10px, fontWeight700, fontSize1rem}}
              {isBn  🏭 কারখানা নিবন্ধন করুন  🏭 Register Factory}
            a
            a href={+loc+assess} style={{border2px solid #0d9488, color#0d9488, textDecorationnone, padding12px 24px, borderRadius10px, fontWeight600, fontSize1rem}}
              {isBn  📋 মূল্যায়ন দেখুন  📋 View Assessment}
            a
          div
          div style={{displayflex, gap32px, flexWrapwrap}}
            {[
              {ncount.toLocaleString()++, lisBnমূল্যায়িত কারখানাFactories Assessed},
              {n18,                        lisBnপ্রশ্ন বিভাগQuestion Categories},
              {n$0,                        lisBnসর্বদা বিনামূল্যেForever Free},
            ].map((x,i) = (
              div key={i}
                div style={{fontSize1.75rem, fontWeight800, color#0d9488}}{x.n}div
                div style={{color#94a3b8, fontSize0.8rem, marginTop2px}}{x.l}div
              div
            ))}
          div
        div

        { Score preview card }
        div style={{background#0f172a, borderRadius20px, padding28px, colorwhite}}
          div style={{displayflex, justifyContentspace-between, alignItemscenter, marginBottom20px}}
            span style={{color#94a3b8, fontSize0.75rem}}SAMPLE RESULTspan
            span style={{background#22c55e20, color#22c55e, padding4px 10px, borderRadius99px, fontSize0.75rem, fontWeight700}}✅ COMPLIANTspan
          div
          div style={{textAligncenter, padding12px 0 20px}}
            div style={{fontSize4.5rem, fontWeight800, color#22c55e, lineHeight1}}87div
            div style={{color#64748b, fontSize0.8rem}}100 compliance scorediv
          div
          {[
            {catFactory Identity,      s18, max20, c#22c55e},
            {catMaterial Traceability, s22, max25, c#22c55e},
            {catChemical Compliance,   s14, max20, c#eab308},
            {catPhysical Testing,      s16, max20, c#22c55e},
            {catCircularity,           s17, max15, c#f97316},
          ].map((r,i) = (
            div key={i} style={{marginBottom10px}}
              div style={{displayflex, justifyContentspace-between, marginBottom3px}}
                span style={{color#94a3b8, fontSize0.7rem}}{r.cat}span
                span style={{colorr.c, fontSize0.7rem, fontWeight600}}{r.s}{r.max}span
              div
              div style={{height4px, background#1e293b, borderRadius2px}}
                div style={{height100%, backgroundr.c, borderRadius2px, widthMath.min(100,Math.round(r.sr.max100))+%}} 
              div
            div
          ))}
          div style={{marginTop14px, padding10px 12px, background#0d948820, border1px solid #0d9488, borderRadius8px, fontSize0.75rem, color#5eead4}}
            🤖 AI Complete REACH audit to reach 95+ and unlock full DPP passport
          div
        div
      section

      { TRUST BAR }
      section style={{padding16px 32px, background#f8fafc, borderTop1px solid #f1f5f9, borderBottom1px solid #f1f5f9}}
        div style={{maxWidth1200px, margin0 auto, displayflex, alignItemscenter, gap16px, flexWrapwrap, justifyContentcenter}}
          span style={{color#94a3b8, fontSize0.75rem, fontWeight700}}ALIGNED WITHspan
          {[EU ESPR 2027,ISO 3759,ISO 16322-3,REACH,GOTS,OEKO-TEX,GS1 DPP,BGMEA].map(b = (
            span key={b} style={{color#475569, fontSize0.78rem, fontWeight600, padding5px 12px, border1px solid #e2e8f0, borderRadius8px, backgroundwhite}}{b}span
          ))}
        div
      section

      { FACTORY TYPES }
      section id=types style={{padding80px 32px, maxWidth1200px, margin0 auto}}
        div style={{textAligncenter, marginBottom48px}}
          p style={{color#0d9488, fontSize0.8rem, fontWeight700, letterSpacing1px, marginBottom12px}}BANGLADESH TEXTILE SECTORSp
          h2 style={{fontSizeclamp(1.75rem,3vw,2.4rem), fontWeight800, marginBottom12px}}
            {isBn  আপনার কারখানার ধরন বেছে নিন  Choose Your Factory Type}
          h2
          p style={{color#64748b, maxWidth500px, margin0 auto, lineHeight1.7}}
            {isBn  প্রতিটি ধরনের জন্য আলাদা কাস্টম প্রশ্নাবলী।  Each factory type has sector-specific compliance questions for accurate DPP assessment.}
          p
        div
        div style={{displaygrid, gridTemplateColumnsrepeat(auto-fill,minmax(220px,1fr)), gap16px}}
          {FTYPES.map(f = (
            a key={f.id} href={+loc+enrolltype=+f.id}
              style={{border1.5px solid #e2e8f0, borderRadius14px, padding20px, textDecorationnone, colorinherit, backgroundwhite, displayblock, transitionall 0.2s}}
              div style={{fontSize2.2rem, marginBottom10px}}{f.icon}div
              div style={{fontWeight700, fontSize0.95rem, marginBottom6px, color#0f172a}}{f.name}div
              div style={{color#64748b, fontSize0.78rem, lineHeight1.5, marginBottom12px}}{f.desc}div
              span style={{color#0d9488, fontWeight600, fontSize0.82rem}}
                {isBn  মূল্যায়ন করুন →  Assess now →}
              span
            a
          ))}
        div
      section

      { HOW IT WORKS }
      section style={{padding80px 32px, background#f8fafc}}
        div style={{maxWidth1200px, margin0 auto}}
          div style={{textAligncenter, marginBottom48px}}
            p style={{color#0d9488, fontSize0.8rem, fontWeight700, letterSpacing1px, marginBottom12px}}SIMPLE PROCESSp
            h2 style={{fontSizeclamp(1.75rem,3vw,2.4rem), fontWeight800}}
              {isBn  মাত্র ৪টি ধাপে কমপ্লায়েন্ট হন  Get Compliant in 4 Steps}
            h2
          div
          div style={{displaygrid, gridTemplateColumnsrepeat(auto-fit,minmax(200px,1fr)), gap32px}}
            {[
              {n01, icon🏭, tisBnকারখানা নিবন্ধনRegister Factory,    disBnধরন ও মূল তথ্য দিনSelect type and enter details, h+loc+enroll},
              {n02, icon📋, tisBnমূল্যায়ন সম্পন্নComplete Assessment, disBnকাস্টম প্রশ্নের উত্তর দিনAnswer questions for your sector,  h+loc+assess},
              {n03, icon🤖, tisBnAI রিপোর্ট পানGet AI Report,         disBnতাৎক্ষণিক রোডম্যাপInstant Gemini AI improvement tips,  h+loc+assess},
              {n04, icon✅, tisBnব্যাজ অর্জন করুনEarn Verified Badge,  disBnক্রেতাদের প্রমাণ দিনProve EU DPP readiness to buyers,   h+loc+verify},
            ].map((x,i) = (
              a key={i} href={x.h} style={{textDecorationnone, colorinherit}}
                div style={{fontSize0.72rem, fontWeight800, color#0d9488, marginBottom10px}}STEP {x.n}div
                div style={{width48px, height48px, background#0f172a, borderRadius12px, displayflex, alignItemscenter, justifyContentcenter, fontSize1.3rem, marginBottom14px}}{x.icon}div
                h3 style={{fontWeight700, marginBottom6px, fontSize1rem}}{x.t}h3
                p style={{color#64748b, fontSize0.82rem, lineHeight1.6}}{x.d}p
              a
            ))}
          div
        div
      section

      { VERIFICATION BADGE }
      section style={{padding80px 32px, background#0f172a, colorwhite}}
        div style={{maxWidth1200px, margin0 auto, displaygrid, gridTemplateColumnsrepeat(auto-fit,minmax(280px,1fr)), gap64px, alignItemscenter}}
          div
            p style={{color#5eead4, fontSize0.8rem, fontWeight700, letterSpacing1px, marginBottom12px}}OFFICIAL VERIFICATIONp
            h2 style={{fontSizeclamp(1.75rem,3vw,2.3rem), fontWeight800, marginBottom16px}}
              {isBn  ভেরিফিকেশন ব্যাজ যা ক্রেতারা বিশ্বাস করেন  A Verification Badge Buyers Trust}
            h2
            p style={{color#94a3b8, lineHeight1.7, marginBottom24px}}
              {isBn
                 ৭০+ স্কোর পেলে অফিসিয়াল ভেরিফিকেশন ব্যাজ পাবেন। ক্রেতারা QR স্ক্যান করে তাৎক্ষণিক যাচাই করতে পারবেন।
                 Score 70+ and earn an official DPP Atlas Verification Badge. Buyers scan the QR code to instantly verify your compliance.}
            p
            {[
              isBn✅ QR স্ক্যানযোগ্য✅ QR-scannable — instant buyer verification,
              isBn✅ তারিখ স্ট্যাম্পড✅ Date-stamped — shows assessment date,
              isBn✅ PDF ও PNG ডাউনলোড✅ Downloadable PDF and PNG,
              isBn✅ অনন্য ID — জালিয়াতি প্রতিরোধী✅ Unique ID — fraud-resistant,
            ].map((t,i) = (
              div key={i} style={{color#cbd5e1, fontSize0.875rem, marginBottom8px}}{t}div
            ))}
            div style={{marginTop24px}}
              a href={+loc+enroll} style={{background#0d9488, colorwhite, textDecorationnone, padding14px 28px, borderRadius10px, fontWeight700, displayinline-block}}
                {isBn  🏆 ভেরিফিকেশন পান  🏆 Get Verified Now}
              a
            div
          div
          div style={{displayflex, justifyContentcenter}}
            div style={{width280px, backgroundwhite, borderRadius20px, padding24px, textAligncenter, color#0f172a, boxShadow0 0 60px rgba(13,148,136,0.2)}}
              div style={{width64px, height64px, backgroundlinear-gradient(135deg,#0d9488,#0369a1), borderRadius50%, displayflex, alignItemscenter, justifyContentcenter, margin0 auto 12px, fontSize1.5rem}}✅div
              div style={{fontWeight800, fontSize0.95rem, marginBottom4px}}DPP VERIFIEDdiv
              div style={{fontSize0.72rem, color#64748b, marginBottom14px}}EU ESPR Compliance Assesseddiv
              div style={{background#f0fdfa, border1px solid #99f6e4, borderRadius10px, padding10px, marginBottom14px}}
                div style={{fontWeight700, color#0d9488, fontSize1.4rem}}87100div
                div style={{fontSize0.72rem, color#64748b}}Compliance Score · Jul 2026div
              div
              div style={{fontSize0.68rem, color#94a3b8, borderTop1px solid #f1f5f9, paddingTop10px, lineHeight1.8}}
                🏭 Sample Garment Factory Ltd.br
                📅 ID DPP-2026-XXXXXbr
                🌐 Verified by DPP Atlas
              div
            div
          div
        div
      section

      { RESOURCES }
      section id=resources style={{padding80px 32px, maxWidth1200px, margin0 auto}}
        div style={{displaygrid, gridTemplateColumnsrepeat(auto-fit,minmax(300px,1fr)), gap64px}}
          div
            p style={{color#0d9488, fontSize0.8rem, fontWeight700, letterSpacing1px, marginBottom12px}}LIVE UPDATESp
            h2 style={{fontSizeclamp(1.5rem,2.5vw,2rem), fontWeight800, marginBottom28px}}
              {isBn  সর্বশেষ EU আপডেট  Latest EU Compliance Updates}
            h2
            {NEWS.map((n,i) = (
              div key={i} style={{displayflex, gap12px, paddingBottom16px, borderBottom1px solid #f1f5f9, marginBottom16px}}
                span style={{backgroundn.c+20, colorn.c, padding3px 8px, borderRadius6px, fontSize0.68rem, fontWeight700, whiteSpacenowrap, heightfit-content}}{n.tag}span
                div
                  div style={{fontWeight600, fontSize0.85rem, marginBottom3px, lineHeight1.4}}{n.t}div
                  div style={{color#94a3b8, fontSize0.72rem}}{n.d}div
                div
              div
            ))}
          div
          div
            p style={{color#0d9488, fontSize0.8rem, fontWeight700, letterSpacing1px, marginBottom12px}}WHY ACT NOWp
            h2 style={{fontSizeclamp(1.5rem,2.5vw,2rem), fontWeight800, marginBottom28px}}
              {isBn  এখনই প্রস্তুত হওয়া কেন দরকার  The Stakes for Bangladesh}
            h2
            div style={{displaygrid, gridTemplateColumns1fr 1fr, gap14px}}
              {[
                {n2027,  lEU DPP Deadline,        dAll textile exports need a DPP,          c#ef4444},
                {n$42B,  lBD Export Value at Risk, dWithout DPP compliance for EU buyers,   c#f97316},
                {n83%,   lEU is Top BD Market,     dLargest buyer market requires DPP,      c#eab308},
                {nFree,  lDPP Atlas Cost,          dZero cost to start your journey today,  c#22c55e},
              ].map((x,i) = (
                div key={i} style={{border1px solid #f1f5f9, borderRadius12px, padding16px}}
                  div style={{fontSize1.5rem, fontWeight800, colorx.c, marginBottom4px}}{x.n}div
                  div style={{fontWeight600, fontSize0.78rem, marginBottom4px}}{x.l}div
                  div style={{color#94a3b8, fontSize0.72rem, lineHeight1.4}}{x.d}div
                div
              ))}
            div
          div
        div
      section

      { CTA }
      section style={{padding96px 32px, backgroundlinear-gradient(135deg,#0f172a,#0d2a3a), colorwhite, textAligncenter}}
        div style={{maxWidth700px, margin0 auto}}
          h2 style={{fontSizeclamp(1.75rem,3vw,2.75rem), fontWeight800, marginBottom16px}}
            {isBn  আজই আপনার কারখানার EU ভবিষ্যৎ নিশ্চিত করুন  Secure Your Factory's EU Future Today}
          h2
          p style={{color#94a3b8, marginBottom36px, fontSize1rem, lineHeight1.7}}
            {isBn  ২০২৭ সালের আগে প্রস্তুত হন। বিনামূল্যে মূল্যায়ন নিন।  Get ready before 2027. Free assessment. AI report. Verification badge. No credit card.}
          p
          div style={{displayflex, gap14px, justifyContentcenter, flexWrapwrap}}
            a href={+loc+enroll} style={{background#0d9488, colorwhite, textDecorationnone, padding15px 32px, borderRadius10px, fontWeight700, fontSize1rem}}
              {isBn  🚀 বিনামূল্যে শুরু করুন  🚀 Start Free Assessment}
            a
            a href={+loc+verify} style={{border2px solid #5eead4, color#5eead4, textDecorationnone, padding13px 28px, borderRadius10px, fontWeight600, fontSize1rem}}
              {isBn  🔍 ভেরিফিকেশন চেক  🔍 Verify a Factory}
            a
          div
        div
      section

      { FOOTER }
      footer style={{padding28px 32px, borderTop1px solid #1e293b, background#0f172a}}
        div style={{maxWidth1200px, margin0 auto, displayflex, justifyContentspace-between, alignItemscenter, flexWrapwrap, gap12px}}
          div
            div style={{colorwhite, fontWeight700, marginBottom4px}}🌿 DPP Atlasdiv
            div style={{color#64748b, fontSize0.78rem}}Free Textile EU ESPR Compliance Tool · Bangladeshdiv
          div
          div style={{color#475569, fontSize0.72rem}}⚠️ Advisory tool only — not legal certificationdiv
        div
      footer
    main
  );
}
`, 'utf8');

fs.writeFileSync('app[locale]verifypage.tsx', `
use client;
import { useState } from react;

function getBand(score number) {
  if (score = 90) return {labelDPP COMPLIANT,           color#22c55e, emoji✅};
  if (score = 70) return {labelCONDITIONALLY COMPLIANT, color#eab308, emoji🟡};
  if (score = 50) return {labelDEVELOPING,              color#f97316, emoji🟠};
  return              {labelNON-COMPLIANT,             color#ef4444, emoji🔴};
}

export default function VerifyPage({ params } { params { locale string } }) {
  const isBn = params.locale === bn;
  const loc  = params.locale;
  const [id, setId]           = useState();
  const [result, setResult]   = useStateany(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const verify = () = {
    setLoading(true); setNotFound(false); setResult(null);
    setTimeout(() = {
      const data = localStorage.getItem(dpp_report_ + id);
      if (data) setResult(JSON.parse(data));
      else setNotFound(true);
      setLoading(false);
    }, 800);
  };

  return (
    main style={{minHeight100vh, background#f8fafc, fontFamilysystem-ui,sans-serif, padding24px}}
      nav style={{displayflex, justifyContentspace-between, alignItemscenter, maxWidth700px, margin0 auto 48px}}
        a href={+loc} style={{color#0d9488, fontWeight700, fontSize1.25rem, textDecorationnone}}🌿 DPP Atlasa
        a href={+loc+enroll} style={{background#0d9488, colorwhite, textDecorationnone, padding8px 16px, borderRadius10px, fontWeight600, fontSize0.875rem}}
          {isBn  নিবন্ধন করুন  Register Factory}
        a
      nav
      div style={{maxWidth600px, margin0 auto}}
        div style={{textAligncenter, marginBottom36px}}
          div style={{fontSize2.5rem, marginBottom12px}}🔍div
          h1 style={{fontSize1.75rem, fontWeight800, marginBottom10px, color#0f172a}}
            {isBn  ফ্যাক্টরি ভেরিফিকেশন চেক  Factory Verification Check}
          h1
          p style={{color#64748b, lineHeight1.7}}
            {isBn  একটি কারখানার DPP Atlas ভেরিফিকেশন স্ট্যাটাস যাচাই করুন।  Verify a factory's DPP compliance status. Enter their Report ID below.}
          p
        div
        div style={{backgroundwhite, border1px solid #e2e8f0, borderRadius14px, padding28px, marginBottom20px}}
          label style={{color#374151, fontSize0.875rem, fontWeight600, displayblock, marginBottom8px}}
            {isBn  রিপোর্ট ID লিখুন  Enter Report ID}
          label
          div style={{displayflex, gap10px}}
            input value={id} onChange={e = setId(e.target.value)}
              placeholder=e.g. 1720000000000
              style={{flex1, padding11px 14px, border1px solid #e2e8f0, borderRadius10px, fontSize0.95rem, outlinenone}}
            
            button onClick={verify} disabled={!id  loading}
              style={{padding11px 18px, backgroundid#0d9488#e2e8f0, coloridwhite#94a3b8, bordernone, borderRadius10px, fontWeight700, cursoridpointernot-allowed}}
              {loading  ...  (isBn  যাচাই  Verify)}
            button
          div
        div
        {notFound && (
          div style={{background#fef2f2, border1px solid #fecaca, borderRadius12px, padding20px, textAligncenter}}
            div style={{fontSize1.75rem, marginBottom8px}}❌div
            div style={{color#dc2626, fontWeight600}}
              {isBn  কোনো যাচাইকৃত রেকর্ড পাওয়া যায়নি।  No verified record found for this ID.}
            div
          div
        )}
        {result && (function(){
          const band = getBand(result.score);
          const fac  = result.factory  {};
          return (
            div style={{backgroundwhite, border2px solid +band.color, borderRadius14px, padding28px, textAligncenter}}
              div style={{fontSize2.5rem, marginBottom8px}}{band.emoji}div
              div style={{fontWeight800, fontSize1.1rem, colorband.color, marginBottom4px}}{band.label}div
              div style={{color#64748b, fontSize0.8rem, marginBottom20px}}Verified by DPP Atlas Platformdiv
              div style={{background#f8fafc, borderRadius10px, padding16px, marginBottom16px, textAlignleft}}
                div style={{displaygrid, gap8px, fontSize0.875rem}}
                  divstrongFactorystrong {fac.factory_name  NA}div
                  divstrongCountrystrong {fac.country  NA}div
                  divstrongScorestrong span style={{colorband.color, fontWeight700}}{result.score}100spandiv
                  divstrongDatestrong {new Date(result.created_at).toLocaleDateString()}div
                  divstrongReport IDstrong {result.id}div
                div
              div
              p style={{color#94a3b8, fontSize0.72rem, lineHeight1.6}}
                ⚠️ Based on self-reported data. Not a legal certificate. Consult accredited bodies for formal compliance.
              p
            div
          );
        })()}
      div
    main
  );
}
`, 'utf8');

console.log('OK app[locale]page.tsx');
console.log('OK app[locale]verifypage.tsx');
console.log('DONE — now run git add . && git commit -m New pro homepage && git push');