#!./node_modules/.bin/babel-node

/*
Get information to be used for srcset for Instagram and print yaml fragment.

Rerference:
https://www.instagram.com/developer/embedding/#media_redirect
*/

// Use request to support proxy.
// If you are behind a proxy, set https_proxy environment variable.
import requestPromise from 'request-promise-native';

import Jpeg from 'jpeg-js';

const args = process.argv.slice(2);
if (args.length !== 1) {
  console.error('Usage:');
  console.error();
  console.error('./node_modules/.bin/babel-node scripts/get-instagram-sizes.js <SHORTCODE>');
  process.exit(1);
}

async function fetchAndDecode(shortcode, size) {
  const endpoint = `https://instagram.com/p/${shortcode}/media/?size=${size}`;
  const body = await requestPromise({ uri: endpoint, encoding: null });
  return Jpeg.decode(body);
}

const sizes = ['t', 'm', 'l'];
const shortcode = args[0];
const jpegPromises = sizes.map(s => fetchAndDecode(shortcode, s));
Promise.all(jpegPromises).then((jpegs) => {
  const params = [];
  params.push(`shortcode: "${shortcode}"`);
  let widthL;
  let heightL;
  jpegs.forEach((jp, i) => {
    params.push(`width_${sizes[i]}: ${jp.width}`);
    if (i === 2) {
      widthL = jp.width;
      heightL = jp.height;
    }
  });
  console.log(`images_instagram: { ${params.join(', ')} }`);
  console.log(`size: { width_o: ${widthL}, height_o: ${heightL} }`);
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
