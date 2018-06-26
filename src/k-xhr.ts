interface PromiseLike<T> {
  state: string; // 'pending' | 'fulfilled' | 'rejected'
  value: T;
  error: any;
  callbacks: Array<{ type: string; handler: (value: any) => any }>; // type: 'resolve' | 'reject'
  finallyHandler: (xhr: PromiseLike<any>) => void;
  then: (onResolve: (value: T) => any, onReject: (error: any) => any) => PromiseLike<any>;
  catch: (onReject: (error: any) => any) => PromiseLike<any>;
  finally: (onComplete: (xhr: PromiseLike<any>) => void) => PromiseLike<any>;
  cancel: () => void;
}

export default function kXhr(options: {
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
}): PromiseLike<string> {
  const xhr = Object.assign(new XMLHttpRequest(), {
    async: options.async || true,
    beforeSend: options.beforeSend,
    callbacks: [],
    cancel: xhrCancel,
    catch: xhrCatch,
    contentType: options.contentType,
    data: options.data || null,
    error: null,
    extendedBy: 'k-xhr',
    finally: xhrFinally,
    finallyHandler: null,
    headers: options.headers,
    method: (options.method || 'get').toUpperCase(),
    onprogress: options.onprogress,
    resolve: xhrResolve,
    reject: xhrReject,
    state: 'pending',
    then: xhrThen,
    timeout: options.timeout || 0,
    url: options.url,
    value: null,
    withCredentials: options.withCredentials || false
  }) as any;
  xhr.open(xhr.method, xhr.url, xhr.async);
  if (xhr.contentType) {
    xhr.setRequestHeader('Content-Type', xhr.contentType);
  }
  if (xhr.headers) {
    for (let h in xhr.headers) {
      if (xhr.headers.hasOwnProperty(h)) {
        xhr.setRequestHeader(h, xhr.headers[h]);
      }
    }
  }
  xhr.onload = () => {
    if (xhr.status >= 200 && xhr.status < 400) {
      xhr.state = 'fulfilled';
      xhr.value = xhr.responseText;
      xhr.resolve();
    } else {
      xhr.onerror();
    }
  };
  xhr.onerror = () => {
    xhr.state = 'rejected';
    xhr.error = xhr.responseText || xhr.status;
    xhr.reject();
  };
  if (xhr.beforeSend) {
    xhr.beforeSend(xhr);
  }
  setTimeout(() => xhr.send(xhr.data));
  return xhr;

  function xhrResolve() {
    if (xhr.value && xhr.value.extendedBy == 'k-xhr') {
      xhr.value.callbacks.push(...xhr.callbacks);
      xhr.value.finallyHandler = xhr.finallyHandler;
      xhr.callbacks.length = 0;
      xhr.finallyHandler = null;
    } else {
      let cb;
      while ((cb = xhr.callbacks.shift())) {
        if (cb.type == 'resolve') {
          try {
            xhr.value = cb.handler(xhr.value);
          } catch (e) {
            xhr.state = 'rejected';
            xhr.error = e;
            return xhr.reject();
          }
        }
      }
      if (xhr.finallyHandler) {
        xhr.finallyHandler(xhr);
      }
    }
  }

  function xhrReject() {
    let cb;
    while ((cb = xhr.callbacks.shift())) {
      if (cb.type == 'reject') {
        xhr.value = cb.handler(xhr.error);
        if (xhr.value != null) {
          xhr.state = 'fulfilled';
          return xhr.resolve();
        }
      }
    }
    if (xhr.finallyHandler) {
      xhr.finallyHandler(xhr);
    }
  }

  function xhrThen(onResolve: (value: any) => any, onReject?: (error: any) => any) {
    xhr.callbacks.push({ type: 'resolve', handler: onResolve });
    if (onReject) {
      xhr.callbacks.push({ type: 'reject', handler: onReject });
    }
    return xhr;
  }

  function xhrCatch(onReject: (error: any) => any) {
    xhr.callbacks.push({ type: 'reject', handler: onReject });
    return xhr;
  }

  function xhrCancel() {
    xhr.abort();
  }

  function xhrFinally(onComplete: (xhr: PromiseLike<any>) => void) {
    xhr.finallyHandler = onComplete;
    return xhr;
  }
}
