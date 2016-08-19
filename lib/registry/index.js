const defaults = require('./defaults');
const Components = require('./components');
const RegistryIo = require('./io');

module.exports = class Registry {
  // override default component install location ie. for mounting
  constructor(componentsPath) {
    this.componentsPath = componentsPath || defaults.componentsPath;
    this.installerConfigPath = defaults.installerConfigPath;
    this.io = new RegistryIo(this);
    this.components = new Components(this);
    this.config = {};

    // delegate config functions
    ['packageManager', 'gitAccount', 'gitWorkflow', 'srcLayout', 'autoBundle'].map(prop => {
      this[prop] = this.config[prop];
    });

    // delegate io functions
    ['write', 'create', 'read', 'rewrite'].map(prop => {
      this[prop] = this.io[prop];
    });
  }

  get initialReg() {
    return defaults.initialRegistry;
  }

  get defaultLayout() {
    return this.config.defaultLayout || 'simple';
  }

  get appPath() {
    return this.config.appPath || './src';
  }
}
