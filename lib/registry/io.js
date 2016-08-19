const defaults = require('./defaults');
const utils = require('../utils');
const {_, io, log } = utils;
const { readJson, writeJson } = io;

module.exports = class RegistryIo {
  constructor(registry) {
    this.config = registry.config;
    this.installerConfigPath = defaults.installerConfigPath;
    this.read();
  }

  create() {
    log.info('creating installer config:', this.installerConfigPath);
    try {
      writeJson(this.installerConfigPath, this.initialReg, {spaces: 2})
    } catch (e) {
      log.error('write error', this.installerConfigPath, err);
      process.exit(1);
    }
  }

  read(force) {
    if (this.config && !force) {
      return this.config;
    }
    try {
      io.unlessFile(this.installerConfigPath, this.create);
      let config = readJson(this.installerConfigPath)
      // ie. componentsPath in components.json registry can override default componentsPath src/components
      if (config.componentsPath) {
        this.componentsPath = config.componentsPath;
      }
      return this.config = config;
    } catch (err) {
      log.error('read error', this.installerConfigPath, err);
      process.exit(1);
    }
  }

  rewrite() {
    this.write(this.config);
  }

  write(mergeConfig) {
    const configPath = this.installerConfigPath;
    console.log('write', this.installerConfigPath, mergeConfig)
    io.unlessFile(configPath, this.create);
    io.mergeJsonFile(configPath, mergeConfig);
  }
}
