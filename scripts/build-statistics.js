#!./node_modules/.bin/babel-node

import fs from 'fs';
import util from 'util';
import yaml from 'js-yaml';
import mkdirp from 'mkdirp';
import clone from 'lodash/clone';

import Colors from '../src/colors';
import DataFile from '../src/data_file';

const readFilePromisified = util.promisify(fs.readFile);

const photos = {};

const promisesLoad = DataFile.all.map(async (df) => {
  const data = await readFilePromisified(`data/${df.name}.yaml`, { encoding: 'utf-8' });
  photos[df.name] = yaml.safeLoad(data);
});

Promise.all(promisesLoad).then(() => {
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
  mkdirp.sync('assets');
  fs.writeFileSync('assets/statistics.json', JSON.stringify(stats));
});
