const defaults = require('./defaults');
const ComponentRegistry = require('./component-registry');
const Io = require('./io');
const io = require('../utils/io');

module.exports = class Registry {
  // override default component install location ie. for mounting
  constructor(componentsPath) {
    this.componentsPath = componentsPath || defaults.componentsPath;
    this.installerConfigPath = defaults.installerConfigPath;
    this.io = new Io(this);

    // delegate config functions
    ['packageManager', 'gitAccount', 'gitWorkflow', 'srcLayout', 'autoBundle'].map(prop => {
      this[prop] = this.config[prop];
    });

    // delegate io functions
    ['write', 'create', 'read', 'rewrite'].map(prop => {
      this[prop] = this.io[prop];
    });

    this.componentRegistry = new ComponentRegistry(this.io);
  }

  get components() {
    return this.componentRegistry.components;
  }

  component(name) {
    return this.componentRegistry.component(name);
  }

  componentLocation(name) {
    return this.componentRegistry.location(name);
  }

  get config() {
    return this.io.config;
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

  get fullComponentsPath() {
    return io.path.join(this.appPath, this.componentsPath);
  }
}
