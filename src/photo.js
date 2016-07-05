const flickrSizesAll = [
  { suffix: 's', longest: 75, square: true, label: 'Square' },
  { suffix: 'q', longest: 150, square: true, label: 'Large Square' },
  { suffix: 't', longest: 100, label: 'Thumbnail' },
  { suffix: 'm', longest: 240, label: 'Small' },
  { suffix: 'n', longest: 320, label: 'Small 320' },
  { suffix: '', longest: 500, label: 'Medium' },
  { suffix: 'z', longest: 640, label: 'Medium 640' },
  { suffix: 'c', longest: 800, since: '20120301', label: 'Medium 800' },
  { suffix: 'b', longest: 1024, since: '20100525', label: 'Large' },
  { suffix: 'h', longest: 1600, since: '20120301', label: 'Large 1600' },
  { suffix: 'k', longest: 2048, since: '20120301', label: 'Large 2048' },
  { suffix: 'o', customExtention: true, label: 'Original' },
];
const flickrSizes = flickrSizesAll.filter(s => ! s.square).filter(s => s.longest);

/*
Example:
images_flickr: { photo: "15605014039", farm: 6, server: 5604, secret: "3aa65f125e", secret_h: "2c5f7cc664", secret_k: "31513b8bf6" }

Parameters:
  photo: string required
  farm: number/string required
  server: number/string required
  secret: string required
  secret_h: string optional
  secret_k: string optional
  before: enum('20100525' | '20120301') optional
    If '20100525', c, b, h, and k are not available.
    If '20120301', c, h, and k are not available.
Parmeters not supported:
  secret_o: string optional
  format_o: enum('jpg' | 'gif' | 'png') optional
*/
class FlickrSrcsetProvider {
  static createUrl(photoId, farmId, serverId, secret, suffix) {
    let suffix2 = '';
    if (suffix) suffix2 = `_${suffix}`;
    return `https://farm${farmId}.staticflickr.com/${serverId}/${photoId}_${secret}${suffix2}.jpg`;
  }
  static getImages(photo) {
    const maxO = Math.max(photo.data.size.width_o, photo.data.size.height_o);
    const imgsF = photo.data.images_flickr;
    const result = [];
    for (const size of flickrSizes) {
      let secret;
      switch (size.suffix) {
        case 'h':
          if (! imgsF.secret_h) continue;
          secret = imgsF.secret_h;
          break;
        case 'k':
          if (! imgsF.secret_k) continue;
          secret = imgsF.secret_k;
          break;
        case 'o':
          throw new Error('Not supported');
        default:
          if (imgsF.before && size.since && imgsF.before <= size.since) continue;
          secret = imgsF.secret;
          break;
      }
      const url = FlickrSrcsetProvider.createUrl(imgsF.photo, imgsF.farm, imgsF.server, secret, size.suffix);
      const max = Math.min(maxO, size.longest);
      result.push({ url, max });
    }
    return result;
  }
}

export default class Photo {
  constructor(data) {
    this.data = data;
  }

  static loadPhotos(file, callback) {
    /* eslint-disable global-require */
    const actualFilename = require(`file?name=[name].json!./../data/${file}.yaml`);
    /* eslint-enable */

    window.fetch(actualFilename).then(res => {
      if (res.ok) {
        return res.json();
      }
      const error = new Error(res.statusText);
      error.response = res;
      throw error;
    })
    .then(arr => {
      const photos = arr.map(obj => new Photo(obj));
      callback(true, photos);
    })
    .catch(ex => {
      callback(false, ex);
    });
  }

  getSrcsetModel() {
    let images;
    if (this.data.images) {
      images = this.data.images.map(i => this.prepareSize(i));
    } else if (this.data.images_flickr) {
      images = FlickrSrcsetProvider.getImages(this).map(i => this.prepareSize(i));
    } else {
      images = [this.prepareSize({ url: this.data.image, max: this.data.size.max_len })];
      const largeUrl = this.inferLargeImage();
      if (largeUrl !== this.data.image) {
        const largeDummy = { url: largeUrl, max: 1024 };
        images.push(this.prepareSize(largeDummy));
      }
    }
    return images;
  }
  getLargestImageAtMost(upperWidth, upperHeight) {
    const images = this.getSrcsetModel().slice(0);
    images.sort((a, b) => a.max - b.max);
    for (let j = images.length - 1; j >= 0; j--) {
      const img = images[j];
      if (img.width <= upperWidth && img.height <= upperHeight) return img;
    }
    // Nothing matches. Return smallest one.
    return images[0];
  }
  prepareSize(image) {
    const ret = { url: image.url };
    ret.width = this.calcWidth(image);
    ret.height = this.calcHeight(image);
    ret.max = Math.max(ret.width, ret.height);
    return ret;
  }
  calcHeight(image) {
    if (image.height) return image.height;
    if (image.width) return Math.round(1.0 * this.data.size.height_o * image.width / this.data.size.width_o);
    if (image.max) {
      if (this.data.size.height_o >= this.data.size.width_o) return image.max;
      return Math.round(1.0 * this.data.size.height_o * image.max / this.data.size.width_o);
    }
    throw new Error('Cannot calc image height');
  }
  calcWidth(image) {
    if (image.width) return image.width;
    if (image.height) return Math.round(1.0 * this.data.size.width_o * image.height / this.data.size.height_o);
    if (image.max) {
      if (this.data.size.width_o >= this.data.size.height_o) return image.max;
      return Math.round(1.0 * this.data.size.width_o * image.max / this.data.size.height_o);
    }
    throw new Error('Cannot calc image width');
  }
  getSrcSet() {
    return this.getSrcsetModel().map(i => `${i.url} ${i.width}w`).join(', ');
  }
  getAspectRatio() {
    return 1.0 * this.data.size.width_o / this.data.size.height_o;
  }
  inferLargeImage() {
    const url = this.data.image;
    if (url.indexOf('.staticflickr.com/') >= 0) {
      return url.replace('.jpg', '_b.jpg'); // b => 1024
    } else if (url.indexOf('.googleusercontent.com/') >= 0) {
      return url.replace('/s500/', '/s1024/');
    }
    return url;
  }
  match(re) {
    if (this.data.title.match(re)) return true;
    if (this.data.source.author.match(re)) return true;
    for (const note of this.data.notes) {
      if (note.match(re)) return true;
    }
    return false;
  }
}
