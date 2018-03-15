#!./node_modules/.bin/babel-node

import fs from 'fs';
import util from 'util';
import yaml from 'js-yaml';
import mkdirp from 'mkdirp';
import clone from 'lodash/clone';

import Colors from '../src/colors';
import DataFile from '../src/data_file';

const readFileP = util.promisify(fs.readFile);
const writeFileP = util.promisify(fs.writeFile);
const mkdirpP = util.promisify(mkdirp);

async function readAllPhotoData() {
  const pairs = await Promise.all(DataFile.all.map(async (df) => {
    const data = await readFileP(`data/${df.name}.yaml`, { encoding: 'utf-8' });
    return [df, yaml.safeLoad(data)];
  }));
  return pairs.reduce((prevMap, currentPair) => {
    const df = currentPair[0];
    const data = currentPair[1];
    // eslint-disable-next-line no-param-reassign
    prevMap[df.name] = data;
    return prevMap;
  }, {});
}

async function main() {
  const photos = await readAllPhotoData();
  const stats = {
    count: {},
    color: {},
    author: {},
  };
  const colorInitialValue = {};
  Colors.all.forEach((c) => {
    colorInitialValue[c.id] = 0;
  });
  DataFile.all.forEach((df) => {
    stats.count[df.name] = photos[df.name].length;
    stats.color[df.name] = photos[df.name].reduce((c, p) => {
      p.colors.forEach((n) => {
        // eslint-disable-next-line no-param-reassign
        c[n] += 1;
      });
      return c;
    }, clone(colorInitialValue));
    photos[df.name].forEach((p) => {
      if (stats.author[p.source.author]) {
        stats.author[p.source.author] += 1;
      } else {
        stats.author[p.source.author] = 1;
      }
    });
  });
  await mkdirpP('assets');
  await writeFileP('assets/statistics.json', JSON.stringify(stats));
}

main();
