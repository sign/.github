const path = require('path');
const fs = require('fs');

const parentDir = path.join(__dirname, '../', '../');

module.exports = function* () {
  for (const match of fs.readdirSync(parentDir)) {
    if (match === '.DS_Store') {
      continue;
    }

    const fullPath = path.join(parentDir, match);
    if (!fs.lstatSync(fullPath).isDirectory()) {
      continue;
    }

    if (!fs.existsSync(path.join(fullPath, 'package.json'))) {
      continue;
    }

    let packageJson;
    try {
      packageJson = JSON.parse(String(fs.readFileSync(path.join(fullPath, 'package.json'))));
    } catch (e) {
      console.error(match, 'is missing package.json');
      console.error(e);
    }

    if (!packageJson.title) {
      continue;
    }

    yield [fullPath, packageJson];
  }
};
