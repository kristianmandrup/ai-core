const fs = require('fs-extra');

function unlessPresent(filePath, cb) {
  if (!fileAt(filePath)) {
    cb(filePath);
  }
}

function fileAt(filePath) {
  try {
    let stats = fs.statSync(filePath);
    if (stats || stats.isFile() && stats.size > 0) {
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
    let targetConfig = jsonfile.readFileSync(targetPath);

    if (typeof source === 'string') {
      sourceConfig = jsonfile.readFileSync(source);
    } 

    let newConfig = mutator(targetConfig, sourceConfig);

    jsonfile.writeFileSync(targetPath, newConfig, {spaces: 2});

  } catch (e) {
    log.error('Error: operating on aurelia.json. Reverting to previous version ;{}', e);
    jsonfile.writeFileSync(targetPath, sourceConfig, {spaces: 2});
  }
}

module.exports = {
  fileAt: fileAt,
  unlessPresent: unlessPresent,
  mutateJsonFile: mutateJsonFile
}
