const fs = require('fs');
const p = process.argv[2] || 'app/[locale]/assess/page.tsx';
let c = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');
const before = c.length;

// STEP 1: drop any dead/orphaned code before the real "use client" directive
const uci = c.indexOf('"use client";');
if (uci < 0) throw new Error('Could not find "use client"; directive — aborting, file may not match expected structure.');
if (uci > 0) {
  console.log('Removed ' + uci + ' bytes of orphaned dead code before "use client"');
  c = c.slice(uci);
}

// STEP 2: replace the single fixed QS array + calcScore with per-type FACTORY_QUESTIONS
const qsRe = /const QS = \[[\s\S]*?return Math\.min\(100, Math\.round\(\(t \/ 100\) \* 100\)\);\n\}\n/;
if (!qsRe.test(c)) throw new Error('Could not find the QS array / calcScore block — aborting, file may already be patched or structure changed.');

const NEW_QUESTIONS = `type Opt = { l: string; lBn: string; v: string; s: number };
type Q = { id: number; cat: number; q: string; qBn: string; opts: Opt[]; info?: boolean };

const FTYPE_NAMES: Record<string, { name: string; nameBn: string; icon: string }> = {
  rmd:   { name: "RMG / Garment Manufacturing", nameBn: "RMG / গার্মেন্টস উৎপাদন",     icon: "👕" },
  knit:  { name: "Knitwear Manufacturing",      nameBn: "নিটওয়্যার উৎপাদন",             icon: "🧶" },
  denim: { name: "Denim Manufacturing",         nameBn: "ডেনিম উৎপাদন",                icon: "👖" },
  spin:  { name: "Spinning / Yarn Production",  nameBn: "স্পিনিং / সুতা উৎপাদন",        icon: "🌀" },
  dye:   { name: "Dyeing & Finishing",          nameBn: "রং ও ফিনিশিং",                icon: "🎨" },
  sweat: { name: "Sweater / Woolen Products",   nameBn: "সোয়েটার / উলেন পণ্য",          icon: "🧣" },
  home:  { name: "Home Textiles",               nameBn: "হোম টেক্সটাইল",               icon: "🛏️" },
  acc:   { name: "Accessories & Trim",          nameBn: "আনুষাঙ্গিক ও ট্রিম",           icon: "🔗" },
};

const CAT1_IDENTITY: Q[] = [
  {id:1,  cat:1, q:"Does your factory have a GS1 Global Location Number (GLN)?",                qBn:"আপনার কারখানার কি GS1 GLN নম্বর আছে?",
    opts:[{l:"Yes",lBn:"হ্যাঁ",v:"y",s:5},{l:"In Progress",lBn:"প্রক্রিয়াধীন",v:"p",s:2},{l:"No",lBn:"না",v:"n",s:0}]},
  {id:2,  cat:1, q:"Is your factory registered under an official textile regulatory authority?",  qBn:"আপনার কারখানা কি সরকারি কর্তৃপক্ষে নিবন্ধিত?",
    opts:[{l:"Yes",lBn:"হ্যাঁ",v:"y",s:5},{l:"No",lBn:"না",v:"n",s:0}]},
  {id:3,  cat:1, q:"What is your Supply Chain Tier Level? (Informational only)",                 qBn:"আপনার সাপ্লাই চেইন স্তর কী? (তথ্যমূলক)",
    opts:[{l:"Tier 1 - Garment",lBn:"Tier 1",v:"t1",s:0},{l:"Tier 2 - Fabric",lBn:"Tier 2",v:"t2",s:0},{l:"Tier 3 - Yarn",lBn:"Tier 3",v:"t3",s:0},{l:"Tier 4 - Raw Fiber",lBn:"Tier 4",v:"t4",s:0}], info:true},
  {id:4,  cat:1, q:"Does your factory have a verified tax identification number (TIN/BIN)?",    qBn:"আপনার কারখানার কি যাচাইকৃত TIN/BIN আছে?",
    opts:[{l:"Yes",lBn:"হ্যাঁ",v:"y",s:5},{l:"No",lBn:"না",v:"n",s:0}]},
  {id:5,  cat:1, q:"Is your factory location verified on an official business registry?",        qBn:"কারখানার অবস্থান কি সরকারি রেজিস্ট্রিতে যাচাইকৃত?",
    opts:[{l:"Yes",lBn:"হ্যাঁ",v:"y",s:5},{l:"No",lBn:"না",v:"n",s:0}]},
];

const CAT3_CHEMICAL: Q[] = [
  {id:10, cat:3, q:"Has your facility completed a REACH chemical compliance audit?",            qBn:"আপনার কারখানা কি REACH অডিট সম্পন্ন করেছে?",
    opts:[{l:"Yes, documented",lBn:"হ্যাঁ",v:"y",s:7},{l:"In progress",lBn:"প্রক্রিয়াধীন",v:"p",s:3},{l:"No",lBn:"না",v:"n",s:0}]},
  {id:11, cat:3, q:"Are SVHC substances logged and disclosed in material data sheets?",         qBn:"SVHC পদার্থ কি লগ ও প্রকাশ করা হয়েছে?",
    opts:[{l:"Fully disclosed",lBn:"সম্পূর্ণ",v:"y",s:7},{l:"Partial",lBn:"আংশিক",v:"p",s:3},{l:"No",lBn:"না",v:"n",s:0}]},
  {id:12, cat:3, q:"Do your material processes meet RoHS chemical restriction requirements?",   qBn:"আপনার প্রক্রিয়া কি RoHS নিষেধাজ্ঞা পূরণ করে?",
    opts:[{l:"Yes, verified",lBn:"হ্যাঁ",v:"y",s:6},{l:"Unverified",lBn:"অযাচাইকৃত",v:"p",s:2},{l:"No",lBn:"না",v:"n",s:0}]},
];

const CAT5_CIRCULARITY: Q[] = [
  {id:16, cat:5, q:"Does your product include end-of-life recycling instructions?",             qBn:"পণ্যে কি পুনর্ব্যবহারের নির্দেশনা আছে?",
    opts:[{l:"Yes",lBn:"হ্যাঁ",v:"y",s:5},{l:"Partial",lBn:"আংশিক",v:"p",s:2},{l:"No",lBn:"না",v:"n",s:0}]},
  {id:17, cat:5, q:"Have you calculated the carbon footprint per kg of output?",     qBn:"প্রতি কেজি কার্বন ফুটপ্রিন্ট কি হিসাব করা হয়েছে?",
    opts:[{l:"Yes, documented",lBn:"হ্যাঁ",v:"y",s:5},{l:"Estimate only",lBn:"আনুমানিক",v:"p",s:2},{l:"No",lBn:"না",v:"n",s:0}]},
  {id:18, cat:5, q:"Does your facility have a water consumption reduction program?",            qBn:"পানি সংরক্ষণ কর্মসূচি কি আছে?",
    opts:[{l:"Yes, documented",lBn:"হ্যাঁ",v:"y",s:5},{l:"Informal only",lBn:"অনানুষ্ঠানিক",v:"p",s:2},{l:"No",lBn:"না",v:"n",s:0}]},
];

function buildQS(cat2: Q[], cat4: Q[]): Q[] {
  return [...CAT1_IDENTITY, ...cat2, ...CAT3_CHEMICAL, ...cat4, ...CAT5_CIRCULARITY];
}

const CAT2_FIBER_BASE: Q[] = [
  {id:6,  cat:2, q:"Can you provide exact fiber blend percentages totaling 100%?",              qBn:"আপনি কি সঠিক ফাইবার মিশ্রণ (মোট ১০০%) দিতে পারেন?",
    opts:[{l:"Yes, verified",lBn:"হ্যাঁ, যাচাইকৃত",v:"y",s:8},{l:"Approximate",lBn:"আনুমানিক",v:"p",s:3},{l:"No",lBn:"না",v:"n",s:0}]},
  {id:7,  cat:2, q:"Are all fiber sources traceable to their country of origin?",               qBn:"সব ফাইবার উৎস কি উৎপত্তি দেশে ট্রেস করা যায়?",
    opts:[{l:"Fully traced",lBn:"সম্পূর্ণ",v:"y",s:7},{l:"Partially",lBn:"আংশিক",v:"p",s:3},{l:"Not traced",lBn:"না",v:"n",s:0}]},
  {id:8,  cat:2, q:"Do you hold a valid GOTS certification?",                                   qBn:"আপনার কি বৈধ GOTS সার্টিফিকেট আছে?",
    opts:[{l:"Yes, current",lBn:"হ্যাঁ",v:"y",s:5},{l:"Expired",lBn:"মেয়াদোত্তীর্ণ",v:"p",s:2},{l:"No",lBn:"না",v:"n",s:0}]},
  {id:9,  cat:2, q:"Do you hold a valid OEKO-TEX certification?",                               qBn:"আপনার কি বৈধ OEKO-TEX সার্টিফিকেট আছে?",
    opts:[{l:"Yes, current",lBn:"হ্যাঁ",v:"y",s:5},{l:"Expired",lBn:"মেয়াদোত্তীর্ণ",v:"p",s:2},{l:"No",lBn:"না",v:"n",s:0}]},
];

const CAT2_DYE: Q[] = [
  {id:6,  cat:2, q:"Can you provide the exact fiber composition of the substrate you dye/finish, totaling 100%?", qBn:"যে কাপড় রং করেন তার ফাইবার গঠন (মোট ১০০%) কি জানাতে পারেন?",
    opts:[{l:"Yes, verified",lBn:"হ্যাঁ, যাচাইকৃত",v:"y",s:8},{l:"Approximate",lBn:"আনুমানিক",v:"p",s:3},{l:"No",lBn:"না",v:"n",s:0}]},
  {id:7,  cat:2, q:"Are your dye and chemical formulations traceable to their supplier/origin?", qBn:"রং ও রাসায়নিক উপাদানের উৎস কি ট্রেসযোগ্য?",
    opts:[{l:"Fully traced",lBn:"সম্পূর্ণ",v:"y",s:7},{l:"Partially",lBn:"আংশিক",v:"p",s:3},{l:"Not traced",lBn:"না",v:"n",s:0}]},
  {id:8,  cat:2, q:"Do you hold a valid GOTS certification for your dyeing/finishing process?", qBn:"রং/ফিনিশিং প্রক্রিয়ার জন্য বৈধ GOTS সার্টিফিকেট আছে কি?",
    opts:[{l:"Yes, current",lBn:"হ্যাঁ",v:"y",s:5},{l:"Expired",lBn:"মেয়াদোত্তীর্ণ",v:"p",s:2},{l:"No",lBn:"না",v:"n",s:0}]},
  {id:9,  cat:2, q:"Do you hold a valid OEKO-TEX certification for the finished dyed fabric?", qBn:"সমাপ্ত রঙিন কাপড়ের জন্য বৈধ OEKO-TEX সার্টিফিকেট আছে কি?",
    opts:[{l:"Yes, current",lBn:"হ্যাঁ",v:"y",s:5},{l:"Expired",lBn:"মেয়াদোত্তীর্ণ",v:"p",s:2},{l:"No",lBn:"না",v:"n",s:0}]},
];

const CAT2_ACC: Q[] = [
  {id:6,  cat:2, q:"Can you fully disclose the material composition of each component (metal/plastic/fabric), totaling 100%?", qBn:"প্রতিটি অংশের (ধাতু/প্লাস্টিক/কাপড়) গঠন (মোট ১০০%) কি প্রকাশ করতে পারেন?",
    opts:[{l:"Yes, verified",lBn:"হ্যাঁ, যাচাইকৃত",v:"y",s:8},{l:"Approximate",lBn:"আনুমানিক",v:"p",s:3},{l:"No",lBn:"না",v:"n",s:0}]},
  {id:7,  cat:2, q:"Are all component materials traceable to their source supplier?", qBn:"সব উপাদান কি উৎস সরবরাহকারী পর্যন্ত ট্রেসযোগ্য?",
    opts:[{l:"Fully traced",lBn:"সম্পূর্ণ",v:"y",s:7},{l:"Partially",lBn:"আংশিক",v:"p",s:3},{l:"Not traced",lBn:"না",v:"n",s:0}]},
  {id:8,  cat:2, q:"For fabric-based trims/labels, do you hold a valid GOTS certification?", qBn:"কাপড়-ভিত্তিক ট্রিম/লেবেলের জন্য বৈধ GOTS সার্টিফিকেট আছে কি?",
    opts:[{l:"Yes, current",lBn:"হ্যাঁ",v:"y",s:5},{l:"N/A or expired",lBn:"প্রযোজ্য নয়/মেয়াদোত্তীর্ণ",v:"p",s:2},{l:"No",lBn:"না",v:"n",s:0}]},
  {id:9,  cat:2, q:"Do you hold a valid OEKO-TEX certification for your trims/labels?", qBn:"ট্রিম/লেবেলের জন্য বৈধ OEKO-TEX সার্টিফিকেট আছে কি?",
    opts:[{l:"Yes, current",lBn:"হ্যাঁ",v:"y",s:5},{l:"Expired",lBn:"মেয়াদোত্তীর্ণ",v:"p",s:2},{l:"No",lBn:"না",v:"n",s:0}]},
];

const CAT4_RMD: Q[] = [
  {id:13, cat:4, q:"Has your fabric passed ISO 3759 dimensional stability (shrinkage) testing?",            qBn:"আপনার কাপড় কি ISO 3759 সংকোচন পরীক্ষায় উত্তীর্ণ?",
    opts:[{l:"Passed",lBn:"উত্তীর্ণ",v:"y",s:7},{l:"Failed",lBn:"অনুত্তীর্ণ",v:"n",s:0},{l:"Not tested",lBn:"হয়নি",v:"x",s:0}]},
  {id:14, cat:4, q:"Have you completed ISO 16322-3 spirality (twisting) testing?",                         qBn:"ISO 16322-3 স্পাইরালিটি পরীক্ষা কি হয়েছে?",
    opts:[{l:"Passed",lBn:"উত্তীর্ণ",v:"y",s:7},{l:"Failed",lBn:"অনুত্তীর্ণ",v:"n",s:0},{l:"Not tested",lBn:"হয়নি",v:"x",s:0}]},
  {id:15, cat:4, q:"Has ISO 15487 visual inspection testing been conducted?",                   qBn:"ISO 15487 ভিজ্যুয়াল পরীক্ষা কি হয়েছে?",
    opts:[{l:"Passed",lBn:"উত্তীর্ণ",v:"y",s:6},{l:"Failed",lBn:"অনুত্তীর্ণ",v:"n",s:0},{l:"Not conducted",lBn:"হয়নি",v:"x",s:0}]},
];

const CAT4_KNIT: Q[] = [
  {id:13, cat:4, q:"Has your knit fabric passed ISO 3759 dimensional stability (shrinkage) testing?", qBn:"আপনার নিট কাপড় কি ISO 3759 সংকোচন পরীক্ষায় উত্তীর্ণ?",
    opts:[{l:"Passed",lBn:"উত্তীর্ণ",v:"y",s:7},{l:"Failed",lBn:"অনুত্তীর্ণ",v:"n",s:0},{l:"Not tested",lBn:"হয়নি",v:"x",s:0}]},
  {id:14, cat:4, q:"Have you completed ISO 16322-3 spirality testing? (Critical for knit loop structures)", qBn:"ISO 16322-3 স্পাইরালিটি পরীক্ষা কি হয়েছে? (নিট কাপড়ের জন্য গুরুত্বপূর্ণ)",
    opts:[{l:"Passed",lBn:"উত্তীর্ণ",v:"y",s:7},{l:"Failed",lBn:"অনুত্তীর্ণ",v:"n",s:0},{l:"Not tested",lBn:"হয়নি",v:"x",s:0}]},
  {id:15, cat:4, q:"Has pilling resistance testing (ISO 12945 series) been conducted?", qBn:"পিলিং রেজিস্ট্যান্স পরীক্ষা (ISO 12945) কি হয়েছে?",
    opts:[{l:"Passed",lBn:"উত্তীর্ণ",v:"y",s:6},{l:"Failed",lBn:"অনুত্তীর্ণ",v:"n",s:0},{l:"Not conducted",lBn:"হয়নি",v:"x",s:0}]},
];

const CAT4_DENIM: Q[] = [
  {id:13, cat:4, q:"Has your denim passed ISO 3759 dimensional stability testing after wash treatment?", qBn:"ধোয়ার পর ISO 3759 সংকোচন পরীক্ষায় উত্তীর্ণ কি?",
    opts:[{l:"Passed",lBn:"উত্তীর্ণ",v:"y",s:7},{l:"Failed",lBn:"অনুত্তীর্ণ",v:"n",s:0},{l:"Not tested",lBn:"হয়নি",v:"x",s:0}]},
  {id:14, cat:4, q:"Has colour fastness to rubbing/crocking (ISO 105-X12) been tested? (Common indigo rub-off issue)", qBn:"ঘষায় রং স্থিরতা (ISO 105-X12) পরীক্ষা হয়েছে কি?",
    opts:[{l:"Passed",lBn:"উত্তীর্ণ",v:"y",s:7},{l:"Failed",lBn:"অনুত্তীর্ণ",v:"n",s:0},{l:"Not tested",lBn:"হয়নি",v:"x",s:0}]},
  {id:15, cat:4, q:"Has tear/abrasion strength testing been conducted after wash finishing?", qBn:"ধোয়া ফিনিশিংয়ের পর ছিঁড়ে যাওয়া/ঘর্ষণ শক্তি পরীক্ষা হয়েছে কি?",
    opts:[{l:"Passed",lBn:"উত্তীর্ণ",v:"y",s:6},{l:"Failed",lBn:"অনুত্তীর্ণ",v:"n",s:0},{l:"Not conducted",lBn:"হয়নি",v:"x",s:0}]},
];

const CAT4_SPIN: Q[] = [
  {id:13, cat:4, q:"Has your yarn count (tex/Ne) consistency been tested?", qBn:"সুতার কাউন্ট (tex/Ne) সামঞ্জস্য পরীক্ষা হয়েছে কি?",
    opts:[{l:"Passed",lBn:"উত্তীর্ণ",v:"y",s:7},{l:"Failed",lBn:"অনুত্তীর্ণ",v:"n",s:0},{l:"Not tested",lBn:"হয়নি",v:"x",s:0}]},
  {id:14, cat:4, q:"Has yarn tensile strength/tenacity been tested?", qBn:"সুতার শক্তি/টেনাসিটি পরীক্ষা হয়েছে কি?",
    opts:[{l:"Passed",lBn:"উত্তীর্ণ",v:"y",s:7},{l:"Failed",lBn:"অনুত্তীর্ণ",v:"n",s:0},{l:"Not tested",lBn:"হয়নি",v:"x",s:0}]},
  {id:15, cat:4, q:"Has yarn evenness (uniformity) testing been conducted?", qBn:"সুতার সমতা (uniformity) পরীক্ষা হয়েছে কি?",
    opts:[{l:"Passed",lBn:"উত্তীর্ণ",v:"y",s:6},{l:"Failed",lBn:"অনুত্তীর্ণ",v:"n",s:0},{l:"Not conducted",lBn:"হয়নি",v:"x",s:0}]},
];

const CAT4_DYE: Q[] = [
  {id:13, cat:4, q:"Has colour fastness to washing (ISO 105-C series) been tested?", qBn:"ধোয়ায় রং স্থিরতা (ISO 105-C) পরীক্ষা হয়েছে কি?",
    opts:[{l:"Passed",lBn:"উত্তীর্ণ",v:"y",s:7},{l:"Failed",lBn:"অনুত্তীর্ণ",v:"n",s:0},{l:"Not tested",lBn:"হয়নি",v:"x",s:0}]},
  {id:14, cat:4, q:"Has colour fastness to light (ISO 105-B series) been tested?", qBn:"আলোতে রং স্থিরতা (ISO 105-B) পরীক্ষা হয়েছে কি?",
    opts:[{l:"Passed",lBn:"উত্তীর্ণ",v:"y",s:7},{l:"Failed",lBn:"অনুত্তীর্ণ",v:"n",s:0},{l:"Not tested",lBn:"হয়নি",v:"x",s:0}]},
  {id:15, cat:4, q:"Do you have Effluent Treatment Plant (ETP) compliance documentation?", qBn:"ETP (বর্জ্য পরিশোধন প্ল্যান্ট) সম্মতি নথি কি আছে?",
    opts:[{l:"Yes, documented",lBn:"হ্যাঁ",v:"y",s:6},{l:"In progress",lBn:"প্রক্রিয়াধীন",v:"p",s:2},{l:"No",lBn:"না",v:"n",s:0}]},
];

const CAT4_SWEAT: Q[] = [
  {id:13, cat:4, q:"Has your fabric passed ISO 3759 dimensional stability (shrinkage) testing?", qBn:"আপনার কাপড় কি ISO 3759 সংকোচন পরীক্ষায় উত্তীর্ণ?",
    opts:[{l:"Passed",lBn:"উত্তীর্ণ",v:"y",s:7},{l:"Failed",lBn:"অনুত্তীর্ণ",v:"n",s:0},{l:"Not tested",lBn:"হয়নি",v:"x",s:0}]},
  {id:14, cat:4, q:"Has pilling resistance testing (ISO 12945 series) been conducted?", qBn:"পিলিং রেজিস্ট্যান্স পরীক্ষা (ISO 12945) কি হয়েছে?",
    opts:[{l:"Passed",lBn:"উত্তীর্ণ",v:"y",s:7},{l:"Failed",lBn:"অনুত্তীর্ণ",v:"n",s:0},{l:"Not tested",lBn:"হয়নি",v:"x",s:0}]},
  {id:15, cat:4, q:"Has colour fastness testing (ISO 105 series) been conducted?", qBn:"রং স্থিরতা পরীক্ষা (ISO 105) কি হয়েছে?",
    opts:[{l:"Passed",lBn:"উত্তীর্ণ",v:"y",s:6},{l:"Failed",lBn:"অনুত্তীর্ণ",v:"n",s:0},{l:"Not conducted",lBn:"হয়নি",v:"x",s:0}]},
];

const CAT4_HOME: Q[] = [
  {id:13, cat:4, q:"Has your fabric passed ISO 3759 dimensional stability (shrinkage) testing?", qBn:"আপনার কাপড় কি ISO 3759 সংকোচন পরীক্ষায় উত্তীর্ণ?",
    opts:[{l:"Passed",lBn:"উত্তীর্ণ",v:"y",s:7},{l:"Failed",lBn:"অনুত্তীর্ণ",v:"n",s:0},{l:"Not tested",lBn:"হয়নি",v:"x",s:0}]},
  {id:14, cat:4, q:"Has colour fastness to washing (ISO 105 series) been tested?", qBn:"ধোয়ায় রং স্থিরতা (ISO 105) পরীক্ষা হয়েছে কি?",
    opts:[{l:"Passed",lBn:"উত্তীর্ণ",v:"y",s:7},{l:"Failed",lBn:"অনুত্তীর্ণ",v:"n",s:0},{l:"Not tested",lBn:"হয়নি",v:"x",s:0}]},
  {id:15, cat:4, q:"Has fire safety / flammability compliance for your target market been verified?", qBn:"আপনার লক্ষ্য বাজারের অগ্নি নিরাপত্তা মান কি যাচাই করা হয়েছে?",
    opts:[{l:"Verified",lBn:"যাচাইকৃত",v:"y",s:6},{l:"Unverified",lBn:"অযাচাইকৃত",v:"p",s:2},{l:"Not conducted",lBn:"হয়নি",v:"x",s:0}]},
];

const CAT4_ACC: Q[] = [
  {id:13, cat:4, q:"Has nickel release testing been conducted per REACH Annex XVII, entry 27?", qBn:"REACH Annex XVII অনুযায়ী নিকেল রিলিজ পরীক্ষা হয়েছে কি?",
    opts:[{l:"Passed",lBn:"উত্তীর্ণ",v:"y",s:7},{l:"Failed",lBn:"অনুত্তীর্ণ",v:"n",s:0},{l:"Not tested",lBn:"হয়নি",v:"x",s:0}]},
  {id:14, cat:4, q:"Has heavy metal content (lead & cadmium) testing been conducted?", qBn:"সীসা ও ক্যাডমিয়াম পরীক্ষা হয়েছে কি?",
    opts:[{l:"Passed",lBn:"উত্তীর্ণ",v:"y",s:7},{l:"Failed",lBn:"অনুত্তীর্ণ",v:"n",s:0},{l:"Not tested",lBn:"হয়নি",v:"x",s:0}]},
  {id:15, cat:4, q:"Has mechanical strength/pull-test been conducted for small attached parts?", qBn:"ছোট অংশের জন্য যান্ত্রিক শক্তি/পুল-টেস্ট হয়েছে কি?",
    opts:[{l:"Passed",lBn:"উত্তীর্ণ",v:"y",s:6},{l:"Failed",lBn:"অনুত্তীর্ণ",v:"n",s:0},{l:"Not conducted",lBn:"হয়নি",v:"x",s:0}]},
];

const FACTORY_QUESTIONS: Record<string, Q[]> = {
  rmd:   buildQS(CAT2_FIBER_BASE, CAT4_RMD),
  knit:  buildQS(CAT2_FIBER_BASE, CAT4_KNIT),
  denim: buildQS(CAT2_FIBER_BASE, CAT4_DENIM),
  spin:  buildQS(CAT2_FIBER_BASE, CAT4_SPIN),
  dye:   buildQS(CAT2_DYE, CAT4_DYE),
  sweat: buildQS(CAT2_FIBER_BASE, CAT4_SWEAT),
  home:  buildQS(CAT2_FIBER_BASE, CAT4_HOME),
  acc:   buildQS(CAT2_ACC, CAT4_ACC),
};

function calcScore(qs: Q[], ans: Record<number,string>): number {
  let t = 0;
  qs.forEach(q => { const o = q.opts.find(x => x.v === ans[q.id]); if(o) t += o.s; });
  return Math.min(100, Math.round((t / 100) * 100));
}
`;

