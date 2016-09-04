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

function replaceKey(targetConfig, sourceConfig, {name = 'vendor-bundle.js', path, key}) {
  // clone
  let clone = Object.assign({}, targetConfig);
  // using: jsonpath
  return jp.apply(clone, path, function(value) {
    return sourceConfig[key];
  });
}

function bundlePath(name = 'vendor-bundle.js', key) {
  let path = `$.build.bundles[?(@.name == '${name}')]`;
  return key ? path + '.${key}' : path;
}

function mergeBundle(targetConfig, sourceConfig, name = 'vendor-bundle.js') {
  return concatUniq(targetConfig, sourceConfig, {
    path: bundlePath(name),
    keys: ['dependencies', 'prepend']
  });
}

function replaceInBundle(targetConfig, sourceConfig, name = 'vendor-bundle.js', key = 'dependencies') {
  return replaceKey(targetConfig, sourceConfig, {
    path: bundlePath(name, key),
    key: key
  });
}

// fatory fun
function bundleReplacer(name, key) {
  return function(targetConfig, sourceConfig) {
    return replaceInBundle(targetConfig, sourceConfig, name, key);
  }
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

function addToVendorBundle(config) {
  mutateJsonFile(configFilePath, config, mergeBundle);
}

// Use: mutateJsonFile where one of these is the callback mutator :)

module.exports = {
  mutate: mutate,
  bundlePath: bundlePath,
  configFilePath: configFilePath,
  mergeBundle: mergeBundle,
  bundleReplacer: bundleReplacer,
  replaceInBundle: replaceInBundle,
  addToVendorBundle: addToVendorBundle,
  concatDtsSource: concatDtsSource
}