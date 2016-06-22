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
    let srcset;
    if (this.data.images) {
      srcset = this.data.images.map(i => `${i.url} ${this.calcWidth(i)}w`);
    } else {
      srcset = [`${this.data.image} ${this.data.size.max_len}w`];
      const largeUrl = this.inferLargeImage();
      if (largeUrl !== this.data.image) {
        const largeDummy = { max: 1024 };
        srcset.push(`${largeUrl} ${this.calcWidth(largeDummy)}w`);
      }
    }
    return srcset.join(', ');
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
