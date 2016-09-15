export default class DataFile {
  /**
   * @param {string} name File name of data File
   * @param {string} seriesSymbol
   * @param {string} nameJa
   * @param {string} nameEn
   * @param {string} picUrl URL of the image. Use Flickr's Square 150 format.
   */
  constructor(name, seriesSymbol, nameJa, nameEn, picUrl) {
    this.name = name;
    this.seriesSymbol = seriesSymbol;
    this.nameJa = nameJa;
    this.nameEn = nameEn;
    this.picUrl = picUrl;
  }
  /**
   * @returns {string}
   */
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
  DataFile.wiMell = new DataFile('wi-mell', 'WI', 'メル', 'Mell',
    // https://www.flickr.com/photos/ohtake_tomohiro/15033242479/
    'https://c2.staticflickr.com/4/3883/15033242479_45ded95457_q.jpg'),
  DataFile.xoBadtzmaru = new DataFile('xo-badtzmaru', 'XO', 'ばつ丸', 'Badtz-Maru',
    // https://www.flickr.com/photos/ohtake_tomohiro/11150739286/
    'https://c2.staticflickr.com/6/5477/11150739286_bc5251bf3d_q.jpg'),
];

const map = {};
for (const df of DataFile.all) {
  map[df.name] = df;
}
/**
 * @param {string} name e.g. kt-kitty
 * @returns {DataFile}
 */
DataFile.findByName = name => map[name];
