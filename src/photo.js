import findLast from 'lodash/findLast';

import { FlickrSrcsetProvider, PicasaSrcsetProvider, InstagramSrcsetProvider } from './srcset_providers';

export default class Photo {
  /**
   * @param {object} data An element of data array.
   */
  constructor(data) {
    this.data = data;
  }

  /**
   * @param {string} file filename to load. e.g. kt-kitty
   * @returns {Promise.<Photo[]>} array of photos
   */
  static loadPhotos(file) {
    /* eslint-disable global-require, import/no-dynamic-require */
    const actualFilename = require(`file-loader?name=[name].json!./../data/${file}.yaml`);
    /* eslint-enable */

    return window.fetch(actualFilename).then((res) => {
      if (res.ok) {
        return res.json();
      }
      throw new Error(`${res.statusText}: ${res.url}`);
    }).then((arr) => {
      const photos = arr.map(obj => new Photo(obj));
      return Promise.resolve(photos);
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
    } else if (this.data.images_instagram) {
      images = InstagramSrcsetProvider.getImages(this).map(i => this.prepareSize(i));
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
    const largest = findLast(images, img => img.width <= upperWidth && img.height <= upperHeight);
    if (largest) return largest;
    // Nothing matches. Return smallest one.
    return images[0];
  }
  /**
   * @param {{url: string, width: ?number, height: ?number, max: ?number}} image
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
   * @param {{url: string, width: ?number, height: ?number, max: ?number}} image
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
    if (this.data.notes.find(note => note.match(re))) return true;
    return false;
  }
}
