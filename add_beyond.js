// Run:  node add_beyond.js   (from the dpp-atlas folder)
const fs=require('fs');
const dir='app/[locale]/check/';
const CAT='Beyond DPP data (buyer / other rules)';
const O={adm:['Admin-Commercial','অ্যাডমিন-কমার্শিয়াল'],brand:['Brand (not factory)','ব্র্যান্ড (কারখানা নয়)'],comp:['Compliance','কমপ্লায়েন্স'],merch:['Merchandising','মার্চেন্ডাইজিং'],qc:['QC','কোয়ালিটি']};
function f(n,en,bn,gran,ready,source,own,outEn,outBn,ref,rule){return{n,cat:CAT,en,bn,gran,ready,source,ownerEn:O[own][0],ownerBn:O[own][1],outEn,outBn,ref,rule};}
const NR='Not assessed in JRC draft';
const EXTRA=[
 f(38,'Supply chain: evidence of how you identify and prevent forced-labour risk','সরবরাহ শৃঙ্খলে জোরপূর্বক শ্রমের ঝুঁকি কীভাবে চিহ্নিত ও প্রতিরোধ করেন তার প্রমাণ','Company / supply chain',NR,'Social-compliance audit reports, supplier code of conduct (ASSUMPTION)','comp','Buyer, your suppliers','বায়ার, আপনার সরবরাহকারী','EP summary','Forced Labour Regulation (EU) 2024/3015: applies from 14 Dec 2027; general, not textile-specific'),
 f(39,'Country of origin / manufacture shown on labels and documents','লেবেল ও নথিতে উৎপাদনকারী দেশ','Model','Under consideration in the Textile Labelling revision','Tech pack, label spec, buyer requirements (ASSUMPTION)','merch','Buyer','বায়ার','Table 3','Textile Labelling Regulation (under revision); national rules (JRC: Spain and Lithuania require origin for non-EU products; France, Canada, China, US also)'),
 f(40,'Declaration “contains non-textile parts of animal origin”','“প্রাণীজ অ-টেক্সটাইল অংশ আছে” ঘোষণা','Model',NR,'Trim card, BOM (ASSUMPTION)','merch','Trim supplier','ট্রিম সরবরাহকারী','Table 3','Textile Labelling Regulation (EU) No 1007/2011 (mandatory per JRC Table 3)'),
 f(41,'Composition of non-textile parts (leather, fur, trims)','অ-টেক্সটাইল অংশের উপাদান (চামড়া, ফার, ট্রিম)','Model','Under consideration in the Textile Labelling revision','BOM, trim card (ASSUMPTION)','merch','Trim supplier, buyer','ট্রিম সরবরাহকারী, বায়ার','Table 3','Textile Labelling Regulation (under revision); leather/fur content mandatory in 6 member states per JRC'),
 f(42,'Size information on the label','লেবেলে সাইজ তথ্য','Model','Under consideration in the Textile Labelling revision','Tech pack, size spec (ASSUMPTION)','merch','Buyer','বায়ার','Table 3','Textile Labelling Regulation (under revision); required in Estonia, Slovakia, China per JRC'),
 f(43,'Sorting and disposal instructions (if sold in France or Finland)','বাছাই ও নিষ্পত্তির নির্দেশনা (ফ্রান্স বা ফিনল্যান্ডে বিক্রি হলে)','Model',NR,'Brand decision (ASSUMPTION)','brand','Buyer','বায়ার','Table 3','French AGEC law 2020-105 (Triman logo); Finland sorting rules'),
 f(44,'Flammability information (Ireland, children’s nightwear)','দাহ্যতা তথ্য (আয়ারল্যান্ড, শিশুদের নাইটওয়্যার)','Model',NR,'Lab test report (ASSUMPTION)','qc','Buyer, laboratory','বায়ার, ল্যাব','Table 3','Irish national rule (JRC Table 3); only if you supply that market'),
 f(45,'Labelling rules of your non-EU buyers (fibre, care, origin)','ইইউ-বহির্ভূত ক্রেতার লেবেলিং নিয়ম (ফাইবার, কেয়ার, উৎস)','Model',NR,'Buyer requirement documents (ASSUMPTION)','merch','Buyer','বায়ার','Table 3','National rules in US, Canada, Japan, China, UK, Turkey etc. (JRC Table 3, non-exhaustive)'),
 f(46,'Buyer supplier questionnaire / code of conduct (due-diligence data requests)','ক্রেতার সরবরাহকারী প্রশ্নাবলী / আচরণবিধি','Company',NR,'Buyer questionnaires on file (ASSUMPTION)','comp','Buyer','বায়ার','Table 3','CSDDD (EU) 2024/1760 and CSRD (EU) 2022/2464: company-level, JRC says limited relevance to product DPP; thresholds and dates not re-verified'),
 f(47,'Data requests from your buyer linked to textile producer responsibility','টেক্সটাইল উৎপাদক দায়িত্ব সংক্রান্ত ক্রেতার ডেটা অনুরোধ','Company',NR,'None known yet (ASSUMPTION)','comp','Buyer','বায়ার','EU textiles page','Directive (EU) 2025/1892 (in force 16 Oct 2025); detailed duties not reviewed here'),
 f(48,'Bangladesh national requirements for your export business','আপনার রপ্তানি ব্যবসার জন্য বাংলাদেশের জাতীয় প্রয়োজনীয়তা','Company',NR,'Not checked in this tool (ASSUMPTION)','adm','BGMEA or a legal adviser','BGMEA বা আইনজীবী','Not verified','NOT VERIFIED: Bangladesh rules were not checked. Confirm with BGMEA or a legal adviser'),
];
let t=fs.readFileSync(dir+'fields.ts','utf8');
if(t.includes('export const EXTRA')){console.log('EXTRA already added; skipping fields.ts');}
else{fs.writeFileSync(dir+'fields.ts.bak12',t);
 t+='\n\n// Items from rules outside the JRC data-point list. Sources: JRC draft Table 3, European Parliament summary, EU textiles page. Owner and outside-call are ASSUMPTIONS.\nexport const EXTRA: Field[] = '+JSON.stringify(EXTRA,null,1)+';\nFIELDS.push(...EXTRA);\n';
 fs.writeFileSync(dir+'fields.ts',t);console.log('fields.ts: added '+EXTRA.length+' items');}
let p=fs.readFileSync(dir+'page.tsx','utf8'); fs.writeFileSync(dir+'page.tsx.bak12',p);
function rep(a,b){const n=p.split(a).length-1;console.log(n+'x  '+a.slice(0,50));p=p.split(a).join(b);}
rep('JRC {f.ref} ·','{/^T[0-9]/.test(f.ref) ? "JRC " + f.ref : f.ref} ·');
rep('Data points and readiness come from the EU JRC draft, which is not law.','Most data points and readiness come from the EU JRC draft, which is not law. The “Beyond DPP data” group comes from other rules (see Rules and standards).');
rep('ডেটা পয়েন্ট ও প্রস্তুতির মাত্রা ইইউ JRC খসড়া থেকে।','বেশিরভাগ ডেটা পয়েন্ট ও প্রস্তুতির মাত্রা ইইউ JRC খসড়া থেকে; “DPP ডেটার বাইরে” অংশ অন্য নিয়ম থেকে।');
fs.writeFileSync(dir+'page.tsx',p);
console.log('done');
