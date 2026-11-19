"use client";
import { useState, useEffect, useRef, useCallback } from "react";

const CATS = [
  {id:1, name:"Factory Identity & Registration",     nameBn:"কারখানা পরিচয়",           max:20},
  {id:2, name:"Material Composition & Traceability", nameBn:"উপকরণ গঠন",               max:25},
  {id:3, name:"Chemical Compliance",                 nameBn:"রাসায়নিক সম্মতি",          max:20},
  {id:4, name:"Physical Testing & Durability",       nameBn:"শারীরিক পরীক্ষা",           max:20},
  {id:5, name:"Circularity & Sustainability",        nameBn:"পুনর্ব্যবহার ও টেকসইতা",    max:15},
];

type Opt = { l: string; lBn: string; v: string; s: number };
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

export default function AssessPage({ params }: { params: { locale: string } }) {
  const isBn = params.locale === "bn";
  const loc  = params.locale;

  const [step,       setStep]      = useState(0);
  const [answers,    setAnswers]   = useState<Record<number,string>>({});
  const [submitting, setSubmit]    = useState(false);
  const [notes,      setNotes]     = useState<Record<number,string>>({});
  const [activeQ,    setActiveQ]   = useState<number | null>(null);
  const [listening,  setListening] = useState(false);
  const [voiceOK,    setVoiceOK]   = useState(false);
  const srRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    setVoiceOK(typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window));
  }, []);

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

  const stopVoice = useCallback(() => {
    srRef.current?.stop();
    setListening(false);
    setActiveQ(null);
  }, []);

  const startVoice = useCallback((qId: number) => {
    if (typeof window === "undefined") return;
    const SR = (window as unknown as {SpeechRecognition?: {new():SpeechRecognition}; webkitSpeechRecognition?: {new():SpeechRecognition}}).SpeechRecognition
            || (window as unknown as {SpeechRecognition?: {new():SpeechRecognition}; webkitSpeechRecognition?: {new():SpeechRecognition}}).webkitSpeechRecognition;
    if (!SR) return;
    const r = new SR();
    r.lang = isBn ? "bn-BD" : "en-US";
    r.continuous = false;
    r.interimResults = false;
    r.onstart  = () => { setListening(true); setActiveQ(qId); };
    r.onend    = () => { setListening(false); };
    r.onerror  = () => { setListening(false); };
    r.onresult = (e: SpeechRecognitionEvent) => {
      const txt = e.results[0][0].transcript;
      setNotes(prev => ({...prev, [qId]: txt}));
    };
    r.start();
    srRef.current = r;
  }, [isBn]);

  const handleSubmit = useCallback(() => {
    setSubmit(true);
    const score    = calcScore(QS, answers);
    const rid      = Date.now().toString();
    const factory  = JSON.parse(localStorage.getItem("dpp_factory") || '{"factory_name":"My Factory","country":"Bangladesh"}') as Record<string,string>;
    const failIds  = QS.filter(q => !q.info && answers[q.id] !== undefined && q.opts.find(o => o.v === answers[q.id])?.s === 0).map(q => q.id);
    const report   = {
      id:rid, score,
      band: score>=90?"✅ SELF-REPORTED: STRONG":score>=70?"🟡 SELF-REPORTED: MINOR GAPS":score>=50?"🟠 DEVELOPING":"🔴 SELF-REPORTED: MAJOR GAPS",
      answers, factory, failed_ids:failIds, voice_notes:notes,
      created_at: new Date().toISOString()
    };
    localStorage.setItem("dpp_report_"+rid, JSON.stringify(report));
    localStorage.setItem("dpp_latest_report", rid);
    setTimeout(() => { window.location.href = "/"+loc+"/report/"+rid; }, 600);
  }, [answers, notes, loc]);

  const cat   = CATS[step - 1];
  const catQs = QS.filter(q => q.cat === step);
  const done  = catQs.every(q => q.info || answers[q.id] !== undefined);
  const pct   = step === 0 ? 0 : Math.round(step / CATS.length * 100);

  if (step === 0) return (
    <main style={{minHeight:"100vh",background:"#f8fafc",fontFamily:"system-ui,sans-serif",padding:"24px",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{maxWidth:"680px",width:"100%",textAlign:"center"}}>
        <div style={{fontSize:"3rem",marginBottom:"16px"}}>📋</div>
        <div style={{background:"#fef3c7",border:"1px solid #fbbf24",borderRadius:"10px",padding:"12px 16px",marginBottom:"16px",fontSize:"0.85rem",color:"#92400e",textAlign:"left"}}>{isBn ? "পুরনো স্কোরভিত্তিক চেক। ০–১০০ স্কোরের কোনো অফিসিয়াল ভিত্তি নেই এবং এটি কমপ্লায়েন্স ফলাফল নয়। বর্তমান পদ্ধতির জন্য ডেটা চেক ব্যবহার করুন।" : "Old scored self-check. The 0–100 score has no official basis and is not a compliance result. For the current method, use the Data Check."}{" "}<a href={"/"+loc+"/check"} style={{color:"#0d9488",fontWeight:700}}>{isBn ? "ডেটা চেক →" : "Data Check →"}</a></div>
        <h1 style={{fontSize:"2rem",fontWeight:800,marginBottom:"12px",color:"#0f172a"}}>
          {isBn?"স্কোরভিত্তিক স্ব-চেক (পুরনো)":"Scored Self-Check (old)"}
        </h1>
        <p style={{color:"#64748b",lineHeight:1.7,marginBottom:"20px",maxWidth:"520px",margin:"0 auto 20px"}}>
          {isBn?`৫টি বিভাগে ${QS.length}টি প্রশ্ন। সততার সাথে উত্তর দিন।`:`${QS.length} questions across 5 categories, tailored to your factory type.`}
        </p>
        <div style={{display:"inline-flex",alignItems:"center",gap:"8px",background:"#f0fdfa",border:"1px solid #99f6e4",borderRadius:"999px",padding:"6px 16px",marginBottom:"16px",fontSize:"0.82rem",color:"#0f766e",fontWeight:600}}>
          {typeInfo.icon} {isBn?"কাস্টমাইজড: ":"Customized for: "}{isBn?typeInfo.nameBn:typeInfo.name}
        </div>
        <div style={{background:voiceOK?"#f0fdfa":"#fef3c7",border:"1px solid "+(voiceOK?"#99f6e4":"#fbbf24"),borderRadius:"10px",padding:"10px 16px",marginBottom:"20px",fontSize:"0.82rem",color:voiceOK?"#0f766e":"#92400e",display:"inline-flex",gap:"8px",alignItems:"center"}}>
          🎤 {voiceOK
            ? (isBn?"ভয়েস ইনপুট চালু — প্রতিটি প্রশ্নে মাইক বাটন ব্যবহার করুন":"Voice input enabled — tap mic on each question")
            : (isBn?"ভয়েসের জন্য Chrome বা Edge ব্যবহার করুন":"Voice input requires Chrome or Edge")}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:"12px",marginBottom:"32px"}}>
          {CATS.map(c => (
            <div key={c.id} style={{background:"white",border:"1px solid #e2e8f0",borderRadius:"10px",padding:"14px",textAlign:"left"}}>
              <div style={{color:"#0d9488",fontWeight:700,fontSize:"0.72rem",marginBottom:"4px"}}>CAT {c.id}</div>
              <div style={{fontWeight:600,fontSize:"0.78rem",color:"#0f172a",marginBottom:"4px"}}>{isBn?c.nameBn:c.name}</div>
              <div style={{color:"#94a3b8",fontSize:"0.72rem"}}>{c.max} pts</div>
            </div>
          ))}
        </div>
        <button onClick={() => setStep(1)} style={{background:"#0d9488",color:"white",border:"none",padding:"16px 40px",borderRadius:"12px",fontWeight:700,fontSize:"1.1rem",cursor:"pointer"}}>
          {isBn?"🚀 মূল্যায়ন শুরু করুন":"🚀 Start Assessment"}
        </button>
        <p style={{color:"#94a3b8",fontSize:"0.78rem",marginTop:"12px"}}>~10 {isBn?"মিনিট":"minutes"}</p>
      </div>
    </main>
  );

  if (submitting) return (
    <main style={{minHeight:"100vh",background:"#f8fafc",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"system-ui,sans-serif"}}>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:"3rem",marginBottom:"16px"}}>⚙️</div>
        <p style={{color:"#0f172a",fontSize:"1.2rem",fontWeight:600}}>{isBn?"রিপোর্ট তৈরি হচ্ছে...":"Generating your report..."}</p>
      </div>
    </main>
  );

  const isActive = (qId: number) => activeQ === qId && listening;

  return (
    <main style={{minHeight:"100vh",background:"#f8fafc",fontFamily:"system-ui,sans-serif",padding:"24px"}}>
      <style>{"@keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}"}</style>
      <div style={{maxWidth:"720px",margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"8px"}}>
          <a href={"/"+loc} style={{color:"#0d9488",textDecoration:"none",fontWeight:700}}>🌿 DPP Atlas</a>
          <span style={{color:"#64748b",fontSize:"0.875rem"}}>{isBn?"ধাপ":"Step"} {step}/{CATS.length}</span>
        </div>
        <div style={{height:"6px",background:"#e2e8f0",borderRadius:"3px",marginBottom:"28px"}}>
          <div style={{height:"100%",background:"#0d9488",borderRadius:"3px",width:pct+"%",transition:"width 0.4s"}} />
        </div>
        <div style={{marginBottom:"24px"}}>
          <span style={{background:"#f0fdfa",color:"#0d9488",border:"1px solid #99f6e4",padding:"4px 12px",borderRadius:"99px",fontSize:"0.75rem",fontWeight:700}}>
            {isBn?"বিভাগ":"CATEGORY"} {step}/{CATS.length} · {cat.max} {isBn?"পয়েন্ট":"POINTS"}
          </span>
          <h2 style={{fontSize:"1.4rem",fontWeight:800,color:"#0f172a",marginTop:"10px",marginBottom:"4px"}}>
            {isBn?cat.nameBn:cat.name}
          </h2>
        </div>

        <div style={{display:"grid",gap:"20px",marginBottom:"28px"}}>
          {catQs.map((q,qi) => (
            <div key={q.id} style={{background:"white",border:"1.5px solid "+(answers[q.id]!==undefined?"#0d9488":"#e2e8f0"),borderRadius:"14px",padding:"20px"}}>
              {q.info && (
                <span style={{background:"#fef9c3",color:"#854d0e",padding:"2px 8px",borderRadius:"6px",fontSize:"0.7rem",fontWeight:700,display:"inline-block",marginBottom:"8px"}}>
                  ℹ️ {isBn?"তথ্যমূলক":"INFORMATIONAL — No score impact"}
                </span>
              )}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:"10px",marginBottom:"14px"}}>
                <p style={{color:"#0f172a",fontWeight:600,lineHeight:1.5,fontSize:"0.95rem",margin:0,flex:1}}>
                  <span style={{color:"#0d9488",fontWeight:800}}>{qi+1}. </span>
                  {isBn?q.qBn:q.q}
                  {!q.info && <span style={{color:"#94a3b8",fontWeight:400,fontSize:"0.75rem",marginLeft:"6px"}}>(max {Math.max(...q.opts.map(o=>o.s))} pts)</span>}
                </p>
                {voiceOK && (
                  <button onClick={() => isActive(q.id)?stopVoice():startVoice(q.id)}
                    title={isBn?"ভয়েস ইনপুট":"Voice input"}
                    style={{width:"36px",height:"36px",flexShrink:0,border:"1px solid "+(isActive(q.id)?"#ef4444":"#e2e8f0"),borderRadius:"50%",background:isActive(q.id)?"#fee2e2":"#f8fafc",cursor:"pointer",fontSize:"1rem",display:"flex",alignItems:"center",justifyContent:"center",animation:isActive(q.id)?"blink 1s infinite":"none"}}>
                    {isActive(q.id)?"⏹️":"🎤"}
                  </button>
                )}
              </div>
              {isActive(q.id) && (
                <div style={{background:"#fee2e2",border:"1px solid #fecaca",borderRadius:"8px",padding:"8px 12px",marginBottom:"10px",fontSize:"0.8rem",color:"#dc2626",display:"flex",alignItems:"center",gap:"6px"}}>
                  <span style={{display:"inline-block",width:"8px",height:"8px",background:"#ef4444",borderRadius:"50%",animation:"blink 1s infinite"}}></span>
                  {isBn?"শুনছি... বলুন":"Listening... speak now"}
                </div>
              )}
              {notes[q.id] && !isActive(q.id) && (
                <div style={{background:"#f0fdfa",border:"1px solid #99f6e4",borderRadius:"8px",padding:"8px 12px",marginBottom:"10px",fontSize:"0.8rem",color:"#0f766e",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span>🎤 {notes[q.id]}</span>
                  <button onClick={() => setNotes(prev => {const n={...prev};delete n[q.id];return n;})} style={{background:"none",border:"none",color:"#94a3b8",cursor:"pointer",fontSize:"0.875rem"}}>✕</button>
                </div>
              )}
              <div style={{display:"grid",gap:"8px"}}>
                {q.opts.map(opt => (
                  <label key={opt.v} style={{display:"flex",alignItems:"center",gap:"10px",padding:"10px 14px",background:answers[q.id]===opt.v?"#f0fdfa":"#f8fafc",border:"1px solid "+(answers[q.id]===opt.v?"#0d9488":"#e2e8f0"),borderRadius:"8px",cursor:"pointer"}}>
                    <input type="radio" name={"q"+q.id} value={opt.v} checked={answers[q.id]===opt.v}
                      onChange={() => setAnswers(prev => ({...prev,[q.id]:opt.v}))}
                      style={{accentColor:"#0d9488"}} />
                    <span style={{color:"#0f172a",fontSize:"0.875rem",flex:1}}>{isBn?opt.lBn:opt.l}</span>
                    {!q.info && opt.s>0 && <span style={{color:"#0d9488",fontSize:"0.75rem",fontWeight:700,background:"#f0fdfa",padding:"2px 8px",borderRadius:"6px"}}>+{opt.s}</span>}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{display:"flex",gap:"12px"}}>
          {step>1 && (
            <button onClick={() => setStep(s=>s-1)} style={{padding:"13px 24px",background:"white",color:"#64748b",border:"1px solid #e2e8f0",borderRadius:"10px",cursor:"pointer",fontWeight:600}}>
              {isBn?"← পূর্ববর্তী":"← Previous"}
            </button>
          )}
          <button onClick={() => step<CATS.length?setStep(s=>s+1):handleSubmit()} disabled={!done}
            style={{flex:1,padding:"13px",background:done?"#0d9488":"#e2e8f0",color:done?"white":"#94a3b8",border:"none",borderRadius:"10px",fontWeight:700,fontSize:"0.95rem",cursor:done?"pointer":"not-allowed"}}>
            {step===CATS.length?(isBn?"✅ জমা দিন":"✅ Submit & View Report"):(isBn?"পরবর্তী →":"Next →")}
          </button>
        </div>
        {!done && <p style={{color:"#94a3b8",fontSize:"0.78rem",textAlign:"center",marginTop:"10px"}}>{isBn?"সকল প্রশ্নের উত্তর দিন":"Answer all questions to continue"}</p>}
      </div>
    </main>
  );
}
