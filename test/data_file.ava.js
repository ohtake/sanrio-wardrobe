import test from 'ava';

import fs from 'fs';
import yaml from 'js-yaml';

import DataFile from '../src/data_file.js';

function assertUniqueStringArray(t, array) {
  t.true(Array.isArray(array));
  array.forEach((s, i) => {
    t.not(s, null);
    t.is(typeof s, 'string');
    const lastIndex = array.lastIndexOf(s);
    t.is(i, lastIndex, `non-unique ${s}`);
  });
}

test('DetailFile.all should have unique name', t => {
  const names = DataFile.all.map(d => d.name);
  assertUniqueStringArray(t, names);
});

test('each yaml file should have unique title', t => {
  const names = DataFile.all.map(d => d.name);
  return Promise.all(names.map(n => new Promise((onFulfilled, onRejected) => {
    fs.readFile(`../data/${n}.yaml`, { encoding: 'utf-8' }, (err, data) => {
      if (err) {
        onRejected(err);
        return;
      }
      const arr = yaml.safeLoad(data);
      t.true(Array.isArray(arr));
      const titles = arr.map(p => p.title);
      assertUniqueStringArray(t, titles);
      onFulfilled();
    });
  })));
});

test('DetailFile.ktKitty should have members', t => {
  t.is(typeof DataFile.ktKitty, 'object');
  t.is(typeof DataFile.ktKitty.name, 'string');
  t.is(typeof DataFile.ktKitty.seriesSymbol, 'string');
  t.is(typeof DataFile.ktKitty.nameJa, 'string');
  t.is(typeof DataFile.ktKitty.nameEn, 'string');
  t.is(typeof DataFile.ktKitty.picUrl, 'string');
});

test('DetailFile#getDiplayName should return both english and japanese', t => {
  t.is(DataFile.ktKitty.getDisplayName(), 'KT キティ (Kitty)');
});
