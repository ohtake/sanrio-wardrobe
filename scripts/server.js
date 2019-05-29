/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
import http from 'http';
import finalHandler from 'finalhandler';
import serveStatic from 'serve-static';
import morgan from 'morgan';

const serverConfig = {
  host: 'localhost',
  port: 8080,
};

const logger = morgan('combined');
const serve = serveStatic('.');

const server = http.createServer((req, res) => {
  logger(req, res, (err) => {
    const done = finalHandler(req, res);
    if (err) {
      done(err);
      return;
    }
    serve(req, res, done);
  });
});

server.listen(serverConfig);
console.log(`Open http://${serverConfig.host}:${serverConfig.port} in your browser`);