c = c.replace(qsRe, NEW_QUESTIONS);

// STEP 3: add factoryType state + resolution effect, right after the existing voiceOK effect
const anchor3 = '  useEffect(() => {\n    setVoiceOK(typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window));\n  }, []);\n';
if (!c.includes(anchor3)) throw new Error('Could not find voiceOK useEffect anchor — aborting.');
const insertAfter = anchor3 + `
  const [factoryType, setFactoryType] = useState("rmd");
  useEffect(() => {
    if (typeof window === "undefined") return;
    const urlType = new URLSearchParams(window.location.search).get("type");
    if (urlType && FACTORY_QUESTIONS[urlType]) { setFactoryType(urlType); return; }
    try {
      const saved = JSON.parse(localStorage.getItem("dpp_factory") || "{}") as Record<string,string>;
      if (saved.factory_type && FACTORY_QUESTIONS[saved.factory_type]) setFactoryType(saved.factory_type);
    } catch {}
  }, []);
  const QS = FACTORY_QUESTIONS[factoryType] || FACTORY_QUESTIONS.rmd;
  const typeInfo = FTYPE_NAMES[factoryType] || FTYPE_NAMES.rmd;
`;
c = c.replace(anchor3, insertAfter);

// STEP 4: fix calcScore call site to pass QS explicitly
const scoreAnchor = 'const score    = calcScore(answers);';
if (!c.includes(scoreAnchor)) throw new Error('Could not find calcScore call site — aborting.');
c = c.replace(scoreAnchor, 'const score    = calcScore(QS, answers);');

