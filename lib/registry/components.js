module.exports = class Components {
  constructor(registry, io) {
    this.registry = registry;
    this.config = registry.config;
    this.io = registry.io;
    this.write = this.io.write;
    this.autoBundle = this.registry.autoBundle;
  }

  get components() {
    return this.config.components;
  }

  component(name) {
    return (this.components || {})[name];
  }

  setComponent(name, obj) {
    let config = this.component(name);
    if (!config) return null;
    let newConfig = _.merge(config, obj);
    this.components[name] = newConfig;
    this.rewrite();
  }

  location(name) {
    if (!this.component(name)) return null;
    return path.join(this.appPath, this.component(name).location);
  }

  setBundled(state) {
    this.setComponent(name, {bundled: state })
  }

  markAsBundled(name) {
    this.setBundled(true);
  }

  markAsUnBundled(name) {
    this.setBundled(false);
  }

  unregister(name) {
    delete this.components[name];
    this.rewrite();
    if (this.autoBundle) {
      this.unbundle(this.name);
    }
  }

  register(name, destinationPath) {
    console.log('register', name, destinationPath);
    let components = {}
    components[name] = components[name] || {};
    components[name].location = destinationPath;
    components[name].bundled = false;

    if (this.autoBundle) {
      this.bundler.bundle(name);
    }
    this.write({
      components: components
    });
  }
}

