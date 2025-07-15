const fs = require('fs');
const path = require('path');

const reportDir = 'reports';
const outputFile = 'reports/merged.json';

const files = fs.readdirSync(reportDir)
  .filter(file => file.endsWith('.json') && file !== 'merged.json');

const merged = files.flatMap(file => {
  const content = fs.readFileSync(path.join(reportDir, file), 'utf-8');
  return JSON.parse(content);
});

fs.writeFileSync(outputFile, JSON.stringify(merged, null, 2));
console.log(`✅ Merged ${files.length} JSON files into ${outputFile}`);