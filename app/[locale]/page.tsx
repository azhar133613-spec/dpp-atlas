export default async function LocalePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const isBn = locale === 'bn'

  return (
    <main style={{ minHeight: '100vh', background: '#0f172a', fontFamily: 'sans-serif' }}>
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '16px 32px', borderBottom: '1px solid #1e293b',
        background: '#0f172a', position: 'sticky', top: 0, zIndex: 50
      }}>
        <span style={{ color: '#14b8a6', fontWeight: 700, fontSize: '1.25rem' }}>🌿 DPP Atlas</span>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <a href={isBn ? '/en' : '/bn'} style={{
            color: '#94a3b8', fontSize: '0.8rem', textDecoration: 'none',
            padding: '6px 12px', border: '1px solid #334155', borderRadius: '8px'
          }}>
            {isBn ? '🇬🇧 English' : '🇧🇩 বাংলা'}
          </a>
          <a href={`/${locale}/login`} style={{
            color: '#94a3b8', textDecoration: 'none', fontSize: '0.875rem',
            padding: '8px 16px', border: '1px solid #334155', borderRadius: '12px'
          }}>
            {isBn ? 'লগইন' : 'Login'}
          </a>
          <a href={`/${locale}/enroll`} style={{
            background: '#0d9488', color: 'white', textDecoration: 'none',
            fontSize: '0.875rem', padding: '8px 16px', borderRadius: '12px', fontWeight: 600
          }}>
            {isBn ? 'শুরু করুন' : 'Get Started'}
          </a>
        </div>
      </nav>

      <section style={{ textAlign: 'center', padding: '80px 24px 60px', background: 'linear-gradient(135deg, #0f172a 0%, #0d1a2e 100%)' }}>
        <div style={{
          display: 'inline-block', padding: '6px 16px', marginBottom: '24px',
          background: '#0d948820', border: '1px solid #0d9488',
          borderRadius: '999px', color: '#5eead4', fontSize: '0.8rem'
        }}>
          ✓ EU ESPR 2024 · ISO 3759 · REACH · GOTS
        </div>
        <h1 style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 800, color: 'white', marginBottom: '20px', lineHeight: 1.2 }}>
          {isBn ? <>আপনার টেক্সটাইল <span style={{ color: '#14b8a6' }}>কমপ্লায়েন্স</span> পাসপোর্ট</> : <>Your Textile <span style={{ color: '#14b8a6' }}>Compliance</span> Passport</>}
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '560px', margin: '0 auto 40px', lineHeight: 1.7 }}>
          {isBn ? 'বিনামূল্যে AI-চালিত EU ESPR ডিজিটাল পণ্য পাসপোর্ট মূল্যায়ন। তাৎক্ষণিক কমপ্লায়েন্স স্কোর পান।' : 'Free AI-powered EU ESPR Digital Product Passport assessment for textile factories. Get your instant compliance score and roadmap.'}
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '60px' }}>
          <a href={`/${locale}/enroll`} style={{
            background: '#0d9488', color: 'white', textDecoration: 'none',
            padding: '16px 32px', borderRadius: '16px', fontWeight: 700, fontSize: '1.05rem', display: 'inline-block'
          }}>
            {isBn ? '🏭 কারখানা নিবন্ধন করুন' : '🏭 Register Your Factory'}
          </a>
          <a href={`/${locale}/assess`} style={{
            border: '2px solid #0d9488', color: '#5eead4', textDecoration: 'none',
            padding: '16px 32px', borderRadius: '16px', fontWeight: 600, fontSize: '1.05rem', display: 'inline-block'
          }}>
            {isBn ? '📋 মূল্যায়ন শুরু করুন' : '📋 Start Assessment'}
          </a>
        </div>
        <div style={{ display: 'flex', gap: '48px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {[{ v: '50+', l: isBn ? 'প্রশ্ন' : 'Questions' }, { v: '7', l: isBn ? 'বিভাগ' : 'Categories' }, { v: isBn ? '৳০' : '$0', l: isBn ? 'বিনামূল্যে' : 'Always Free' }].map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ color: '#14b8a6', fontSize: '2rem', fontWeight: 800 }}>{s.v}</div>
              <div style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '4px' }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '64px 24px', background: '#0f172a' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ color: 'white', fontSize: '1.75rem', fontWeight: 700, marginBottom: '48px' }}>
            {isBn ? 'কিভাবে কাজ করে' : 'How It Works'}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '32px' }}>
            {[
              { n: '1', icon: '🏭', t: isBn ? 'নিবন্ধন' : 'Register', d: isBn ? 'কারখানার তথ্য দিন' : 'Enter factory details', href: `/${locale}/enroll` },
              { n: '2', icon: '📋', t: isBn ? 'মূল্যায়ন' : 'Assess', d: isBn ? '৫০+ প্রশ্নের উত্তর দিন' : 'Answer 50+ questions', href: `/${locale}/assess` },
              { n: '3', icon: '🤖', t: isBn ? 'AI রিপোর্ট' : 'AI Report', d: isBn ? 'তাৎক্ষণিক পরামর্শ পান' : 'Get instant AI tips', href: `/${locale}/assess` },
              { n: '4', icon: '📄', t: isBn ? 'PDF ডাউনলোড' : 'Download PDF', d: isBn ? 'ক্রেতার জন্য PDF' : 'Buyer-ready PDF', href: `/${locale}/dashboard` },
            ].map((s, i) => (
              <a key={i} href={s.href} style={{ textDecoration: 'none', textAlign: 'center' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#0d9488', color: 'white', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: '1.1rem' }}>{s.n}</div>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{s.icon}</div>
                <div style={{ color: 'white', fontWeight: 600, marginBottom: '4px' }}>{s.t}</div>
                <div style={{ color: '#64748b', fontSize: '0.8rem' }}>{s.d}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '64px 24px', background: '#0f1a2e' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <h2 style={{ color: 'white', fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: '48px' }}>
            {isBn ? 'কেন DPP Atlas?' : 'Why DPP Atlas?'}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '20px' }}>
            {[
              { icon: '🤖', t: isBn ? 'AI রিপোর্ট' : 'AI Report', d: isBn ? 'Gemini AI দ্বারা পরামর্শ' : 'Powered by Google Gemini AI', href: `/${locale}/assess` },
              { icon: '📱', t: isBn ? 'QR পাসপোর্ট' : 'QR Passport', d: isBn ? 'ক্রেতারা QR স্ক্যান করে যাচাই করবেন' : 'Buyers scan QR to verify compliance', href: `/${locale}/enroll` },
              { icon: '🎤', t: isBn ? 'ভয়েস ইনপুট' : 'Voice Input', d: isBn ? 'কথা বলে ফর্ম পূরণ করুন' : 'Fill forms by speaking', href: `/${locale}/assess` },
              { icon: '📄', t: isBn ? 'PDF রিপোর্ট' : 'PDF Report', d: isBn ? 'প্রফেশনাল PDF ডাউনলোড' : 'Download professional PDF', href: `/${locale}/dashboard` },
              { icon: '🇧🇩', t: isBn ? 'বাংলা সাপোর্ট' : 'Bengali Support', d: isBn ? 'সম্পূর্ণ বাংলায় ব্যবহারযোগ্য' : 'Full Bengali language support', href: '/bn' },
              { icon: '✅', t: 'EU ESPR 2027', d: isBn ? 'EU বাধ্যবাধকতার জন্য প্রস্তুত' : 'Ready for the 2027 EU mandate', href: `/${locale}/assess` },
            ].map((f, i) => (
              <a key={i} href={f.href} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '24px', textDecoration: 'none', display: 'block' }}>
                <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{f.icon}</div>
                <div style={{ color: 'white', fontWeight: 600, marginBottom: '8px' }}>{f.t}</div>
                <div style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.6 }}>{f.d}</div>
                <div style={{ color: '#0d9488', fontSize: '0.8rem', marginTop: '12px' }}>{isBn ? 'শুরু করুন →' : 'Get started →'}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 24px', textAlign: 'center', background: '#0f172a' }}>
        <h2 style={{ color: 'white', fontSize: '2rem', fontWeight: 700, marginBottom: '16px' }}>
          {isBn ? 'আজই শুরু করুন — বিনামূল্যে' : "Start Today — It's Free"}
        </h2>
        <p style={{ color: '#94a3b8', marginBottom: '32px' }}>{isBn ? 'কোনো ক্রেডিট কার্ড দরকার নেই।' : 'No credit card required. No hidden fees.'}</p>
        <a href={`/${locale}/enroll`} style={{ background: '#0d9488', color: 'white', textDecoration: 'none', padding: '18px 48px', borderRadius: '16px', fontWeight: 700, fontSize: '1.1rem', display: 'inline-block' }}>
          {isBn ? '🚀 বিনামূল্যে শুরু করুন' : '🚀 Start Free Assessment'}
        </a>
      </section>

      <footer style={{ padding: '24px', textAlign: 'center', borderTop: '1px solid #1e293b', color: '#475569', fontSize: '0.8rem' }}>
        DPP Atlas · {isBn ? 'বিনামূল্যে টেক্সটাইল EU কমপ্লায়েন্স টুল' : 'Free Textile EU Compliance Tool'} · 2024
      </footer>
    </main>
  )
}