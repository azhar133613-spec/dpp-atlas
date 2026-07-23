const fs = require('fs');
const path = require('path');

// Download the assess page from Claude's output
const content = fs.readFileSync('app/[locale]/assess/page.tsx', 'utf8');
console.log('Current assess page size:', content.length, 'bytes');
console.log('Factory types detected:', content.includes('FACTORY_QUESTIONS') ? 'YES - already has factory-specific questions' : 'NO - needs update');