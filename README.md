# k-xhr

Lightweight XMLHttpRequest.

## Installation

```
npm install k-xhr
```

Thansk to [JSONPlaceholder](https://jsonplaceholder.typicode.com/) for their testing API.

## Quick Start

```javascript
import Kxhr from "k-xhr";

new Kxhr({
  url: "http://httpbin.org/post?custom_param=your_url_param",
  method: "post",
  contentType: "application/json",
  headers: { "X-Custom-Header": "your_custom_header" },
  withCredentials: true, // For CORS
  data: JSON.stringify({ msg: "Running POST test" }),
  beforeSend: (xhr) => {
    console.log(xhr); // The XMLHttpRequest instance
  },
  onProgress: (e) => {
    console.log(e); // Progress event
  }
})
  .then((responseText) => console.log(responseText))
  .catch((e) => console.error(e))
  .finally((xhr) => {
    console.log(xhr);
  });
```

## Documentation

```typescript
class Kxhr {
  state: "pending" | "fulfilled" | "rejected";
  value: any;
  error: Error | null;
  callbacks: Array<{ type: "resolve" | "reject"; handler: (value: any) => any }>;
  finallyHandler: ((xhr: XMLHttpRequest) => void) | null;
  xhr: XMLHttpRequest;

  constructor(options: {
    url: string;
    method?: "get" | "head" | "post" | "put" | "delete" | "connect" | "options" | "trace" | "patch";
    async?: boolean;
    contentType?: string;
    headers?: { [k: string]: string };
    withCredentials?: boolean;
    data?: Document | FormData | ReadableStream | Blob;
    beforeSend?: (xhr: XMLHttpRequest) => void;
    onProgress?: (e: ProgressEvent) => void;
    timeout?: number;
  });

  onLoad: () => void;

  onError: () => void;

  resolve: () => void;

  reject: () => void;

  then: (onResolve: (value: any) => any, onReject?: (error: Error) => any) => this;

  catch: (onReject: (error: Error) => any) => this;

  cancel: () => void;

  finally: (onComplete: (xhr: XMLHttpRequest) => void) => this;
}
```
