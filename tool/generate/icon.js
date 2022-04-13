const fs = require('fs');
const path = require('path');
const root = require('../utilities/root');
const { createFile } = require('../utilities/file');

const getIconList = (dir, subdir = '') => {
  let icons = [];
  const iconDir = root(dir);
  fs.readdirSync(iconDir).forEach((file) => {
    const pathfile = path.join(iconDir, file);
    const ls = fs.lstatSync(pathfile);
    if (ls.isFile() && path.extname(file) === '.svg') {
      const name = file.substring(0, file.length - 4);
      icons.push(subdir + name);
    } else if (ls.isDirectory()) {
      icons = icons.concat(getIconList(path.join(dir, file), file + '/'));
    }
  });

  return icons;
};

const generateIcon = async (dir) => {
  let sass = '$icons-settings-remix: (';
  for (const icon of getIconList(path.join(dir, 'remix'))) sass += `${icon}, `;
  sass += ');\n';

  sass += '$icons-settings-dsfr: (';
  for (const icon of getIconList(path.join(dir, '/dsfr'))) sass += `${icon}, `;
  sass += ');\n';

  const iconPath = root('.config/icon.scss');
  createFile(iconPath, sass);
};

module.exports = { generateIcon };