// STEP 5: make the intro screen show the factory type + correct dynamic question count
const introAnchor = `{isBn?"৫টি বিভাগে ১৮টি প্রশ্ন। সততার সাথে উত্তর দিন।":"18 questions across 5 categories. Answer honestly for an accurate result."}
        </p>`;
if (c.includes(introAnchor)) {
  const introReplacement = `{isBn?\`৫টি বিভাগে \${QS.length}টি প্রশ্ন। সততার সাথে উত্তর দিন।\`:\`\${QS.length} questions across 5 categories, tailored to your factory type.\`}
        </p>
        <div style={{display:"inline-flex",alignItems:"center",gap:"8px",background:"#f0fdfa",border:"1px solid #99f6e4",borderRadius:"999px",padding:"6px 16px",marginBottom:"16px",fontSize:"0.82rem",color:"#0f766e",fontWeight:600}}>
          {typeInfo.icon} {isBn?"কাস্টমাইজড: ":"Customized for: "}{isBn?typeInfo.nameBn:typeInfo.name}
        </div>`;
  c = c.replace(introAnchor, introReplacement);
  console.log('Added factory-type badge to intro screen');
} else {
  console.log('NOTE: intro text anchor not found exactly — skipped cosmetic badge (question logic patch still applied)');
}

fs.writeFileSync(p, c, 'utf8');
console.log('');
console.log('Patched ' + p + ': ' + before + ' -> ' + c.length + ' bytes');
console.log('DONE.');