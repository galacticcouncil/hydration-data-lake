const fs = require('fs');
const path = require('path');

const rootPath = path.resolve(__dirname, '../indexers');

function getPackageInfo(packagePath) {
  const packageJsonPath = path.join(packagePath, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = require(packageJsonPath);
    return {
      name: packageJson.name || path.basename(packagePath),
      description: packageJson.description || '',
      folderPath: path.relative(__dirname, packagePath),
    };
  }
  return null;
}

function generateTableRow(packageInfo) {
  const packageLink = `[${packageInfo.name}](${packageInfo.folderPath})`;
  const changelogLink = `[changelog](${packageInfo.folderPath}/CHANGELOG.md)`;
  return `| ${packageLink} | ${changelogLink} | ${packageInfo.description} |`;
}

function generateMarkdownTable() {
  const packageDirs = fs.readdirSync(rootPath).filter((dir) =>
    fs.lstatSync(path.join(rootPath, dir)).isDirectory()
  );

  const header = `| Indexer | Changelog | Description |\n| --- | --- | --- |`;
  const rows = packageDirs
    .map((dir) => getPackageInfo(path.join(rootPath, dir)))
    .filter(Boolean) // Remove null entries
    .map(generateTableRow);

  const table = [header, ...rows].join('\n');
  fs.writeFileSync('PROJECT_STRUCTURE.md', table);
}

generateMarkdownTable();
