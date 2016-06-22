import { describe, it } from 'mocha';
import { expect } from 'chai';
import Photo from '../src/photo.js';

const photoLegacy = {
  title: 'legacy',
  image: 'https://placehold.it/300x200',
  source: { author: 'brent', license: '', url: 'https://placehold.it/' },
  size: { width_o: 600, height_o: 400, max_len: 300 },
  colors: ['red'],
  notes: ['note1', 'note2'],
};
const photoLegacyFlickr = {
  title: 'legacy flickr',
  image: 'https://farm6.staticflickr.com/5604/15605014039_3aa65f125e.jpg',
  source: { author: 'ohtake', license: 'CC BY-SA 2.0', url: 'https://www.flickr.com/photos/ohtake_tomohiro/15605014039' },
  size: { width_o: 5760, height_o: 3840, max_len: 500 },
  colors: [],
  notes: [],
};

const photoSrcsetLandscape = {
  title: 'srcset landscape',
  images: [
    { url: 'https://placehold.it/600x400', height: 400 },
    { url: 'https://placehold.it/900x600', width: 900 },
    { url: 'https://placehold.it/1200x800', max: 1200 },
  ],
  source: { author: 'brent', license: '', url: 'https://placehold.it/' },
  size: { width_o: 1200, height_o: 800 },
  colors: [],
  notes: [],
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

/* eslint-disable no-unused-expressions */
/* eslint-disable prefer-arrow-callback, func-names */

describe('Photo', function () {
  describe('#getAspectRatio', function () {
    it('should return a number more than 1 for landscape photos', function () {
      const photo = new Photo(photoLegacy);
      expect(photo.getAspectRatio()).to.equal(1.5);
    });
  });
  describe('#match', function () {
    const photo = new Photo(photoLegacy);
    it('should match title', function () {
      expect(photo.match(/legacy/)).to.be.true;
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
  describe('#calcWidth', function () {
    it('should calculate width from either width, height, or max', function () {
      const photoL = new Photo(photoSrcsetLandscape);
      const photoP = new Photo(photoSrcsetPortrait);
      const photoS = new Photo(photoSrcsetSquare);
      expect(photoL.calcWidth(photoL.data.images[0])).to.equal(600);
      expect(photoL.calcWidth(photoL.data.images[1])).to.equal(900);
      expect(photoL.calcWidth(photoL.data.images[2])).to.equal(1200);
      expect(photoP.calcWidth(photoP.data.images[0])).to.equal(400);
      expect(photoP.calcWidth(photoP.data.images[1])).to.equal(600);
      expect(photoP.calcWidth(photoP.data.images[2])).to.equal(800);
      expect(photoS.calcWidth(photoS.data.images[0])).to.equal(600);
      expect(photoS.calcWidth(photoS.data.images[1])).to.equal(900);
      expect(photoS.calcWidth(photoS.data.images[2])).to.equal(1200);
    });
  });
  describe('#getSrcSet', function () {
    it('should return for legacy', function () {
      const photo = new Photo(photoLegacy);
      expect(photo.getSrcSet()).to.equal('https://placehold.it/300x200 300w');
    });
    it('should return for legacy flickr', function () {
      const photo = new Photo(photoLegacyFlickr);
      expect(photo.getSrcSet()).to.equal('https://farm6.staticflickr.com/5604/15605014039_3aa65f125e.jpg 500w, https://farm6.staticflickr.com/5604/15605014039_3aa65f125e_b.jpg 1024w');
    });
    it('should return for srcset', function () {
      const photo = new Photo(photoSrcsetLandscape);
      expect(photo.getSrcSet()).to.equal('https://placehold.it/600x400 600w, https://placehold.it/900x600 900w, https://placehold.it/1200x800 1200w');
    });
  });
});
