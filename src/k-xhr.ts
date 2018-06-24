interface PromiseLike<T> {
  state: string;
  value: T;
  callbacks: Array<(...args: any[]) => any>;
  error: any;
  errorHandlers: Array<(...args: any[]) => any>;
  finallyHandler: (...args: any[]) => any;
  then: (resolve: (value: T) => any, reject: (error: any) => any) => PromiseLike<any>;
  catch: (error: any) => PromiseLike<any>;
  finally: (value: any) => void;
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
  beforeSend?: () => any;
  timeout?: number;
}): PromiseLike<any> {
  const xhr = Object.assign(new XMLHttpRequest(), {
    async: options.async || false,
    beforeSend: options.beforeSend,
    callbacks: [],
    cancel: xhrCancel,
    catch: xhrCatch,
    contentType: options.contentType,
    data: options.data || null,
    error: null,
    errorHandlers: [],
    extendedBy: 'k-xhr',
    finally: xhrFinally,
    finallyHandler: null,
    headers: options.headers,
    method: (options.method || 'get').toUpperCase(),
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
      xhr.value.errorHandlers.push(...xhr.errorHandlers);
      xhr.value.finallyHandler = xhr.finallyHandler;
      xhr.callbacks.length = 0;
      xhr.errorHandlers.length = 0;
      xhr.finallyHandler = null;
    } else {
      let onResolve;
      while ((onResolve = xhr.callbacks.shift())) {
        xhr.value = onResolve(xhr.value);
      }
      if (xhr.finallyHandler) {
        xhr.finallyHandler(xhr.value);
      }
    }
  }

  function xhrReject() {
    let onReject;
    while ((onReject = xhr.errorHandlers.shift())) {
      onReject(xhr.error);
    }
    if (xhr.finallyHandler) {
      xhr.finallyHandler(xhr.value);
    }
  }

  function xhrThen(onResolve: (value: any) => any) {
    xhr.callbacks.push(onResolve);
    return xhr;
  }

  function xhrCatch(onReject: (error: any) => any) {
    xhr.errorHandlers.push(onReject);
    return xhr;
  }

  function xhrCancel() {
    xhr.abort();
  }

  function xhrFinally(onComplete: (...args: any[]) => any) {
    xhr.finallyHandler = onComplete;
    return xhr;
  }
}
