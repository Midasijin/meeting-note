const fs = require('fs');
const file = 'c:/Users/2real/.antigravity-ide/미팅노트/frontend/src/App.jsx';
const content = fs.readFileSync(file, 'utf8');
const lines = content.split('\n');
let inside = false;
let start = 0;
lines.forEach((line, index) => {
  if (line.includes('useEffect(')) {
    inside = true;
    start = index + 1;
    console.log(`--- useEffect at line ${start} ---`);
  }
  if (inside && index + 1 < start + 30) {
    console.log(`${index + 1}: ${line}`);
  }
  if (line.includes('}, [')) {
    inside = false;
  }
});
