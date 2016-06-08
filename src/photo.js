export default class Photo {
  constructor(data) {
    this.data = data;
  }

  static loadPhotos(file, callback) {
    /* eslint-disable global-require */
    const actualFilename = require(`file?name=[name]-[hash:6].json!./../data/${file}.yaml`);
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
