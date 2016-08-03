import { jsdom } from 'jsdom';

const doc = jsdom('');
global.document = doc;
global.window = doc.defaultView;
Object.keys(doc.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    global[property] = doc.defaultView[property];
  }
});

global.navigator = {
  userAgent: 'node.js',
};
