/*** This file generates the README header file for all `sign` repositories ***/
const path = require('path');
const fs = require('fs');
const iterPackages = require('./_packages');

const documentsUrl = 'https://github.com/sign/.github/blob/main/';

for (const [packagePath, packageJson] of iterPackages()) {
  const readmePath = path.join(packagePath, 'README.md');

  let readmeMd;
  try {
    readmeMd = String(fs.readFileSync(readmePath));
  } catch (e) {
    console.error(match, 'is missing README.md');
    console.error(e);
  }

  if (!packageJson.title) {
    continue;
  }

  const readmeBody = readmeMd.slice(readmeMd.indexOf('---') - 1);
  const title = `${packageJson.icon?.emoji}️ \`sign\`/${packageJson.title}`;
  const readmeHead = `# ${title}

${packageJson.description}

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](${documentsUrl}LICENSE)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](${documentsUrl}CODE_OF_CONDUCT.md)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](${documentsUrl}CONTRIBUTING.md)`;

  console.log(title);
  fs.writeFileSync(readmePath, readmeHead + '\n' + readmeBody);
}
