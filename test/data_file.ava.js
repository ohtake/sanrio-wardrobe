import test from 'ava';

import fs from 'fs';
import util from 'util';
import yaml from 'js-yaml';

import DataFile from '../src/data_file';
import RepresentiveColors from '../src/colors';

const readFilePromisified = util.promisify(fs.readFile);

function assertUniqueStringArray(t, array) {
  t.true(Array.isArray(array));
  array.forEach((s, i) => {
    t.not(s, null);
    t.is(typeof s, 'string');
    const lastIndex = array.lastIndexOf(s);
    t.is(i, lastIndex, `non-unique ${s}`);
  });
}

/** @test {DataFile} */
test('DataFile.all should have unique name', t => {
  const names = DataFile.all.map(d => d.name);
  assertUniqueStringArray(t, names);
});

/** @test {DataFile} */
test('each yaml file should have unique title', t => {
  const names = DataFile.all.map(d => d.name);
  return Promise.all(names.map(async n => {
    const data = await readFilePromisified(`data/${n}.yaml`, { encoding: 'utf-8' });
    const arr = yaml.safeLoad(data);
    t.true(Array.isArray(arr));
    const titles = arr.map(p => p.title);
    assertUniqueStringArray(t, titles);
  }));
});

/** @test {DataFile} */
test('each yaml file should have consistent colors', t => {
  const names = DataFile.all.map(d => d.name);
  return Promise.all(names.map(async n => {
    const data = await readFilePromisified(`data/${n}.yaml`, { encoding: 'utf-8' });
    const arr = yaml.safeLoad(data);
    arr.forEach(elem => {
      const { colors } = elem;
      assertUniqueStringArray(t, colors);
      colors.forEach(c => {
        t.truthy(RepresentiveColors.findById(c));
      });
    });
  }));
});

/** @test {DataFile} */
test('DataFile.ktKitty should have members', t => {
  t.is(typeof DataFile.ktKitty, 'object');
  t.is(typeof DataFile.ktKitty.name, 'string');
  t.is(typeof DataFile.ktKitty.seriesSymbol, 'string');
  t.is(typeof DataFile.ktKitty.nameJa, 'string');
  t.is(typeof DataFile.ktKitty.nameEn, 'string');
  t.is(typeof DataFile.ktKitty.picUrl, 'string');
});

/** @test {DataFile#getDisplayName} */
test('DataFile#getDisplayName should return both english and japanese', t => {
  t.is(DataFile.ktKitty.getDisplayName(), 'KT キティ (Kitty)');
});
