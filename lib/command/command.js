const Registry = require('../registry');
const GitWorkflow = require('./git-workflow');
const registry = new Registry();
const enabled = registry.gitWorkflow;

function command(cmd, done) {
  try {
    cmd();
    done();
  } catch (err) {
    done(err);
  }
}

function commit(message) {
  if (!enabled) return;
  return new GitWorkflow().commit(message);
}

module.exports = function commitCmd(message, cmd) {
  command(cmd, (err) => {
    if (!err) {
      commit(message);
    }
  })
}

