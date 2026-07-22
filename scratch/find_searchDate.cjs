const fs = require('fs');
const file = 'c:/Users/2real/.antigravity-ide/미팅노트/frontend/src/App.jsx';
const content = fs.readFileSync(file, 'utf8');
const lines = content.split('\n');
lines.forEach((line, index) => {
  if (line.includes('searchDate')) {
    console.log(`${index + 1}: ${line.trim()}`);
  }
});
