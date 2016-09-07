const fs = require('fs-extra');
const f = require('fs');
const jsonfile = require('jsonfile')
const path = require('path');
const log = require('./log');
const _ = require('lodash');

const readJson = function(filePath) {
  try {
    if (global.mockedFiles) {
      let content = global.mockedFiles[filePath];
      if (!content) {
        console.error('No mocked file content for', filePath);
        return {};
      }
      // console.log('read', filePath, content);
      let parsed = JSON.parse(content);
      return parsed;
    }
    jsonfile.readFileSync(filePath);
  } catch (err) {
    console.error('cannot read', filePath, err)
    return {};
  }
}

const writeJson = function(filePath, obj) {
  // console.log('writing to', filePath, '->', obj)
  global.mockedFiles ? global.mockedFiles[filePath] = JSON.stringify(obj) : jsonfile.writeFileSync(filePath, obj);
}

const readFile = f.readFileSync;
const writeFile = f.writeFileSync;
const mkdirs = fs.mkdirsSync;

function filesIn(folder) {
  return fs.readdirSync(folder);
}

function isFolder(stats) {
  return stats && stats.isDirectory();
}

function isFile(stats) {
  return stats && stats.isFile() && stats.size > 0;
}

function unlessPresent(filePath, options = {test: isFile}, cb) {
  if (!fileAt(filePath, options.test)) {
    if (cb)
      cb(filePath);
    else
      return true;
  }
  return false;
}

function isPresent(filePath, options = {test: isFile}, cb) {
  if (fileAt(filePath, options.test)) {
    if (cb)
      cb(filePath);
    else
      return true;
  }
  return false;
}

function hasFile(filePath, cb) {
  return isPresent(filePath, {test: isFile}, cb);
}

function hasFolder(filePath, cb) {
  return isPresent(filePath, {test: isFolder}, cb);
}


function unlessFile(filePath, cb) {
  return unlessPresent(filePath, {test: isFile}, cb);
}

function unlessFolder(filePath, cb) {
  return unlessPresent(filePath, {test: isFolder}, cb);
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
    // console.log('targetPath', targetPath);

    let targetConfig = readJson(targetPath);

    // console.log('source', source);
    if (typeof source === 'string') {
      sourceConfig = readJson(source);
    }
    // console.log('sourceConfig', targetPath, sourceConfig)
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
  filesIn: filesIn,
  fileAt: fileAt,
  isFolder: isFolder,
  isFile: isFile,
  unlessPresent: unlessPresent,
  unlessFile: unlessFile,
  unlessFolder: unlessFolder,
  isPresent: isPresent,
  hasFile: hasFile,
  hasFolder: hasFolder,
  mergeJsonFile: mergeJsonFile,
  mutateJsonFile: mutateJsonFile,
  readJson: readJson,
  writeJson: writeJson,
  readFile: readFile,
  writeFile: writeFile,
  mkdirs: mkdirs,
  path: path
}
