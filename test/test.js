// External modules
const fs = require("fs");
const JSDOM = require("jsdom").JSDOM;
const test = require("ava");

// Setup the testing environment
const kxhrJS = fs.readFileSync(__dirname + "/../dist/k-xhr.js");
const dom = new JSDOM(
  `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8" />
  <title>Testing</title>
</head>

<body>
  <script>${kxhrJS}</script>
</body>

</html>
`,
  {
    runScripts: "dangerously"
  }
);

// Run testcases
test("var", (t) => {
  with (dom.window) {
    t.is(typeof kxhr, "function");
  }
});

test("default get", (t) => {
  with (dom.window) {
    return kxhr("https://jsonplaceholder.typicode.com/todos/1").then((res) => {
      const json = JSON.parse(res);
      t.is(json.id, 1);
      t.is(json.userId, 1);
      t.is(json.title, "delectus aut autem");
      t.is(json.completed, false);
    });
  }
});

test("post JSON", (t) => {
  with (dom.window) {
    return kxhr(
      "https://jsonplaceholder.typicode.com/posts",
      "post",
      JSON.stringify({
        id: 1,
        data: "Testing string"
      }),
      {
        contentType: "application/json"
      }
    ).then((res) => {
      const json = JSON.parse(res);
      t.is(json.id, 101);
      t.is(json.data, "Testing string");
    });
  }
});

test("sequential catch", (t) => {
  with (dom.window) {
    let i = 0;
    return kxhr("https://jsonplaceholder.typicode.com/todos/1")
      .then(() => {
        ++i;
        throw new Error("catch 1");
      })
      .catch((e) => {
        ++i;
        t.is(e.message, "catch 1");
      })
      .then(() => {
        ++i;
        throw new Error("catch 2");
      })
      .catch((e) => {
        ++i;
        t.is(e.message, "catch 2");
      })
      .finally(() => {
        t.is(i, 4);
      });
  }
});

test("cancel", (t) => {
  with (dom.window) {
    let i = 0;
    const k = kxhr("https://jsonplaceholder.typicode.com/todos/1")
      .then(() => ++i)
      .finally(() => {
        t.is(i, 0);
      });
    k.cancel();
  }
});
