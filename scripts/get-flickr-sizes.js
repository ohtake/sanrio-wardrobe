#!./node_modules/.bin/babel-node

/*
Get information to be used for srcset for Flickr and print yaml fragment.

Rerference:
https://www.flickr.com/services/api/flickr.photos.getSizes.html
https://www.flickr.com/services/api/misc.urls.html
*/

// Use request to support proxy.
// If you are behind a proxy, set https_proxy environment variable.
import request from 'request';

const args = process.argv.slice(2);
if (args.length !== 2) {
  console.error('Usage:');
  console.error();
  console.error('./node_modules/.bin/babel-node scripts/get-flickr-sizes.js <FLICKR_API_KEY> <PHOTO_ID>');
  console.error();
  console.error('You can get a Flickr api key at <https://www.flickr.com/services/apps/create/apply>,');
  console.error('or find a key at <https://github.com/neptunian/react-photo-gallery/blob/3/examples/src/app.js#L40>.');
  process.exit(1);
}

const apiKey = args[0];
const photoId = args[1];
const endpoint = `https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=${apiKey}&photo_id=${photoId}&format=json&nojsoncallback=1`;

request(endpoint, (error, response, body) => {
  if (error) {
    console.info(response);
    console.info(body);
    console.error(`Got status code ${response.statusCode}`);
    process.exit(1);
  }
  const obj = JSON.parse(body);
  if (obj.stat !== 'ok') {
    console.info(body);
    console.error(`Got failure message: ${obj.message}`);
    process.exit(1);
  }

  let farm;
  let server;
  let secret;
  let secretH;
  let secretK;
  let secretO;
  let formatO;
  let hasB = false;
  let hasC = false;

  const regexUrl = /https:\/\/farm([0-9]+)\.staticflickr\.com\/([0-9]+)\/([0-9]+)_([0-9a-f]+)(_[a-z])?\.([a-z]+)/;
  obj.sizes.size.forEach((size) => {
    let result;
    switch (size.label) {
      case 'Medium':
        result = regexUrl.exec(size.source);
        farm = result[1];
        server = result[2];
        secret = result[4];
        break;
      case 'Medium 800':
        hasC = true;
        break;
      case 'Large':
        hasB = true;
        break;
      case 'Large 1600':
        result = regexUrl.exec(size.source);
        secretH = result[4];
        break;
      case 'Large 2048':
        result = regexUrl.exec(size.source);
        secretK = result[4];
        break;
      case 'Original':
        result = regexUrl.exec(size.source);
        secretO = result[4];
        formatO = result[6];
        break;
      default:
        break;
    }
  });
  if (!farm) {
    console.info(body);
    console.error('Could not find farm');
    process.exit(1);
  }
  const params = [];
  params.push(`photo: "${photoId}"`);
  params.push(`farm: ${farm}`);
  params.push(`server: ${server}`);
  params.push(`secret: "${secret}"`);
  if (secretH) params.push(`secret_h: "${secretH}"`);
  if (secretK) params.push(`secret_k: "${secretK}"`);
  if (secretO) {
    params.push(`secret_o: "${secretO}"`);
    params.push(`format_o: "${formatO}"`);
  }
  if (!hasB) params.push('before: "20100525"');
  else if (!hasC) params.push('before: "20120301"');
  console.log(`images_flickr: { ${params.join(', ')} }`);
});
