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

  getLargestImageAtMost(upperWidth, upperHeight) {
    let images;
    if (this.data.images) {
      images = this.data.images.map(i => this.prepareSize(i));
    } else {
      images = [this.prepareSize({ url: this.data.image, max: this.data.size.max_len })];
      const largeUrl = this.inferLargeImage();
      if (largeUrl !== this.data.image) {
        const largeDummy = { url: largeUrl, max: 1024 };
        images.push(this.prepareSize(largeDummy));
      }
    }
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
