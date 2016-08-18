const {log, io } = require('./utils')
const {readJson} = io;
const Registry = require('./registry');
const configFilePath = require('./aurelia-file').configFilePath;

module.exports = class Preferences {
  constructor() {
    this.registry = new Registry();
    this.config = this.load();
  }

  // read prefs from aurelia.json
  load() {
    try {
      return readJson(configFilePath);
    } catch (err) {
      log.error('Error: Unable to read ', configFilePath);
    }
  }

  get fileExt() {
    switch (this.language) {
      case 'typescript': return 'ts';
      default: return 'js';
    }
  }

  get hasTsConfig() {
    return io.fileAt('./tsconfig.json');
  }

  get language() {
    return this.useTypeScript ? 'typescript' : 'javascript';
  }

  get transpileTypescript() {
    return this.transpiler === 'typescript';
  }

  get packageManager() {
    return this.registry.packageManager || 'jspm';
  }

  get appBundler() {
    return this.registry.appBundler || 'system';
  }

  get useTypeScript() {
    return this.hasTsConfig || this.transpileTypescript;
  }

  get transpiler() {
    return this.config.transpiler ? this.config.transpiler.id : null;
  }
}