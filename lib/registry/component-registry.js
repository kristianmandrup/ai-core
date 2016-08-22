module.exports = class ComponentRegistry {
  constructor(io) {
    this.io = io;
    this.config = io.config;
  }

  write(obj) {
    this.io.write(obj);
  }

  get autoBundle() {
    return this.config.autoBundle;
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
  }

  register(name, destinationPath) {
    let components = {}

    let componentEntry = this.component(this.name);
    if (componentEntry) {
      throw `Component ${this.name} already registered at: ${componentEntry.location}`;
    }

    components[name] = components[name] || {};
    components[name].location = destinationPath;
    components[name].bundled = false;

    this.write({
      components: components
    });
  }
}

