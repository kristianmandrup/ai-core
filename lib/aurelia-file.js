const concat = require('./utils/concat');
const jp = require('jsonpath');
const configFilePath = './aurelia_project/aurelia.json';
const mutateJsonFile = require('./utils/io').mutateJsonFile;

function concatUniq(targetConfig, sourceConfig, {name = 'vendor-bundle.js', path, keys}) {
  // clone
  let clone = Object.assign({}, targetConfig);
  // using: jsonpath
  return jp.apply(clone, path, function(value) {
    return concat.uniqKeys(value, sourceConfig, keys);
  });
}

function mergeBundle(targetConfig, sourceConfig, name = 'vendor-bundle.js') {
  const path = `$.build.bundles[?(@.name == '${name}')]`;
  return concatUniq(targetConfig, sourceConfig, {
    path: path,
    keys: ['dependencies', 'prepend']
  });
}

function concatDtsSource(targetConfig, sourceConfig, name = 'vendor-bundle.js') {
  return concatUniq(targetConfig, sourceConfig, {
    path: `$.transpiler.dtsSource`,
    keys: ['dtsSource']
  });
}

function mutate(config, mutator) {
  mutateJsonFile(configFilePath, config, mutator);
}

// Use: mutateJsonFile where one of these is the callback mutator :)

module.exports = {
  mutate: mutate,
  configFilePath: configFilePath,
  mergeBundle: mergeBundle,
  concatDtsSource: concatDtsSource
}