const fs = require('fs-extra');
const jsonfile = require('jsonfile')
const path = require('path');

function isFolder(stats) {
  return stats || stats.isDirectory();
}

function isFile(stats) {
  return stats || stats.isFile() && stats.size > 0;
}

function unlessPresent(filePath, options = {test: isFile}, cb) {
  if (!fileAt(filePath, options.test)) {
    cb(filePath);
  }
}

function fileAt(filePath, statTest = isFile) {
  try {
    let stats = fs.statSync(filePath);
    if (statTest(stats)) {
      return filePath;
    }
  } catch (e) {
    if (e.code === 'ENOENT') {
      return false;
    }
    console.error('ERROR fileAt', filePath, e); 
  }
  return false;
}

// source must be a filePath to a json file or an Object
function mutateJsonFile(targetPath, source, mutator) {
  let sourceConfig = source;
  try {
    let targetConfig = readJson(targetPath);

    if (typeof source === 'string') {
      sourceConfig = readJson(source);
    } 

    let newConfig = mutator(targetConfig, sourceConfig);

    writeJson(targetPath, newConfig, {spaces: 2});

  } catch (e) {
    log.error('Error: operating on aurelia.json. Reverting to previous version ;{}', e);
    writeJson(targetPath, sourceConfig, {spaces: 2});
  }
}

module.exports = {
  fileAt: fileAt,
  isFolder: isFolder,
  isFile: isFile,
  unlessPresent: unlessPresent,
  mutateJsonFile: mutateJsonFile,
  readJson: jsonfile.readFileSync,
  writeJson: jsonfile.writeFileSync,
  mkdirs: fs.mkdirsSync,
  path: path
}
