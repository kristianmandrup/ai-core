const proc = require('child_process');
const exec = proc.exec;
// const spawn = proc.spawn;

const log = require('../log');
const c = log.c;


function listen(child, done) {
  child.stdout.on('data', function(data) {
      console.log('' + data);
  });
  child.stderr.on('data', function(err) {
      console.error('' + err);
      done(err);
  });
  child.on('close', function(code) {
    done(code);
  });
}

module.exports = function shellCmd(command, args, done) {  
  let fullCmd = `${command} ${args.join(' ')}`;
  // log.info(fullCmd);

  let child = exec(fullCmd);
  listen(child, (code) => {
    done(code);
  });
}
