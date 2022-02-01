/*** This file generates the README header file for all `sign` repositories ***/
const path = require('path');
const fs = require('fs');

const parentDir = path.join(__dirname, '../', '../');

const documentsUrl = 'https://github.com/sign/.github/blob/main/';

for (const match of fs.readdirSync(parentDir)) {
  if (match === '.DS_Store') {
    continue;
  }

  const fullPath = path.join(parentDir, match);
  if (!fs.lstatSync(fullPath).isDirectory()) {
    continue;
  }

  const readmePath = path.join(fullPath, 'README.md');

  let packageJson, readmeMd;
  try {
    packageJson = JSON.parse(String(fs.readFileSync(path.join(fullPath, 'package.json'))));
    readmeMd = String(fs.readFileSync(readmePath));
  } catch (e) {
    console.error(match, 'is missing package.json or README.md');
    console.error(e);
  }

  if (!packageJson.title) {
    continue;
  }

  const readmeBody = readmeMd.slice(readmeMd.indexOf('----'));
  const title = `${packageJson.icon?.emoji}️ \`sign\`/${packageJson.title}`;
  const readmeHead = `# ${title}

${packageJson.description}

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](${documentsUrl}LICENSE)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](${documentsUrl}CODE_OF_CONDUCT.md)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](${documentsUrl}CONTRIBUTING.md)  
`;

  console.log(title);
  fs.writeFileSync(readmePath, readmeHead + '\n' + readmeBody);
}
