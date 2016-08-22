const io = require('./io');
const ejs = require('ejs');
const path = require('path');

class Template {
  constructor(destinationFolder, {basePath, templatePath, destinationPath, ctx}) {
    this.basePath = basePath || __dirname;
    this.destinationFolder = destinationFolder
    this.templatePath = path.join('templates', 'component', templatePath);;
    this.destinationPath = destinationPath || path.basename(templatePath);
    this.data = ctx;
  }

  assemble() {
    try {
      return ejs.render(this.template, this.data);
    } catch (e) {
      console.log(e);
      throw `Template error: ${fullPath}`;
    }
  }

  get template() {
    return io.readFile(this.fullTemplatePath, 'utf-8');
  }

  get fullTemplatePath() {
    return path.join(this.basePath, this.templatePath);
  }

  get fileContent() {
    return this.assemble();
  }

  createFile() {
    try {
      io.writeFile(this.destinationFilePath, this.fileContent);
    } catch (e) {
      throw `Template write error: ${this.templatePath} -> ${this.destinationPath}`;
    }
  }

  get destinationFilePath() {
    return path.join(this.destinationFolder, this.destinationPath);
  }

  templateFile() {
    this.createFile();
  }

  create() {
    try {
      this.templateFile();
    } catch (e) {
      throw `ERROR: componentFile: ${this.templatePath}`;
    }
  }
}

module.exports = function template(destinationFolder, {basePath, templatePath, destinationPath, ctx}) {
  return new Template(destinationFolder, {basePath, templatePath, destinationPath, ctx});
}