const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'app', '[locale]', 'assess', 'page.tsx');

if (!fs.existsSync(filePath)) {
  console.error("Error: app/[locale]/assess/page.tsx not found!");
  process.exit(1);
}

let content = fs.readFileSync(filePath, 'utf8');

// Inject the updated factory questions payload
const factoryQuestionsCode = `
export const FACTORY_QUESTIONS = [
  {
    id: "facility_overview",
    title: "Facility Overview & Scope",
    description: "Primary operational details and manufacturing scope.",
    questions: [
      { id: "fac_1", label: "Primary Manufacturing Focus", type: "select", options: ["Textile Dyeing & Finishing", "Garment Manufacturing", "Spinning & Weaving", "Integrated Mill"] },
      { id: "fac_2", label: "Annual Material Throughput (Tons)", type: "number" },
      { id: "fac_3", label: "Facility Location / Region", type: "text" }
    ]
  },
  {
    id: "traceability_data",
    title: "Supply Chain Traceability & Data Verification",
    description: "Data verification methods and digital product passport (DPP) readiness.",
    questions: [
      { id: "trc_1", label: "Current Traceability Tracking Method", type: "select", options: ["Manual / Paper-based", "ERP System", "Blockchain / Digital Ledger", "Hybrid"] },
      { id: "trc_2", label: "Data Verification Bottlenecks Identified?", type: "select", options: ["Yes - Supplier Data Inconsistency", "Yes - Third-party Audit Delays", "No - Fully Automated", "In Progress"] },
      { id: "trc_3", label: "DPP Compliance Preparation Status", type: "select", options: ["Not Started", "Evaluating Solutions", "Pilot Phase", "Fully Implemented"] }
    ]
  }
];
`;

if (!content.includes('FACTORY_QUESTIONS')) {
  content = factoryQuestionsCode + '\n' + content;
  fs.writeFileSync(filePath, content, 'utf8');
  console.log("Successfully updated assess/page.tsx with targeted factory questions!");
} else {
  console.log("FACTORY_QUESTIONS already present in assess/page.tsx.");
}
