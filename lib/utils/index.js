const inquirer = require('inquirer')
const _ = require('lodash');
const classify = require('underscore.string/classify');

module.exports = {
  io: require('./io'),
  slug: _.kebabCase,
  classify: classify,
  concat: require('./concat'),
  log: require('./log').log,
  ask: inquirer.prompt,
  _: _
}
