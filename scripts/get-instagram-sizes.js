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

async function getRedirectLocation(uri) {
  try {
    const resp = await requestPromise({ uri, followRedirect: false, resolveWithFullResponse: true });
    throw new Error(`expect redirect for ${uri} but got ${resp}`);
  } catch (ex) {
    if (Math.floor(ex.statusCode / 100) === 3) {
      return ex.response.headers.location;
    }
    throw ex;
  }
}

async function fetchAndDecode(uri) {
  const body = await requestPromise({ uri, encoding: null });
  return Jpeg.decode(body);
}

async function fetchGraphQL(shortcode) {
  const uri = `https://www.instagram.com/p/${shortcode}/?__a=1`; // Not a public API
  try {
    const body = await requestPromise({ uri, followRedirect: false });
    return JSON.parse(body);
  } catch (ex) {
    // sidecar children will redirect
    if (Math.floor(ex.statusCode / 100) === 3) {
      return null;
    }
    throw ex;
  }
}

async function main() {
  const graphql = await fetchGraphQL(args[0]);
  if (graphql) {
    const mediaInfo = graphql.graphql.shortcode_media;
    /* eslint-disable no-underscore-dangle */
    switch (mediaInfo.__typename) {
      case 'GraphImage':
      case 'GraphVideo':
        console.log(mediaInfo.__typename);
        break;
      case 'GraphSidecar':
        console.log(`GraphSidecar: ${mediaInfo.edge_sidecar_to_children.edges.map((e) => e.node.shortcode)}`);
        break;
      default:
        throw new Error(`Unknown typename: ${mediaInfo.__typename}`);
    }
    /* eslint-enable */
  } else {
    console.log('No graphql. Child of sidecar?');
  }

  const sizes = ['t', 'm', 'l'];
  const shortcode = args[0];
  const endpoints = sizes.map((s) => `https://www.instagram.com/p/${shortcode}/media/?size=${s}`);
  const urls = await Promise.all(endpoints.map((e) => getRedirectLocation(e)));
  const jpegs = await Promise.all(urls.map((u) => fetchAndDecode(u)));
  const params = [];
  const params2 = [];
  params.push(`shortcode: "${shortcode}"`);
  params2.push(`shortcode: "${shortcode}"`);
  let widthL;
  let heightL;
  jpegs.forEach((jp, i) => {
    params.push(`width_${sizes[i]}: ${jp.width}`);
    if (i === 2) {
      widthL = jp.width;
      heightL = jp.height;
    } else {
      params2.push(`${sizes[i]}_width: ${jp.width}`);
      params2.push(`${sizes[i]}_height: ${jp.height}`);
    }
    params2.push(`${sizes[i]}_url: "${urls[i]}"`);
  });
  console.log(`images_instagram: { ${params.join(', ')} }`);
  console.log(`images_instagram2: { ${params2.join(', ')} }`);
  console.log(`size: { width_o: ${widthL}, height_o: ${heightL} }`);
}

main();
