const path = require('path');
const _ = require('lodash');

module.exports = class ComponentRegistry {
  constructor(io, opts = {}) {
    this.io = io;
    this.config = io.config;

    // delegate config functions
    ['components', 'autoBundle'].map(prop => {
      this[prop] = this.config[prop];
    });
  }

  write(obj) {
    this.io.write(obj);
  }

  rewrite() {
    this.io.rewrite();
  }

  component(name) {
    return (this.components || {})[name];
  }

  get appPath() {
    return this.config.appPath || './src';
  }

  location(name) {
    return this.component(name).location;
  }

  setComponent(name, obj) {
    let config = this.component(name);
    if (!config) return null;
    let newConfig = _.merge(config, obj);
    this.components[name] = newConfig;
    this.rewrite();
  }

  setBundled(name, state) {
    this.setComponent(name, {bundled: state })
  }

  markAsBundled(name) {
    this.setBundled(name, true);
  }

  markAsUnBundled(name) {
    this.setBundled(name, false);
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

