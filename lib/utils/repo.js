const log = require('./log');
const download = require('download-git-repo');
const git = require('simple-git');

class Repo {
  constructor(repoPath, destinationPath) {
    this.repoPath = repoPath;
    this.destinationPath = destinationPath;
  }

  download(complete) {
    log.info('downloading git repo from', this.repoPath, this.destinationPath);
    download(this.repoPath, this.destinationPath, complete)
  }


  clone(complete, options = {}) {
    log.info('cloning git repo from', this.repoPath, this.destinationPath);
    var simpleGit = git();
    simpleGit.clone(this.repoPath, this.destinationPath, options, complete);
  }
}

module.exports = function repo(location, type) {
  return new Repo(location, type);
}