const fs = require('fs-extra');
const f = require('fs');
const jsonfile = require('jsonfile')
const path = require('path');
const log = require('./log');
const _ = require('lodash');

const readJson = jsonfile.readFileSync;
const writeJson = jsonfile.writeFileSync;
const readFile = f.readFileSync;
const writeFile = f.writeFileSync;
const mkdirs = fs.mkdirsSync;

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

function unlessFile(filePath, cb) {
  unlessPresent(filePath, {test: isFile}, cb);
}

function unlessFolder(filePath, cb) {
  unlessPresent(filePath, {test: isFolder}, cb);
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
  if (!mutator) {
    mutator = source;
    source = null;
  }
  let sourceConfig = source;
  try {
    let targetConfig = readJson(targetPath);

    if (typeof source === 'string') {
      sourceConfig = readJson(source);
    }
    sourceConfig = sourceConfig ? sourceConfig : targetConfig;

    let newConfig = mutator(targetConfig, sourceConfig);

    writeJson(targetPath, newConfig, {spaces: 2});

  } catch (e) {
    log.error('Error: operating on aurelia.json. Reverting to previous version ;{}', e);
    writeJson(targetPath, sourceConfig, {spaces: 2});
  }
}

function mergeJsonFile(targetPath, mergeObj) {
  mutateJsonFile(targetPath, (target, source) => {
    return _.merge(target, mergeObj);
  });
}


module.exports = {
  fileAt: fileAt,
  isFolder: isFolder,
  isFile: isFile,
  unlessPresent: unlessPresent,
  unlessFile: unlessFile,
  unlessFolder: unlessFolder,
  mergeJsonFile: mergeJsonFile,
  mutateJsonFile: mutateJsonFile,
  readJson: readJson,
  writeJson: writeJson,
  readFile: readFile,
  writeFile: writeFile,
  mkdirs: mkdirs,
  path: path
}
