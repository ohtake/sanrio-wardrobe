import yaml from 'js-yaml';

/* eslint-disable no-unused-vars */
// Polyfills are not used but required
import Promise from 'es6-promise'; // For older browsers http://caniuse.com/#feat=promises
import fetch from 'whatwg-fetch';
/* eslint-enable */

export default class Photo {
  constructor(data) {
    this.data = data;
  }

  static loadPhotos(file, callback) {
    window.fetch(`data/${file}.yaml`).then(res => {
      if (res.ok) {
        return res.text();
      }
      const error = new Error(res.statusText);
      error.response = res;
      throw error;
    })
    .then(text => {
      const arr = yaml.load(text);
      const photos = arr.map(obj => new Photo(obj));
      callback(true, photos);
    })
    .catch(ex => {
      callback(false, ex);
    });
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
}
