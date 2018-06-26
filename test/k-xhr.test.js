const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const libSource = readFileAsTexts('../dist/k-xhr.min.js');
const testCases = ['options'].map(name => ({
  name,
  source: readFileAsTexts(`${name}.case.js`)
}));

const window = new JSDOM(
  `<!doctype html>
    <html>
        <head></head>
        <body>
          <div id="app"></div>
        </body>
    </html>`,
  {
    runScripts: 'outside-only'
  }
).window;

window.eval(libSource);

testCases.forEach(t => {
  test(t.name, async () => {
    await expect(await window.eval(t.source)).toBe(0);
  });
});

function readFileAsTexts(relativePath) {
  return fs.readFileSync(path.resolve(__dirname, relativePath), { encoding: 'utf8' });
}
