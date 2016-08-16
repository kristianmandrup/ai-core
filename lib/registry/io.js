const defaults = require('./defaults');
const utils = require('../utils');
const jsonfile = require('jsonfile');
const {io, log } = utils;
const _ = require('lodash');

module.exports = class RegistryIo {
  constructor(registry) {
    this.config = registry.config;
    this.installerConfigPath = defaults.installerConfigPath;
    this.read();
  }

  create() {
    log.info('creating installer config:', this.installerConfigPath);
    try {
      jsonfile.writeFileSync(this.installerConfigPath, this.initialReg, {spaces: 2})
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
      io.unlessPresent(this.installerConfigPath, this.create);
      let config = jsonfile.readFileSync(this.installerConfigPath)
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
    io.unlessPresent(this.installerConfigPath, this.create);
    jsonfile.readFile(this.installerConfigPath, (err, config) => {
      if (err) {
        log.error('write: read error', this.installerConfigPath, err);
        process.exit(1);
      }
      // lodash deep merge!
      const newConfig = _.merge(config, mergeConfig);
      jsonfile.writeFile(this.installerConfigPath, newConfig, {spaces: 2}, (err) => {
        if (err) {
          log.error('write error', this.installerConfigPath, err);
          process.exit(1);
        }
      });
    });
  }
}
