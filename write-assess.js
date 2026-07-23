const fs = require('fs');

try {
  // Read the factory questions content from the downloaded file
  const content = fs.readFileSync('factory_questions.js', 'utf8');
  
  // Extract just the file contents from the script block
  const match = content.match(/w\('app\/\[locale\]\/assess\/page\.tsx',\s*`([\s\S]*?)`\s*\)/);
  
  if (match) {
    fs.mkdirSync('app/[locale]/assess', { recursive: true });
    fs.writeFileSync('app/[locale]/assess/page.tsx', match[1], 'utf8');
    console.log('OK: assess page written with factory-specific questions');
    console.log('Size:', fs.statSync('app/[locale]/assess/page.tsx').size, 'bytes');
  } else {
    console.log('ERROR: could not extract content from factory_questions.js. Check if the file format matches.');
  }
} catch (err) {
  console.error('ERROR:', err.message);
  console.log('Make sure factory_questions.js is downloaded and located in C:\\Users\\USER\\Downloads\\dpp-atlas');
}