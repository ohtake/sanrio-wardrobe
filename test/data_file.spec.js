import { describe, it } from 'mocha';
import { expect } from 'chai';
import DataFile from '../src/data_file.js';
import fs from 'fs';
import yaml from 'js-yaml';

/* eslint-disable no-unused-expressions */

function assertUniqueStringArray(array) {
  expect(array).to.be.an('array');
  array.forEach((s, i) => {
    expect(s).not.to.be.null;
    expect(s).to.be.a('string');
    const lastIndex = array.lastIndexOf(s);
    expect(i, `non-unique ${s}`).to.equal(lastIndex);
  });
}

/* eslint-disable prefer-arrow-callback, func-names */

describe('DataFile', function () {
  describe('.all', function () {
    it('should be an array', function () {
      expect(DataFile.all).to.be.an('array');
    });
    it('should have unique name', function () {
      const names = DataFile.all.map(d => d.name);
      assertUniqueStringArray(names);
    });
    it('should have unique title', function (done) {
      const names = DataFile.all.map(d => d.name);
      const promises = names.map(n => new Promise((onFulfilled /* ,onRejected */) => {
        fs.readFile(`data/${n}.yaml`, { encoding: 'utf-8' }, (err, data) => {
          expect(err).to.be.null;
          const arr = yaml.safeLoad(data);
          expect(arr).to.be.an('array');
          const titles = arr.map(p => p.title);
          assertUniqueStringArray(titles);
          onFulfilled();
        });
      }));
      Promise.all(promises).then(() => { done(); });
    });
  });
  describe('.ktKitty', function () {
    it('should be an object', function () {
      expect(DataFile.ktKitty).to.be.an('object');
    });
    it('should have members', function () {
      expect(DataFile.ktKitty.name).to.be.a('string');
      expect(DataFile.ktKitty.seriesSymbol).to.be.a('string');
      expect(DataFile.ktKitty.nameJa).to.be.a('string');
      expect(DataFile.ktKitty.nameEn).to.be.a('string');
      expect(DataFile.ktKitty.picUrl).to.be.a('string');
    });
    describe('#getDiplayName', function () {
      it('should return both english and japanese', function () {
        expect(DataFile.ktKitty.getDisplayName()).to.equal('KT キティ (Kitty)');
      });
    });
  });
});
