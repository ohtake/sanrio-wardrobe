// This file is required by webpack.config.js.
// Do not use ECMAScript 6 syntax, e.g. for-of, export default, ...

class DataFile {
  constructor(name, seriesSymbol, nameJa, nameEn) {
    this.name = name;
    this.seriesSymbol = seriesSymbol;
    this.nameJa = nameJa;
    this.nameEn = nameEn;
  }
  getDisplayName() {
    return `${this.seriesSymbol} ${this.nameJa} (${this.nameEn})`;
  }
}

DataFile.all = [
  DataFile.ktKitty = new DataFile('kt-kitty', 'KT', 'キティ', 'Kitty'),
  DataFile.ktMimmy = new DataFile('kt-mimmy', 'KT', 'ミミィ', 'Mimmy'),
];

const map = {};
for (let i = 0; i < DataFile.all.length; i++) {
  const df = DataFile.all[i];
  map[df.name] = df;
}
DataFile.findByName = (name) => map[name];

module.exports = DataFile;
