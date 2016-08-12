const flickrSizes = [
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

/**
 * It provides srcset for Flickr images.
 *
 * @example
 * images_flickr: { photo: "15605014039", farm: 6, server: 5604, secret: "3aa65f125e", secret_h: "2c5f7cc664", secret_k: "31513b8bf6" }
 *
 * Parameters:
 *   photo: string required
 *   farm: number/string required
 *   server: number/string required
 *   secret: string required
 *   secret_h: string optional
 *   secret_k: string optional
 *   before: enum('20100525' | '20120301') optional
 *     If '20100525', c, b, h, and k are not available.
 *     If '20120301', c, h, and k are not available.
 * Parmeters not supported:
 *   secret_o: string optional
 *   format_o: enum('jpg' | 'gif' | 'png') optional
 */
class FlickrSrcsetProvider {
  /**
   * @param {string} photoId
   * @param {number} farmId
   * @param {number} serverId
   * @param {string} secret
   * @param {string} suffix
   * @returns {string}
   */
  static createUrl(photoId, farmId, serverId, secret, suffix) {
    let suffix2 = '';
    if (suffix) suffix2 = `_${suffix}`;
    return `https://farm${farmId}.staticflickr.com/${serverId}/${photoId}_${secret}${suffix2}.jpg`;
  }
  /**
   * @param {object} photo
   * @returns {array.<{url: string, width: number, height: number, max: number}>}
   */
  static getImages(photo) {
    const maxO = Math.max(photo.data.size.width_o, photo.data.size.height_o);
    const imgsF = photo.data.images_flickr;
    const result = [];
    const availableSizes = flickrSizes.filter(s => {
      if (imgsF.before && s.since && imgsF.before <= s.since) return false;
      if (s.suffix === 'h' && !imgsF.secret_h) return false;
      if (s.suffix === 'k' && !imgsF.secret_k) return false;
      if (s.square) return false; // Skip square size because it trims images.
      if (s.suffix === 'o') return false; // Skip original size because it may be too huge.
      return true;
    });
    for (const size of availableSizes) {
      let secret;
      switch (size.suffix) {
        case 'h':
          secret = imgsF.secret_h;
          break;
        case 'k':
          secret = imgsF.secret_k;
          break;
        default:
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

const picasaSizes = flickrSizes.filter(s => !s.square).filter(s => s.longest).map(s => s.longest);
/**
 * It provides srcset for Flickr images.
 *
 * @example
 * images_picasa: { lh: 4, dirs: "-_rqggmnuF6k/UWF0fBPaTnI/AAAAAAAAO2w/5KIyFyTmkIA", file: "5D3D8863%2520%25281280x1920%2529.jpg" }
 *
 * Parameters:
 *   lh: number required
 *   dirs: string required
 *   file: string required
 */
class PicasaSrcsetProvider {
  /**
   * @param {number} lh
   * @param {string} dirs
   * @param {string} file
   * @param {number} size
   * @returns {string}
   */
  static createUrl(lh, dirs, file, size) {
    return `https://lh${lh}.googleusercontent.com/${dirs}/s${size}/${file}`;
  }
  /**
   * @param {object} photo
   * @returns {array.<{url: string, width: number, height: number, max: number}>}
   */
  static getImages(photo) {
    const maxO = Math.max(photo.data.size.width_o, photo.data.size.height_o);
    const imgsP = photo.data.images_picasa;
    const result = [];
    for (const size of picasaSizes) {
      if (size >= maxO) {
        const url = PicasaSrcsetProvider.createUrl(imgsP.lh, imgsP.dirs, imgsP.file, maxO);
        result.push({ url, max: maxO });
        break;
      }
      const url = PicasaSrcsetProvider.createUrl(imgsP.lh, imgsP.dirs, imgsP.file, size);
      result.push({ url, max: size });
    }
    return result;
  }
}

export default class Photo {
  /**
   * @param {object} data An element of data array.
   */
  constructor(data) {
    this.data = data;
  }

  /**
   * @callback loadPhotosCallback
   * @param {boolean} ok
   * @param {array.<Photo>|Error} result
   */
  /**
   * @param {string} file filename to load. e.g. kt-kitty
   * @param {loadPhotosCallback} callback
   */
  // TODO Use Promise instead of callback
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

  /**
   * @returns {array.<{url: string, width: number, height: number, max: number}>}
   */
  getSrcsetModel() {
    let images;
    if (this.data.images) {
      images = this.data.images.map(i => this.prepareSize(i));
    } else if (this.data.images_flickr) {
      images = FlickrSrcsetProvider.getImages(this).map(i => this.prepareSize(i));
    } else if (this.data.images_picasa) {
      images = PicasaSrcsetProvider.getImages(this).map(i => this.prepareSize(i));
    } else {
      throw new Error('images not specified');
    }
    return images;
  }
  /**
   * @param {number} upperWidth
   * @param {number} upperHeight
   * @returns {{url: string, width: number, height: number, max: number}}
   */
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
  /**
   * @param {{url: string, width: number, height: number, max: number}} image
   * @returns {{url: string, width: number, height: number, max: number}}
   */
  prepareSize(image) {
    const ret = { url: image.url };
    ret.width = this.calcWidthOrHeight(image, true);
    ret.height = this.calcWidthOrHeight(image, false);
    ret.max = Math.max(ret.width, ret.height);
    return ret;
  }
  /**
   * @param {{url: string, width: number, height: number, max: number}} image
   * @param {boolean} isWidth
   * @returns {number}
   */
  calcWidthOrHeight(image, isWidth) {
    const wanted = isWidth ? 'width' : 'height';
    if (image[wanted]) return image[wanted];
    const other = isWidth ? 'height' : 'width';
    const ratio = isWidth ? this.getAspectRatio() : 1 / this.getAspectRatio();
    if (image[other]) return Math.round(image[other] * ratio);
    if (image.max) {
      if (ratio >= 1) return image.max;
      return Math.round(image.max * ratio);
    }
    throw new Error('Cannot calc image width/height');
  }
  /**
   * @returns {string}
   */
  getSrcSet() {
    return this.getSrcsetModel().map(i => `${i.url} ${i.width}w`).join(', ');
  }
  /**
   * @returns {number}
   */
  getAspectRatio() {
    return this.data.size.width_o / this.data.size.height_o;
  }
  /**
   * @param {RegExp} re
   * @returns {boolean}
   */
  match(re) {
    if (this.data.title.match(re)) return true;
    if (this.data.source.author.match(re)) return true;
    for (const note of this.data.notes) {
      if (note.match(re)) return true;
    }
    return false;
  }
}
