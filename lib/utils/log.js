const chalk = require('chalk');

const c = {
  error: chalk.bold.red,
  success: chalk.bold.green,
  warn: chalk.yellow,
  info: chalk.cyan,
  important: chalk.bold   
}

const log = {
  success: function(...rest) {
    console.log(c.success(...rest));
  },
  info: function(...rest) {
    console.log(c.info(...rest));
  },
  important: function(...rest) {
    console.log(c.important(...rest));
  },
  error: function(...rest) {
    console.log(c.error(...rest));
  },
  warn: function(...rest) {
    console.log(c.warn(...rest));
  }
}

module.exports = {
  c: c,
  log: log
}