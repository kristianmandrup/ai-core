const jsonfile = require('jsonfile')
const inquirer = require('inquirer')
const _ = require('lodash');
const path = require('path');

module.exports = {
  io: require('./io'),
  concat: require('./concat'),
  log: require('./log').log,
  ask: inquirer.prompt,
  readJson: jsonfile.readFileSync,
  writeJson: jsonfile.writeFileSync,
  _: _,
  path: path
}
