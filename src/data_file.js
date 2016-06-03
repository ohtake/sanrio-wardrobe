// This file is required by webpack.config.js.
// Do not use ECMAScript 6 syntax, e.g. for-of, export default, ...

class DataFile {
  constructor(name, seriesSymbol, nameJa, nameEn, picUrl) {
    this.name = name;
    this.seriesSymbol = seriesSymbol;
    this.nameJa = nameJa;
    this.nameEn = nameEn;
    this.picUrl = picUrl; // Flickr's Square 150
  }
  getDisplayName() {
    return `${this.seriesSymbol} ${this.nameJa} (${this.nameEn})`;
  }
}

DataFile.all = [
  DataFile.ktKitty = new DataFile('kt-kitty', 'KT', 'キティ', 'Kitty',
    // https://www.flickr.com/photos/ohtake_tomohiro/16492066909/
    'https://c1.staticflickr.com/9/8575/16492066909_3fcda0e4e4_q.jpg'),
  DataFile.ktMimmy = new DataFile('kt-mimmy', 'KT', 'ミミィ', 'Mimmy',
    // https://www.flickr.com/photos/ohtake_tomohiro/12611815833/
    'https://c2.staticflickr.com/4/3669/12611815833_3b5df2b753_q.jpg'),
];

const map = {};
for (let i = 0; i < DataFile.all.length; i++) {
  const df = DataFile.all[i];
  map[df.name] = df;
}
DataFile.findByName = (name) => map[name];

module.exports = DataFile;
