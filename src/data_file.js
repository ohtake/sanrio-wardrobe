import dataFiles from './../data/index.yml';

export default class DataFile {
  constructor(data) {
    this.name = data.name;
    this.seriesSymbol = data.seriesSymbol;
    this.nameJa = data.nameJa;
    this.nameEn = data.nameEn;
    this.picUrl = data.picUrl; // Flickr's Square 150
  }
  getDisplayName() {
    return `${this.seriesSymbol} ${this.nameJa} (${this.nameEn})`;
  }
}


DataFile.all = dataFiles.map(f => new DataFile(f));

const map = {};
for (const df of DataFile.all) {
  map[df.name] = df;
}
DataFile.findByName = (name) => map[name];
