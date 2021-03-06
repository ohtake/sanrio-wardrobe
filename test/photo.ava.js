import test from 'ava';
import cloneDeep from 'lodash/cloneDeep';

import Photo from '../src/photo';

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
  images_flickr: {
    photo: '15605014039', farm: 6, server: 5604, secret: '3aa65f125e', secret_h: '2c5f7cc664', secret_k: '31513b8bf6',
  },
  source: { author: 'ohtake', license: 'CC BY-SA 2.0', url: 'https://www.flickr.com/photos/ohtake_tomohiro/15605014039' },
  size: { width_o: 5760, height_o: 3840 },
  colors: [],
  notes: [],
};
const photoFlickrPortrait = {
  title: 'flickr images portrait',
  images_flickr: {
    photo: '24326364382', farm: 2, server: 1623, secret: '2a00bf3387', secret_h: '988fe74e0e', secret_k: '1d900d84de',
  },
  source: { author: 'ohtake', license: 'CC BY-SA 2.0', url: 'https://www.flickr.com/photos/ohtake_tomohiro/24326364382' },
  size: { width_o: 3840, height_o: 5760 },
  colors: [],
  notes: [],
};
const photoFlickrTooSmall = {
  title: '24214891894',
  images_flickr: {
    photo: '24214891894', farm: 2, server: 1457, secret: 'fb5e07fc69', before: '20100525',
  },
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
const photoInstagramSquare = {
  title: 'Wii Gato (Lipe Sleep)',
  images_instagram: {
    shortcode: 'fA9uwTtkSN', width_t: 150, width_m: 320, width_l: 640,
  },
  source: { author: 'diegoquinteiro', license: '', url: 'http://instagr.am/p/fA9uwTtkSN/' },
  size: { width_o: 640, height_o: 640 },
  colors: [],
  notes: [],
};
const photoInstagramPortrait = {
  title: 'SI Kitto 1',
  images_instagram: {
    shortcode: 'BXo13ZBngas', width_t: 150, width_m: 320, width_l: 720,
  },
  source: { author: 'diegoquinteiro', license: '', url: 'https://www.instagram.com/p/BXo13ZBngas/' },
  size: { width_o: 720, height_o: 900 },
  colors: [],
  notes: [],
};
const photoInstagram2Square = {
  title: 'Wii Gato (Lipe Sleep)',
  images_instagram2: {
    shortcode: 'fA9uwTtkSN',
    t_width: 150,
    t_height: 150,
    t_url: 'https://scontent-nrt1-1.cdninstagram.com/vp/66fc31d63e4335207abe9c678a0a3f0b/5A88DA9A/t51.2885-15/s150x150/e15/11358196_1472850273007829_614249870_n.jpg',
    m_width: 320,
    m_height: 320,
    m_url: 'https://scontent-nrt1-1.cdninstagram.com/vp/640bc9bd24ad9f049fd7528fd06a9868/5A88E889/t51.2885-15/s320x320/e15/11358196_1472850273007829_614249870_n.jpg',
    l_url: 'https://scontent-nrt1-1.cdninstagram.com/vp/685ca756ed8ce187b242d0041734fe76/5A88CC04/t51.2885-15/e15/11358196_1472850273007829_614249870_n.jpg',
  },
  source: { author: 'diegoquinteiro', license: '', url: 'http://instagr.am/p/fA9uwTtkSN/' },
  size: { width_o: 640, height_o: 640 },
  colors: [],
  notes: [],
};
const photoInstagram2Portrait = {
  title: 'SI Kitto 1',
  images_instagram2: {
    shortcode: 'BXo13ZBngas',
    t_width: 150,
    t_height: 150,
    t_url: 'https://scontent-nrt1-1.cdninstagram.com/vp/ac99123caabe97e1bf65216978e08b27/5B0A1F5E/t51.2885-15/s150x150/e15/c0.90.720.720/20766680_1780144428942534_1180693944258789376_n.jpg',
    m_width: 320,
    m_height: 400,
    m_url: 'https://scontent-nrt1-1.cdninstagram.com/vp/f1c0f16656b453b3620b1b3b276141d4/5AFF94C8/t51.2885-15/e15/p320x320/20766680_1780144428942534_1180693944258789376_n.jpg',
    l_url: 'https://scontent-nrt1-1.cdninstagram.com/vp/474170aa8bbbc28ed9981047bc8ea2a9/5B16558B/t51.2885-15/e15/20766680_1780144428942534_1180693944258789376_n.jpg',
  },
  source: { author: 'diegoquinteiro', license: '', url: 'https://www.instagram.com/p/BXo13ZBngas/' },
  size: { width_o: 720, height_o: 900 },
  colors: [],
  notes: [],
};

/** @test {Photo#getAspectRatio} */
test('Photo#getAspectRatio should return a number', t => {
  const photoL = new Photo(photoSrcsetLandscape);
  t.true(photoL.getAspectRatio() > 1);
  const photoP = new Photo(photoSrcsetPortrait);
  t.true(photoP.getAspectRatio() < 1);
  const photoS = new Photo(photoSrcsetSquare);
  t.true(photoS.getAspectRatio() === 1);
});

/** @test {Photo#match} */
test('Photo#match', t => {
  const photo = new Photo(photoSrcsetLandscape);
  /* eslint-disable ava/prefer-t-regex */
  // photo.match is not String#match but Photo#match
  t.true(photo.match(/landscape/), 'should match title');
  t.false(photo.match(/placehold/), 'should not match url');
  t.true(photo.match(/brent/), 'should match author');
  t.false(photo.match(/red/), 'should not match color');
  t.true(photo.match(/note1/), 'should match notes');
  t.true(photo.match(/note2/), 'should match notes');
  /* eslint-enable ava/prefer-t-regex */
});

/** @test {Photo#calcWidthOrHeight} */
test('Photo#calcWidthOrHeight should calculate width from either width, height, or max', t => {
  const photoL = new Photo(photoSrcsetLandscape);
  const photoP = new Photo(photoSrcsetPortrait);
  const photoS = new Photo(photoSrcsetSquare);
  t.is(photoL.calcWidthOrHeight(photoL.data.images[0], true), 600);
  t.is(photoL.calcWidthOrHeight(photoL.data.images[1], true), 900);
  t.is(photoL.calcWidthOrHeight(photoL.data.images[2], true), 1200);
  t.is(photoP.calcWidthOrHeight(photoP.data.images[0], true), 400);
  t.is(photoP.calcWidthOrHeight(photoP.data.images[1], true), 600);
  t.is(photoP.calcWidthOrHeight(photoP.data.images[2], true), 800);
  t.is(photoS.calcWidthOrHeight(photoS.data.images[0], true), 600);
  t.is(photoS.calcWidthOrHeight(photoS.data.images[1], true), 900);
  t.is(photoS.calcWidthOrHeight(photoS.data.images[2], true), 1200);
});

/** @test {Photo#calcWidthOrHeight} */
test('Photo#calcWidthOrHeight calculate height from either width, height, or max', t => {
  const photoL = new Photo(photoSrcsetLandscape);
  const photoP = new Photo(photoSrcsetPortrait);
  const photoS = new Photo(photoSrcsetSquare);
  t.is(photoL.calcWidthOrHeight(photoL.data.images[0], false), 400);
  t.is(photoL.calcWidthOrHeight(photoL.data.images[1], false), 600);
  t.is(photoL.calcWidthOrHeight(photoL.data.images[2], false), 800);
  t.is(photoP.calcWidthOrHeight(photoP.data.images[0], false), 600);
  t.is(photoP.calcWidthOrHeight(photoP.data.images[1], false), 900);
  t.is(photoP.calcWidthOrHeight(photoP.data.images[2], false), 1200);
  t.is(photoS.calcWidthOrHeight(photoS.data.images[0], false), 600);
  t.is(photoS.calcWidthOrHeight(photoS.data.images[1], false), 900);
  t.is(photoS.calcWidthOrHeight(photoS.data.images[2], false), 1200);
});

/** @test {Photo#getSrcSet} */
test('Photo#getSrcSet should not modify original data', t => {
  const original = cloneDeep(photoSrcsetLandscape);
  const photo = new Photo(photoSrcsetLandscape);
  photo.getSrcSet();
  t.deepEqual(photo.data, original);
});

/** @test {Photo#getSrcSet} */
test('Photo#getSrcSet should return for srcset', t => {
  const photo = new Photo(photoSrcsetLandscape);
  t.is(photo.getSrcSet(), 'https://placehold.it/600x400 600w, https://placehold.it/900x600 900w, https://placehold.it/1200x800 1200w');
});

/** @test {Photo#getSrcSet} */
test('Photo#getSrcSet should return for flickr landscape images', t => {
  const photo = new Photo(photoFlickrLandscape);
  t.is(photo.getSrcSet(), [
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

/** @test {Photo#getSrcSet} */
test('Photo#getSrcSet should return for flickr portrait images', t => {
  const photo = new Photo(photoFlickrPortrait);
  t.is(photo.getSrcSet(), [
    'https://farm2.staticflickr.com/1623/24326364382_2a00bf3387_t.jpg 67w',
    'https://farm2.staticflickr.com/1623/24326364382_2a00bf3387_m.jpg 160w',
    'https://farm2.staticflickr.com/1623/24326364382_2a00bf3387_n.jpg 213w',
    'https://farm2.staticflickr.com/1623/24326364382_2a00bf3387.jpg 333w',
    'https://farm2.staticflickr.com/1623/24326364382_2a00bf3387_z.jpg 427w',
    'https://farm2.staticflickr.com/1623/24326364382_2a00bf3387_c.jpg 533w', // BUG: 534 is corrent in Flickr. See <https://twitter.com/ohtaket/status/750318571926859776>
    'https://farm2.staticflickr.com/1623/24326364382_2a00bf3387_b.jpg 683w',
    'https://farm2.staticflickr.com/1623/24326364382_988fe74e0e_h.jpg 1067w',
    'https://farm2.staticflickr.com/1623/24326364382_1d900d84de_k.jpg 1365w',
  ].join(', '));
});

/** @test {Photo#getSrcSet} */
test('Photo#getSrcSet should return for flickr too small', t => {
  const photo = new Photo(photoFlickrTooSmall);
  t.is(photo.getSrcSet(), [
    'https://farm2.staticflickr.com/1457/24214891894_fb5e07fc69_t.jpg 100w',
    'https://farm2.staticflickr.com/1457/24214891894_fb5e07fc69_m.jpg 240w',
    'https://farm2.staticflickr.com/1457/24214891894_fb5e07fc69_n.jpg 320w',
    'https://farm2.staticflickr.com/1457/24214891894_fb5e07fc69.jpg 500w',
    'https://farm2.staticflickr.com/1457/24214891894_fb5e07fc69_z.jpg 538w',
  ].join(', '));
});

/** @test {Photo#getSrcSet} */
test('Photo#getSrcSet should return for picasa', t => {
  const photo = new Photo(photoPicasa);
  t.is(photo.getSrcSet(), [
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

/** @test {Photo#getSrcSet} */
test('Photo#getSrcSet should return for instagram', t => {
  const photoS = new Photo(photoInstagramSquare);
  t.is(photoS.getSrcSet(), [
    'https://instagram.com/p/fA9uwTtkSN/media/?size=t 150w',
    'https://instagram.com/p/fA9uwTtkSN/media/?size=m 320w',
    'https://instagram.com/p/fA9uwTtkSN/media/?size=l 640w',
  ].join(', '));
  const photoP = new Photo(photoInstagramPortrait);
  t.is(photoP.getSrcSet(), [
    // should not contain 't' for non-square image
    'https://instagram.com/p/BXo13ZBngas/media/?size=m 320w',
    'https://instagram.com/p/BXo13ZBngas/media/?size=l 720w',
  ].join(', '));
});

/** @test {Photo#getSrcSet} */
test('Photo#getSrcSet should return for instagram v2', t => {
  const photoS = new Photo(photoInstagram2Square);
  t.is(photoS.getSrcSet(), [
    'https://scontent-nrt1-1.cdninstagram.com/vp/66fc31d63e4335207abe9c678a0a3f0b/5A88DA9A/t51.2885-15/s150x150/e15/11358196_1472850273007829_614249870_n.jpg 150w',
    'https://scontent-nrt1-1.cdninstagram.com/vp/640bc9bd24ad9f049fd7528fd06a9868/5A88E889/t51.2885-15/s320x320/e15/11358196_1472850273007829_614249870_n.jpg 320w',
    'https://scontent-nrt1-1.cdninstagram.com/vp/685ca756ed8ce187b242d0041734fe76/5A88CC04/t51.2885-15/e15/11358196_1472850273007829_614249870_n.jpg 640w',
  ].join(', '));
  const photoP = new Photo(photoInstagram2Portrait);
  t.is(photoP.getSrcSet(), [
    // should not contain 't' for non-square image
    'https://scontent-nrt1-1.cdninstagram.com/vp/f1c0f16656b453b3620b1b3b276141d4/5AFF94C8/t51.2885-15/e15/p320x320/20766680_1780144428942534_1180693944258789376_n.jpg 320w',
    'https://scontent-nrt1-1.cdninstagram.com/vp/474170aa8bbbc28ed9981047bc8ea2a9/5B16558B/t51.2885-15/e15/20766680_1780144428942534_1180693944258789376_n.jpg 720w',
  ].join(', '));
});

/** @test {Photo#prepareSize} */
test('Photo#prepareSize should fill all of width, height, or max', t => {
  const photoL = new Photo(photoSrcsetLandscape);
  let r;
  r = photoL.prepareSize(photoL.data.images[0]);
  t.is(typeof r.url, 'string');
  t.is(r.width, 600);
  t.is(r.height, 400);
  t.is(r.max, 600);
  r = photoL.prepareSize(photoL.data.images[1]);
  t.is(typeof r.url, 'string');
  t.is(r.width, 900);
  t.is(r.height, 600);
  t.is(r.max, 900);
  r = photoL.prepareSize(photoL.data.images[2]);
  t.is(typeof r.url, 'string');
  t.is(r.width, 1200);
  t.is(r.height, 800);
  t.is(r.max, 1200);
});

/** @test {Photo#getLargestImageAtMost} */
test('Photo#getLargestImageAtMost should return the most suitable one', t => {
  const photoL = new Photo(photoSrcsetLandscape);
  t.is(photoL.getLargestImageAtMost(100, 100).url, 'https://placehold.it/600x400');
  t.is(photoL.getLargestImageAtMost(600, 400).url, 'https://placehold.it/600x400');
  t.is(photoL.getLargestImageAtMost(10000, 400).url, 'https://placehold.it/600x400');
  t.is(photoL.getLargestImageAtMost(600, 10000).url, 'https://placehold.it/600x400');
  t.is(photoL.getLargestImageAtMost(900, 599).url, 'https://placehold.it/600x400');
  t.is(photoL.getLargestImageAtMost(899, 600).url, 'https://placehold.it/600x400');
  t.is(photoL.getLargestImageAtMost(900, 600).url, 'https://placehold.it/900x600');
  t.is(photoL.getLargestImageAtMost(10000, 10000).url, 'https://placehold.it/1200x800');
});
