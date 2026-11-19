// Run:  node align_and_govern.js   (from the dpp-atlas folder)
const fs=require('fs');
function fix(p,R){
 let t=fs.readFileSync(p,'utf8'); fs.writeFileSync(p+'.bak14',t);
 for(const [a,b] of R){const n=t.split(a).length-1;console.log(n+'x  '+p.split('/').slice(-2).join('/')+'  '+a.slice(0,45));t=t.split(a).join(b);}
 fs.writeFileSync(p,t);
}
const H='href={"/"+loc+"/assess"}', C='href={"/"+loc+"/check"}';
fix('app/[locale]/dashboard/page.tsx',[
 [H,C],
 ['+ {isBn?"নতুন মূল্যায়ন":"New Assessment"}','+ {isBn?"নতুন ডেটা চেক":"New Data Check"}'],
 ['l:isBn?"মোট মূল্যায়ন":"Total Assessments"','l:isBn?"পুরনো স্কোরভিত্তিক রিপোর্ট":"Old scored reports"'],
 ['{isBn?"আপনার মূল্যায়ন ইতিহাস":"Assessment History"}','{isBn?"পুরনো স্কোরভিত্তিক রিপোর্টের ইতিহাস":"Old scored report history"}'],
 ['{isBn?"কোনো মূল্যায়ন নেই":"No assessments yet"}','{isBn?"কোনো পুরনো রিপোর্ট নেই":"No old scored reports"}'],
 ['{isBn?"আপনার প্রথম DPP মূল্যায়ন শুরু করুন।":"Complete your first DPP assessment."}','{isBn?"আপনার প্রথম ডেটা চেক শুরু করুন।":"Start your first Data Check."}'],
 ['{isBn?"শুরু করুন":"Start Assessment"}','{isBn?"ডেটা চেক শুরু করুন":"Start Data Check"}'],
 ['{isBn?"AI রোডম্যাপ অনুসরণ করুন এবং পুনরায় মূল্যায়ন করুন।":"Follow your AI roadmap, implement improvements, then reassess."}','{isBn?"সোমবারের তালিকা ধরে কাজ করুন, তারপর আবার ডেটা চেক করুন।":"Work through your Monday list, then run the Data Check again."}'],
 ['{isBn?"পুনরায় মূল্যায়ন":"Reassess"}','{isBn?"আবার ডেটা চেক":"Run Data Check again"}'],
]);
fix('app/[locale]/login/page.tsx',[
 [H,C],
 ['{isBn?"লগইন ছাড়াই মূল্যায়ন করুন →":"Continue without login →"}','{isBn?"লগইন ছাড়াই ডেটা চেক করুন →":"Data Check without login →"}'],
 ['{isBn?"সব মূল্যায়ন সংরক্ষিত থাকে":"All assessments saved permanently"}','{isBn?"ডেটা চেকের উত্তর শুধু এই ব্রাউজারে সংরক্ষিত থাকে":"Data Check answers are saved in this browser only"}'],
 ['{isBn?"যেকোনো ডিভাইস থেকে অ্যাক্সেস":"Access from any device"}','{isBn?"অ্যাকাউন্ট শুধু পুরনো স্কোরভিত্তিক রিপোর্ট ও ড্যাশবোর্ডের জন্য":"An account is only needed for old scored reports and the dashboard"}'],
]);
fix('app/[locale]/report/[id]/page.tsx',[
 [H,C],
 ['Start a new assessment','Start a Data Check'],
 ['{isBn?"নতুন মূল্যায়ন":"New Assessment"}','{isBn?"ডেটা চেক":"Data Check"}'],
]);
// rules page: registry row
fix('app/[locale]/rules/page.tsx',[
 ['  { name: "Textile Labelling Regulation (EU) No 1007/2011"','  { name: "ESPR Article 13 central DPP registry; Implementing Regulation (EU) 2026/1778", type: "EU law", typeBn: "ইইউ আইন", what: "Commission registry for passports, reported live from 20 July 2026. No registration duty for textiles yet: duties arise product group by product group through delegated acts (batteries first, from 18 Feb 2027). Operators are verified with eIDAS-based means.", source: "Two secondary sources citing the Commission registry page and EUR-Lex; Commission pages not read here", status: "limited" },\n  { name: "Textile Labelling Regulation (EU) No 1007/2011"'],
]);
// data check: governance + registry items
const CAT='Data governance and buyer readiness';
const O={comp:['Compliance','কমপ্লায়েন্স'],merch:['Merchandising','মার্চেন্ডাইজিং'],plan:['Planning','প্ল্যানিং'],src:['Sourcing','সোর্সিং'],adm:['Admin-Commercial','অ্যাডমিন-কমার্শিয়াল'],nob:['NOBODY (likely)','কেউ নয় (সম্ভবত)']};
function f(n,en,bn,gran,ready,source,own,oE,oB,ref,rule){return{n,cat:CAT,en,bn,gran,ready,source,ownerEn:O[own][0],ownerBn:O[own][1],outEn:oE,outBn:oB,ref,rule};}
const NA='Not assessed in JRC draft';
const PV='Practitioner view (not official)';
const EX=[
 f(49,'A named person is responsible for the accuracy of each product data point','প্রতিটি পণ্য ডেটার সঠিকতার জন্য একজন নির্দিষ্ট ব্যক্তি দায়ী','Company',NA,'Org chart, SOPs (ASSUMPTION)','nob','Your management','আপনার ব্যবস্থাপনা','JRC 5.2.1',"JRC draft 5.2.1: technical data is managed ad hoc across teams. Ownership is the practical gap"),
 f(50,'Product data is copied by hand between ERP, PLM, spreadsheets, email and PDFs','ERP, PLM, স্প্রেডশিট, ইমেইল ও PDF-এর মধ্যে ডেটা হাতে কপি করা হয়','Company',NA,'IT / Merchandising (ASSUMPTION)','merch','Buyer platform requirements','বায়ার প্ল্যাটফর্মের চাহিদা','JRC 5.2.1','JRC draft 5.2.1: sustainability and technical data are handled through manual processes, email chains and unstructured PDF or Excel files'),
 f(51,'You can retrieve tech pack, BOM, fibre composition, test report and certificates for ONE style within a day','একটি স্টাইলের টেক প্যাক, BOM, ফাইবার কম্পোজিশন, টেস্ট রিপোর্ট ও সনদ এক দিনের মধ্যে বের করতে পারেন','Model',NA,'Merchandising (ASSUMPTION)','merch','Buyer','বায়ার',PV,'Industry practitioner view (LinkedIn posts); not an official rule'),
 f(52,'You can tell the approved specification apart from what was actually used in production','অনুমোদিত স্পেসিফিকেশন আর বাস্তবে উৎপাদনে যা ব্যবহার হয়েছে তা আলাদা করতে পারেন','Batch',NA,'Planning / QC (ASSUMPTION)','plan','Buyer','বায়ার',PV,'Industry practitioner view (LinkedIn posts); not an official rule'),
 f(53,'Materials can be linked to upstream suppliers and facilities beyond Tier 1 (fabric, yarn, fibre)','উপকরণকে টিয়ার ১-এর বাইরে (কাপড়, সুতা, ফাইবার) উৎস সরবরাহকারী ও কারখানার সাথে যুক্ত করা যায়','Batch',NA,'Purchase orders, supplier lists (ASSUMPTION)','src','Fabric / yarn suppliers','কাপড় / সুতা সরবরাহকারী','JRC 5.2.1','JRC draft 5.2.1: Tier 2 (fabric), Tier 3 (yarn) and raw-material origin remain largely opaque'),
 f(54,'You know which product data you can share with a buyer and which is confidential business information','কোন পণ্য ডেটা ক্রেতার সাথে শেয়ার করা যাবে আর কোনটি গোপন ব্যবসায়িক তথ্য তা জানেন','Company',NA,'Contracts, NDAs (ASSUMPTION)','comp','Buyer, legal adviser','বায়ার, আইনজীবী','JRC 5.2.1','JRC draft 5.2.1: upstream suppliers often treat technical data as confidential business information'),
 f(55,'Your buyer or importer plans to register passports in the EU registry and may ask you for an operator ID (GLN / EORI)','আপনার ক্রেতা/আমদানিকারক ইইউ রেজিস্ট্রিতে পাসপোর্ট নিবন্ধন করতে পারেন এবং আপনার কাছে অপারেটর আইডি (GLN/EORI) চাইতে পারেন','Company',NA,'Buyer communication (ASSUMPTION)','adm','Buyer, importer','বায়ার, আমদানিকারক','Registry (secondary sources)','ESPR Art. 13 registry; Implementing Regulation (EU) 2026/1778. No textile registration duty yet; reported by secondary sources only'),
];
const fp='app/[locale]/check/fields.ts';
let t=fs.readFileSync(fp,'utf8');
if(t.includes('export const GOV')) console.log('GOV already present; skipping');
else{fs.writeFileSync(fp+'.bak14',t);
 t+='\n\n// Data-governance items. JRC 5.2.1 items come from the JRC draft; items marked "Practitioner view" are NOT official rules. Owner and outside-call are ASSUMPTIONS.\nexport const GOV: Field[] = '+JSON.stringify(EX,null,1)+';\nFIELDS.push(...GOV);\n';
 fs.writeFileSync(fp,t);console.log('fields.ts: added '+EX.length+' governance items');}
console.log('done');
