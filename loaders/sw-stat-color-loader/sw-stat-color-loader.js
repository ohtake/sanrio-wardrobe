// ES5 only in Webpack 1

const fs = require('fs');
const yaml = require('js-yaml');

function loader(source) {
  this.cacheable();
  // TODO async
  const index = yaml.safeLoad(fs.readFileSync('./data/index.yml'));
  const colorCount = {};
  for (let i = 0; i < index.length; i++) {
    const file = `./data/${index[i].name}.yaml`;
    this.addDependency(file);
    // TODO async
    const data = yaml.safeLoad(fs.readFileSync(file));
    for (let j = 0; j < data.length; j++) {
      const photo = data[j];
      for (let k = 0; k < photo.colors.length; k++) {
        const color = photo.colors[k];
        let prevCount = colorCount[color];
        if (! colorCount[color]) prevCount = 0;
        colorCount[color] = prevCount + 1;
      }
    }
  }
  // console.log(colorCount);
  // must be an array, not sure why
  return JSON.stringify([colorCount], undefined, '\t');
}

module.exports = loader;
