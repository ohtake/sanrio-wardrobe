import findIndex from 'lodash/findIndex';
import take from 'lodash/take';

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
export class FlickrSrcsetProvider {
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
   * @param {Photo} photo
   * @returns {array.<{url: string, width: number, height: number, max: number}>}
   */
  static getImages(photo) {
    const maxO = Math.max(photo.data.size.width_o, photo.data.size.height_o);
    const imgsF = photo.data.images_flickr;
    const result = [];
    const availableSizes = flickrSizes.filter((s) => {
      if (imgsF.before && s.since && imgsF.before <= s.since) return false;
      if (s.suffix === 'h' && !imgsF.secret_h) return false;
      if (s.suffix === 'k' && !imgsF.secret_k) return false;
      if (s.square) return false; // Skip square size because it trims images.
      if (s.suffix === 'o') return false; // Skip original size because it may be too huge.
      return true;
    });
    availableSizes.forEach((size) => {
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
    });
    return result;
  }
}

const picasaSizes = flickrSizes.filter(s => !s.square).filter(s => s.longest).map(s => s.longest);
/**
 * It provides srcset for Picasa images.
 *
 * @example
 * images_picasa: { lh: 4, dirs: "-_rqggmnuF6k/UWF0fBPaTnI/AAAAAAAAO2w/5KIyFyTmkIA", file: "5D3D8863%2520%25281280x1920%2529.jpg" }
 *
 * Parameters:
 *   lh: number required
 *   dirs: string required
 *   file: string required
 */
export class PicasaSrcsetProvider {
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
   * @param {Photo} photo
   * @returns {array.<{url: string, width: number, height: number, max: number}>}
   */
  static getImages(photo) {
    const maxO = Math.max(photo.data.size.width_o, photo.data.size.height_o);
    const imgsP = photo.data.images_picasa;
    const indexExceeding = findIndex(picasaSizes, size => size >= maxO);
    const sizesLength = indexExceeding !== -1 ? indexExceeding + 1 : picasaSizes.length;
    const sizes = take(picasaSizes, sizesLength);
    return sizes.map((size) => {
      const max = size < maxO ? size : maxO;
      const url = PicasaSrcsetProvider.createUrl(imgsP.lh, imgsP.dirs, imgsP.file, max);
      return { url, max };
    });
  }
}

/**
 * It provides srcset for Instagram images.
 *
 * @example
 * images_instagram: { shortcode: "fA9uwTtkSN", width_t: 150, width_m: 320, width_l: 640 }
 *
 * Parameters:
 *   shortcode: string required
 *   width_t: number required
 *   width_m: number required
 *   width_l: number required
 */
export class InstagramSrcsetProvider {
  /**
   * Creates a URL for image.
   *
   * https://www.instagram.com/developer/embedding/#media_redirect
   * If you embed an Instagram image this way, you must provide clear attribution next to the image, including attribution to the original author and to Instagram, and a link to the Instagram media page.
   *
   * @param {!string} shortcode Instagram's shortcode
   * @param {!string} size Disired size of image. Value must be either of 't' (thumbnail), 'm' (medium), or 'l' (large).
   * @returns {string}
   */
  static createUrl(shortcode, size) {
    return `https://instagram.com/p/${shortcode}/media/?size=${size}`;
  }
  /**
   * @param {Photo} photo
   * @returns {array.<{url: string, width: number, height: number, max: number}>}
   */
  static getImages(photo) {
    const imgsI = photo.data.images_instagram;
    // 't' has square aspect ratio. Do not use 't' for non-square images.
    const sizes = photo.getAspectRatio() === 1 ? ['t', 'm', 'l'] : ['m', 'l'];
    return sizes.map((size) => {
      const url = InstagramSrcsetProvider.createUrl(imgsI.shortcode, size);
      return { url, width: imgsI[`width_${size}`] };
    });
  }
}
