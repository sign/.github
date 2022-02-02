/*** This file generates the PWA assets for all `sign` repositories ***/
const path = require('path');
const fs = require('fs');
const iterPackages = require('./_packages');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function main() {
  for (const [packagePath, packageJson] of iterPackages()) {
    if (!packageJson.icon?.material || !packageJson.icon?.location) {
      continue;
    }

    console.log(packageJson.name);

    const { icons, index, manifest } = packageJson.icon.location;
    const iconsPath = path.join(packagePath, icons);
    const indexPath = path.join(packagePath, index);
    const manifestPath = path.join(packagePath, manifest);

    // Update the manifest with data from package.json
    let manifestJson;
    try {
      manifestJson = JSON.parse(String(fs.readFileSync(manifestPath)));
    } catch (e) {
      console.error(e);
    }

    manifestJson.name = 'sign ' + packageJson.title;
    manifestJson.short_name = packageJson.title;
    manifestJson.description = packageJson.description;
    manifestJson.theme_color = packageJson.color;
    fs.writeFileSync(manifestPath, JSON.stringify(manifestJson, null, 2));

    // Generate the icon from material icons
    const materialName = packageJson.icon.material;
    const svgPath = path.join('../node_modules/@material-icons/svg/svg/', materialName, 'round.svg');
    const svg = String(fs.readFileSync(svgPath));

    // White icon
    const lightIcon = svg.replace('viewBox=', 'fill="#fff" viewBox=');
    fs.writeFileSync(path.join(iconsPath, 'light-icon.svg'), lightIcon);

    // Black icon
    const darkIcon = svg.replace('viewBox=', 'fill="#000" viewBox=');
    fs.writeFileSync(path.join(iconsPath, 'dark-icon.svg'), darkIcon);

    // Theme aware color favicon
    const favIcon = svg.replace(
      '<path',
      `
  <style>
    path {fill: black;}
    @media (prefers-color-scheme: dark) {  path {fill: white;}  }
  </style>
  <path`
    );
    fs.writeFileSync(path.join(iconsPath, 'favicon.svg'), favIcon);

    const commands = [
      `npx pwa-asset-generator ${iconsPath}/dark-icon.svg ${iconsPath}/generated/ -i ${indexPath} -m ${manifestPath} --background white --favicon --mstile`,
      `npx pwa-asset-generator ${iconsPath}/light-icon.svg --dark-mode ${iconsPath}/generated/ -i ${indexPath} --background black --splash-only`,
    ];

    for (const cmd of commands) {
      const { stdout, stderr } = await exec(cmd);
      console.log(stdout);
      console.error(stderr);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
