const inquirer = require('inquirer')
const _ = require('lodash');
const classify = require('underscore.string/classify');

module.exports = {
  template: require('./template'),
  repo: require('./repo'),
  io: require('./io'),
  slug: _.kebabCase,
  classify: classify,
  concat: require('./concat'),
  log: require('./log'),
  shell: require('./shell'),
  ask: inquirer.prompt,
  _: _
}
