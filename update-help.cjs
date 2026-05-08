const fs = require('fs');

const extraDiagrams = `

### Class Diagrams (Mermaid)

**Markdown:**

\`\`\`\`markdown
\`\`\`mermaid
classDiagram
    Animal <|-- Duck
    Animal <|-- Fish
    Animal <|-- Zebra
    Animal : +int age
    Animal : +String gender
    Animal: +isMammal()
    Animal: +mate()
    class Duck{
        +String beakColor
        +swim()
        +quack()
    }
    class Fish{
        -int sizeInFeet
        -canEat()
    }
    class Zebra{
        +bool is_wild
        +run()
    }
\`\`\`
\`\`\`\`

**Preview:**

\`\`\`mermaid
classDiagram
    Animal <|-- Duck
    Animal <|-- Fish
    Animal <|-- Zebra
    Animal : +int age
    Animal : +String gender
    Animal: +isMammal()
    Animal: +mate()
    class Duck{
        +String beakColor
        +swim()
        +quack()
    }
    class Fish{
        -int sizeInFeet
        -canEat()
    }
    class Zebra{
        +bool is_wild
        +run()
    }
\`\`\`

### Pie Charts (Mermaid)

**Markdown:**

\`\`\`\`markdown
\`\`\`mermaid
pie title Pets adopted by volunteers
    "Dogs" : 386
    "Cats" : 85
    "Rats" : 15
\`\`\`
\`\`\`\`

**Preview:**

\`\`\`mermaid
pie title Pets adopted by volunteers
    "Dogs" : 386
    "Cats" : 85
    "Rats" : 15
\`\`\`

### Gantt Charts (Mermaid)

**Markdown:**

\`\`\`\`markdown
\`\`\`mermaid
gantt
    title A Gantt Diagram
    dateFormat  YYYY-MM-DD
    section Section
    A task           :a1, 2014-01-01, 30d
    Another task     :after a1  , 20d
    section Another
    Task in sec      :2014-01-12  , 12d
    another task      : 24d
\`\`\`
\`\`\`\`

**Preview:**

\`\`\`mermaid
gantt
    title A Gantt Diagram
    dateFormat  YYYY-MM-DD
    section Section
    A task           :a1, 2014-01-01, 30d
    Another task     :after a1  , 20d
    section Another
    Task in sec      :2014-01-12  , 12d
    another task      : 24d
\`\`\`
`;

let code = fs.readFileSync('src/components/Help.tsx', 'utf8');
const startStr = 'const HELP_CONTENT = "';
const startIdx = code.indexOf(startStr);

if (startIdx !== -1) {
  const endIdx = code.indexOf('";\n', startIdx);
  if (endIdx !== -1) {
    const jsonStr = code.slice(startIdx + 'const HELP_CONTENT = '.length, endIdx + 1);
    let content = JSON.parse(jsonStr);
    content += extraDiagrams;
    
    const newCode = code.slice(0, startIdx) + 'const HELP_CONTENT = ' + JSON.stringify(content) + ';\n' + code.slice(endIdx + 3);
    fs.writeFileSync('src/components/Help.tsx', newCode);
    console.log('Appended to Help.tsx');
  } else { console.log('not found endIdx'); }
} else { console.log('not found startIdx'); }
