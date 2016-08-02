/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

import { describe, it } from 'mocha';
import { expect } from 'chai';
import cloneDeep from 'lodash/cloneDeep';

import Photo from '../src/photo.js';

const photoSrcsetLandscape = {
  title: 'srcset landscape',
  images: [
    { url: 'https://placehold.it/600x400', height: 400 },
    { url: 'https://placehold.it/900x600', width: 900 },
    { url: 'https://placehold.it/1200x800', max: 1200 },
  ],
  source: { author: 'brent', license: '', url: 'https://placehold.it/' },
  size: { width_o: 1200, height_o: 800 },
  colors: ['red'],
  notes: ['note1', 'note2'],
};
const photoSrcsetPortrait = {
  title: 'srcset portrait',
  images: [
    { url: 'https://placehold.it/400x600', height: 600 },
    { url: 'https://placehold.it/600x900', width: 600 },
    { url: 'https://placehold.it/800x1200', max: 1200 },
  ],
  source: { author: 'brent', license: '', url: 'https://placehold.it/' },
  size: { width_o: 800, height_o: 1200 },
  colors: [],
  notes: [],
};
const photoSrcsetSquare = {
  title: 'srcset square',
  images: [
    { url: 'https://placehold.it/600x600', height: 600 },
    { url: 'https://placehold.it/900x900', width: 900 },
    { url: 'https://placehold.it/1200x1200', max: 1200 },
  ],
  source: { author: 'brent', license: '', url: 'https://placehold.it/' },
  size: { width_o: 1200, height_o: 1200 },
  colors: [],
  notes: [],
};
const photoFlickrLandscape = {
  title: 'flickr images landscape',
  images_flickr: { photo: '15605014039', farm: 6, server: 5604, secret: '3aa65f125e', secret_h: '2c5f7cc664', secret_k: '31513b8bf6' },
  source: { author: 'ohtake', license: 'CC BY-SA 2.0', url: 'https://www.flickr.com/photos/ohtake_tomohiro/15605014039' },
  size: { width_o: 5760, height_o: 3840 },
  colors: [],
  notes: [],
};
const photoFlickrPortrait = {
  title: 'flickr images portrait',
  images_flickr: { photo: '24326364382', farm: 2, server: 1623, secret: '2a00bf3387', secret_h: '988fe74e0e', secret_k: '1d900d84de' },
  source: { author: 'ohtake', license: 'CC BY-SA 2.0', url: 'https://www.flickr.com/photos/ohtake_tomohiro/24326364382' },
  size: { width_o: 3840, height_o: 5760 },
  colors: [],
  notes: [],
};
const photoFlickrTooSmall = {
  title: '24214891894',
  images_flickr: { photo: '24214891894', farm: 2, server: 1457, secret: 'fb5e07fc69', before: '20100525' },
  source: { author: 'jj lai', license: '', url: 'https://www.flickr.com/photos/laijj/24214891894/' },
  size: { width_o: 538, height_o: 404 },
  colors: [],
  notes: [],
};
const photoPicasa = {
  title: '5D3D4777 (1920x1280)',
  images_picasa: { lh: 5, dirs: '-faW8atAcpVg/UUUpf0lwHdI/AAAAAAAANkw/YkGKWFcgyIk', file: '5D3D4777%2520%25281920x1280%2529.jpg' },
  source: { author: 'ohtake', license: 'CC BY-SA 2.0', url: 'https://picasaweb.google.com/lh/photo/0PFa4BsUBZFjugZvBmr8QNMTjNZETYmyPJy0liipFm0?feat=embedwebsite' },
  size: { width_o: 1920, height_o: 1280 },
  colors: [],
  notes: [],
};

/* eslint-disable no-unused-expressions */
/* eslint-disable prefer-arrow-callback, func-names */

