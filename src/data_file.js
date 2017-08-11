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
  DataFile.boRibbon = new DataFile('bo-ribbon', 'BO', 'りぼん', 'Bonbonribbon',
    // https://www.flickr.com/photos/ohtake_tomohiro/26615555253/
    'https://c2.staticflickr.com/8/7356/26615555253_f77c7410de_q.jpg'),
  DataFile.jlRuby = new DataFile('jl-ruby', 'JL', 'ルビー', 'Ruby',
    // https://www.flickr.com/photos/ohtake_tomohiro/30901115623/
    'https://c1.staticflickr.com/1/756/30901115623_e7cf5c0feb_q.jpg'),
  DataFile.ktKitty = new DataFile('kt-kitty', 'KT', 'キティ', 'Kitty',
    // https://www.flickr.com/photos/ohtake_tomohiro/16492066909/
    'https://c1.staticflickr.com/9/8575/16492066909_3fcda0e4e4_q.jpg'),
  DataFile.ktMimmy = new DataFile('kt-mimmy', 'KT', 'ミミィ', 'Mimmy',
    // https://www.flickr.com/photos/ohtake_tomohiro/12611815833/
    'https://c2.staticflickr.com/4/3669/12611815833_3b5df2b753_q.jpg'),
  DataFile.omMonkichi = new DataFile('om-monkichi', 'OM', 'もんきち', 'Monkichi',
    // https://www.flickr.com/photos/ohtake_tomohiro/8815679895/
    'https://c2.staticflickr.com/8/7321/8815679895_2d371a9d73_q.jpg'),
  DataFile.pcPochacco = new DataFile('pc-pochacco', 'PC', 'ポチャッコ', 'Pochacco',
    // https://www.flickr.com/photos/ohtake_tomohiro/14753386901/
    'https://c1.staticflickr.com/3/2901/14753386901_f334102638_q.jpg'),
  DataFile.tsKikiLala = new DataFile('ts-kikilala', 'TS', 'キキ・ララ', 'Kiki & Lala',
    // https://www.flickr.com/photos/ohtake_tomohiro/34278547216/
    'https://c1.staticflickr.com/3/2853/34278547216_91403ea35f_q.jpg'),
  DataFile.usUsahana = new DataFile('us-usahana', 'US', 'ウサハナ', 'Usahana',
    // https://www.flickr.com/photos/ohtake_tomohiro/35231231671/
    'https://c1.staticflickr.com/5/4245/35231231671_32d4e72ea1_q.jpg'),
  DataFile.wiMell = new DataFile('wi-mell', 'WI', 'メル', 'Mell',
    // https://www.flickr.com/photos/ohtake_tomohiro/15033242479/
    'https://c2.staticflickr.com/4/3883/15033242479_45ded95457_q.jpg'),
  DataFile.xoBadtzmaru = new DataFile('xo-badtzmaru', 'XO', 'ばつ丸', 'Badtz-Maru',
    // https://www.flickr.com/photos/ohtake_tomohiro/11150739286/
    'https://c2.staticflickr.com/6/5477/11150739286_bc5251bf3d_q.jpg'),
];

const map = {};
DataFile.all.forEach((df) => {
  map[df.name] = df;
});
/**
 * @param {string} name e.g. kt-kitty
 * @returns {DataFile}
 */
DataFile.findByName = name => map[name];
