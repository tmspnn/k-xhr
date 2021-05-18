# k-xhr

Lightweight XMLHttpRequest, **1.3Kb** gzipped.

Thanks to [JSONPlaceholder](https://jsonplaceholder.typicode.com/) for their open API which I used for testing.

## Installation

```
npm install k-xhr
```

## Quick Start

```javascript
import kxhr from "k-xhr";

const data = { id: 1, data: "Testing string" };

kxhr("https://jsonplaceholder.typicode.com/posts", "post", JSON.stringify(data), {
  contentType: "application/json",
}).then((res) => {
  const json = JSON.parse(res);
  console.log(json.id);
  console.log(json.data);
});
```

## Sequential Catch

```javascript
let i = 0;

kxhr("https://jsonplaceholder.typicode.com/todos/1")
  .then(() => {
    ++i; // i = 1
    throw new Error("catch 1");
  })
  .catch((e) => {
    ++i; // i = 2
  })
  .then(() => {
    ++i; // i = 3
    throw new Error("catch 2");
  })
  .catch((e) => {
    ++i; // i = 4
  })
  .finally(() => {
    console.log(i); // 4
  });
```