describe('Photo', function () {
  describe('#getAspectRatio', function () {
    it('should return a number more than 1 for landscape photos', function () {
      const photo = new Photo(photoSrcsetLandscape);
      expect(photo.getAspectRatio()).to.equal(1.5);
    });
  });
  describe('#match', function () {
    const photo = new Photo(photoSrcsetLandscape);
    it('should match title', function () {
      expect(photo.match(/landscape/)).to.be.true;
    });
    it('should not match url', function () {
      expect(photo.match(/placehold/)).to.be.false;
    });
    it('should match author', function () {
      expect(photo.match(/brent/)).to.be.true;
    });
    it('should not match color', function () {
      expect(photo.match(/red/)).to.be.false;
    });
    it('should match notes', function () {
      expect(photo.match(/note1/)).to.be.true;
      expect(photo.match(/note2/)).to.be.true;
    });
  });
  describe('#calcWidthOrHeight', function () {
    it('should calculate width from either width, height, or max', function () {
      const photoL = new Photo(photoSrcsetLandscape);
      const photoP = new Photo(photoSrcsetPortrait);
      const photoS = new Photo(photoSrcsetSquare);
      expect(photoL.calcWidthOrHeight(photoL.data.images[0], true)).to.equal(600);
      expect(photoL.calcWidthOrHeight(photoL.data.images[1], true)).to.equal(900);
      expect(photoL.calcWidthOrHeight(photoL.data.images[2], true)).to.equal(1200);
      expect(photoP.calcWidthOrHeight(photoP.data.images[0], true)).to.equal(400);
      expect(photoP.calcWidthOrHeight(photoP.data.images[1], true)).to.equal(600);
      expect(photoP.calcWidthOrHeight(photoP.data.images[2], true)).to.equal(800);
      expect(photoS.calcWidthOrHeight(photoS.data.images[0], true)).to.equal(600);
      expect(photoS.calcWidthOrHeight(photoS.data.images[1], true)).to.equal(900);
      expect(photoS.calcWidthOrHeight(photoS.data.images[2], true)).to.equal(1200);
    });
    it('should calculate height from either width, height, or max', function () {
      const photoL = new Photo(photoSrcsetLandscape);
      const photoP = new Photo(photoSrcsetPortrait);
      const photoS = new Photo(photoSrcsetSquare);
      expect(photoL.calcWidthOrHeight(photoL.data.images[0], false)).to.equal(400);
      expect(photoL.calcWidthOrHeight(photoL.data.images[1], false)).to.equal(600);
      expect(photoL.calcWidthOrHeight(photoL.data.images[2], false)).to.equal(800);
      expect(photoP.calcWidthOrHeight(photoP.data.images[0], false)).to.equal(600);
      expect(photoP.calcWidthOrHeight(photoP.data.images[1], false)).to.equal(900);
      expect(photoP.calcWidthOrHeight(photoP.data.images[2], false)).to.equal(1200);
      expect(photoS.calcWidthOrHeight(photoS.data.images[0], false)).to.equal(600);
      expect(photoS.calcWidthOrHeight(photoS.data.images[1], false)).to.equal(900);
      expect(photoS.calcWidthOrHeight(photoS.data.images[2], false)).to.equal(1200);
    });
  });
  describe('#getSrcSet', function () {
    it('should not modify original data', function () {
      const original = cloneDeep(photoSrcsetLandscape);
      const photo = new Photo(photoSrcsetLandscape);
      photo.getSrcSet();
      expect(photo.data).to.deep.equal(original);
    });
    it('should return for srcset', function () {
      const photo = new Photo(photoSrcsetLandscape);
      expect(photo.getSrcSet()).to.equal('https://placehold.it/600x400 600w, https://placehold.it/900x600 900w, https://placehold.it/1200x800 1200w');
    });
    it('should return for flickr landscape images', function () {
      const photo = new Photo(photoFlickrLandscape);
      expect(photo.getSrcSet()).to.equal([
        'https://farm6.staticflickr.com/5604/15605014039_3aa65f125e_t.jpg 100w',
        'https://farm6.staticflickr.com/5604/15605014039_3aa65f125e_m.jpg 240w',
        'https://farm6.staticflickr.com/5604/15605014039_3aa65f125e_n.jpg 320w',
        'https://farm6.staticflickr.com/5604/15605014039_3aa65f125e.jpg 500w',
        'https://farm6.staticflickr.com/5604/15605014039_3aa65f125e_z.jpg 640w',
        'https://farm6.staticflickr.com/5604/15605014039_3aa65f125e_c.jpg 800w',
        'https://farm6.staticflickr.com/5604/15605014039_3aa65f125e_b.jpg 1024w',
        'https://farm6.staticflickr.com/5604/15605014039_2c5f7cc664_h.jpg 1600w',
        'https://farm6.staticflickr.com/5604/15605014039_31513b8bf6_k.jpg 2048w',
      ].join(', '));
    });
    it('should return for flickr portrait images', function () {
      const photo = new Photo(photoFlickrPortrait);
      expect(photo.getSrcSet()).to.equal([
        'https://farm2.staticflickr.com/1623/24326364382_2a00bf3387_t.jpg 67w',
        'https://farm2.staticflickr.com/1623/24326364382_2a00bf3387_m.jpg 160w',
        'https://farm2.staticflickr.com/1623/24326364382_2a00bf3387_n.jpg 213w',
        'https://farm2.staticflickr.com/1623/24326364382_2a00bf3387.jpg 333w',
        'https://farm2.staticflickr.com/1623/24326364382_2a00bf3387_z.jpg 427w',
        'https://farm2.staticflickr.com/1623/24326364382_2a00bf3387_c.jpg 533w', // 534 is corrent in Flickr. See <https://twitter.com/ohtaket/status/750318571926859776>
        'https://farm2.staticflickr.com/1623/24326364382_2a00bf3387_b.jpg 683w',
        'https://farm2.staticflickr.com/1623/24326364382_988fe74e0e_h.jpg 1067w',
        'https://farm2.staticflickr.com/1623/24326364382_1d900d84de_k.jpg 1365w',
      ].join(', '));
    });
    it('should return for flickr too small', function () {
      const photo = new Photo(photoFlickrTooSmall);
      expect(photo.getSrcSet()).to.equal([
        'https://farm2.staticflickr.com/1457/24214891894_fb5e07fc69_t.jpg 100w',
        'https://farm2.staticflickr.com/1457/24214891894_fb5e07fc69_m.jpg 240w',
        'https://farm2.staticflickr.com/1457/24214891894_fb5e07fc69_n.jpg 320w',
        'https://farm2.staticflickr.com/1457/24214891894_fb5e07fc69.jpg 500w',
        'https://farm2.staticflickr.com/1457/24214891894_fb5e07fc69_z.jpg 538w',
      ].join(', '));
    });
    it('should return for picasa', function () {
      const photo = new Photo(photoPicasa);
      expect(photo.getSrcSet()).to.equal([
        'https://lh5.googleusercontent.com/-faW8atAcpVg/UUUpf0lwHdI/AAAAAAAANkw/YkGKWFcgyIk/s100/5D3D4777%2520%25281920x1280%2529.jpg 100w',
        'https://lh5.googleusercontent.com/-faW8atAcpVg/UUUpf0lwHdI/AAAAAAAANkw/YkGKWFcgyIk/s240/5D3D4777%2520%25281920x1280%2529.jpg 240w',
        'https://lh5.googleusercontent.com/-faW8atAcpVg/UUUpf0lwHdI/AAAAAAAANkw/YkGKWFcgyIk/s320/5D3D4777%2520%25281920x1280%2529.jpg 320w',
        'https://lh5.googleusercontent.com/-faW8atAcpVg/UUUpf0lwHdI/AAAAAAAANkw/YkGKWFcgyIk/s500/5D3D4777%2520%25281920x1280%2529.jpg 500w',
        'https://lh5.googleusercontent.com/-faW8atAcpVg/UUUpf0lwHdI/AAAAAAAANkw/YkGKWFcgyIk/s640/5D3D4777%2520%25281920x1280%2529.jpg 640w',
        'https://lh5.googleusercontent.com/-faW8atAcpVg/UUUpf0lwHdI/AAAAAAAANkw/YkGKWFcgyIk/s800/5D3D4777%2520%25281920x1280%2529.jpg 800w',
        'https://lh5.googleusercontent.com/-faW8atAcpVg/UUUpf0lwHdI/AAAAAAAANkw/YkGKWFcgyIk/s1024/5D3D4777%2520%25281920x1280%2529.jpg 1024w',
        'https://lh5.googleusercontent.com/-faW8atAcpVg/UUUpf0lwHdI/AAAAAAAANkw/YkGKWFcgyIk/s1600/5D3D4777%2520%25281920x1280%2529.jpg 1600w',
        'https://lh5.googleusercontent.com/-faW8atAcpVg/UUUpf0lwHdI/AAAAAAAANkw/YkGKWFcgyIk/s1920/5D3D4777%2520%25281920x1280%2529.jpg 1920w',
      ].join(', '));
    });
  });
  describe('#prepareSize', function () {
    it('should fill all of width, height, or max', function () {
      const photoL = new Photo(photoSrcsetLandscape);
      let r;
      r = photoL.prepareSize(photoL.data.images[0]);
      expect(r).to.have.property('url');
      expect(r).to.have.property('width', 600);
      expect(r).to.have.property('height', 400);
      expect(r).to.have.property('max', 600);
      r = photoL.prepareSize(photoL.data.images[1]);
      expect(r).to.have.property('url');
      expect(r).to.have.property('width', 900);
      expect(r).to.have.property('height', 600);
      expect(r).to.have.property('max', 900);
      r = photoL.prepareSize(photoL.data.images[2]);
      expect(r).to.have.property('url');
      expect(r).to.have.property('width', 1200);
      expect(r).to.have.property('height', 800);
      expect(r).to.have.property('max', 1200);
    });
  });
  describe('#getLargestImageAtMost', function () {
    it('should return the most suitable one', function () {
      const photoL = new Photo(photoSrcsetLandscape);
      expect(photoL.getLargestImageAtMost(100, 100)).to.have.property('url', 'https://placehold.it/600x400');
      expect(photoL.getLargestImageAtMost(600, 400)).to.have.property('url', 'https://placehold.it/600x400');
      expect(photoL.getLargestImageAtMost(10000, 400)).to.have.property('url', 'https://placehold.it/600x400');
      expect(photoL.getLargestImageAtMost(600, 10000)).to.have.property('url', 'https://placehold.it/600x400');
      expect(photoL.getLargestImageAtMost(900, 599)).to.have.property('url', 'https://placehold.it/600x400');
      expect(photoL.getLargestImageAtMost(899, 600)).to.have.property('url', 'https://placehold.it/600x400');
      expect(photoL.getLargestImageAtMost(900, 600)).to.have.property('url', 'https://placehold.it/900x600');
      expect(photoL.getLargestImageAtMost(10000, 10000)).to.have.property('url', 'https://placehold.it/1200x800');
    });
  });
});
