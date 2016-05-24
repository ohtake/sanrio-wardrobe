# Sanrio Wardrobe

You can find clothings of Sanrio characters.

* Source: <https://github.com/ohtake/sanrio-wardrobe/>
* Demo: <https://ohtake.github.io/sanrio-wardrobe/>

## Develop

Install [Node.js and npm](https://nodejs.org/en/download/). Execute `npm install` to install dependencies.

Run `npm start`. Now you can visit http://localhost:8080/ to view the application.

## Publish

```bash
git checkout -B gh-pages
npm run-script build
git add -f build.js
git commit -m "Build"
git push origin gh-pages -f
git checkout -
```
