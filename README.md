# k-xhr

Lightweight, promise-like XMLHttpRequest.

- [Installation](#isl)
- [Quick Start](#strt)
- [Features](#ftr)
- [Documentation](#doc)
  - [options](#options)
  - [methods](#methods)
    - [then](#then)
    - [catch](#catch)
    - [finally](#finally)
    - [cancel](#cancel)

## <a name="isl"></a>Installation

### Node.js

```
npm install k-xhr
```

### Browser

```html
<script src="node_modules/k-xhr/dist/k-xhr.min.js"></script>
```

## <a name="strt"></a>Quick Start

```javascript
import kXhr from 'k-xhr';

kXhr({
  url: 'http://httpbin.org/post?custom_param=your_url_param',
  method: 'post',
  contentType: 'application/json',
  headers: { 'X-Custom-Header': 'your_custom_header' },
  withCredentials: true, // for CORS
  data: JSON.stringify({ msg: 'Running POST test' }),
  beforeSend: xhr => {
    console.log(xhr); // the extended XMLHttpRequest instance
  },
  onprogress: e => {
    console.log(e); // progress event
  }
})
  .then(responseText => console.log(responseText))
  .catch(e => console.error(e))
  .finally(xhr => {
    console.log(xhr); // the extended XMLHttpRequest instance
  });
```

## <a name="ftr"></a>Features

- Lightweight: `1.3KB` gzipped, no dependencies

- Simple and easy to use: k-xhr extends XMLHttpRequest instances with `.then`, `.catch`, `.finally` and `.cancel`, make them promise-like

## <a name="doc"></a>Documentation

### <a name="options"></a>Options

```typescript
interface kXhrOptions = {
  url: string;
  method?: string;
  async?: boolean;
  contentType?: string;
  headers?: object;
  withCredentials?: boolean | string;
  data?: Document | FormData | ReadableStream | Blob;
  beforeSend?: (xhr: any) => any;
  onprogress?: (e: Event) => void;
  timeout?: number;
}
```

### <a name="methods"></a>Methods

- `then(onResolve, [onReject]): Promise<any>`
- `catch(onReject): Promise<any>`
- `finally(onComplete): void`
- `cancel(): void`
