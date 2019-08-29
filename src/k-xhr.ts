export default class XhrPromise {
  state: "pending" | "fulfilled" | "rejected" = "pending";
  value: any = null;
  error: Error | null = null;
  callbacks: Array<{ type: "resolve" | "reject"; handler: (value: any) => any }> = [];
  finallyHandler: ((xhr: XMLHttpRequest) => void) | null = null;
  xhr = new XMLHttpRequest();

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
  }) {
    const { xhr } = this;
    const {
      url,
      method,
      async,
      contentType,
      headers,
      withCredentials,
      data,
      beforeSend,
      onProgress,
      timeout
    } = options;
    xhr.open((method || "get").toUpperCase(), url, async != false);
    if (contentType) xhr.setRequestHeader("Content-Type", contentType);
    if (headers) {
      for (let h in headers) {
        if (headers.hasOwnProperty(h)) {
          xhr.setRequestHeader(h, headers[h]);
        }
      }
    }
    xhr.withCredentials = withCredentials || false;
    xhr.timeout = timeout || 0;
    xhr.onload = this.onLoad;
    xhr.onerror = this.onError;
    if (xhr.upload && onProgress) xhr.upload.onprogress = onProgress;
    if (beforeSend) beforeSend(xhr);
    setTimeout(() => xhr.send(data));
  }

  onLoad = () => {
    const { xhr } = this;
    if (xhr.status >= 200 && xhr.status < 400) {
      this.state = "fulfilled";
      this.value = xhr.responseText;
      this.resolve();
    } else {
      this.onError();
    }
  };

  onError = () => {
    const { xhr } = this;
    this.state = "rejected";
    this.error = new Error(xhr.responseText || xhr.statusText);
    this.reject();
  };

  resolve = () => {
    if (this.value instanceof XhrPromise) {
      const p = this.value;
      p.callbacks.push(...this.callbacks);
      p.finallyHandler = this.finallyHandler;
      this.callbacks.length = 0;
      this.finallyHandler = null;
    } else if (this.callbacks.length) {
      let cb = this.callbacks.shift();
      if (cb!.type == "resolve") {
        try {
          this.value = cb!.handler(this.value);
          this.resolve();
        } catch (e) {
          this.state = "rejected";
          this.error = e;
          this.reject();
        }
      } else {
        this.resolve();
      }
    } else if (this.finallyHandler) {
      this.finallyHandler(this.xhr);
    }
  };

  reject = () => {
    if (this.callbacks.length) {
      let cb = this.callbacks.shift();
      if (cb!.type == "reject") {
        this.value = cb!.handler(this.error);
        this.state = "fulfilled";
        this.resolve();
      } else {
        this.reject();
      }
    } else if (this.finallyHandler) {
      this.finallyHandler(this.xhr);
    } else {
      throw this.error;
    }
  };

  then = (onResolve: (value: any) => any, onReject?: (error: Error) => any) => {
    this.callbacks.push({ type: "resolve", handler: onResolve });
    if (onReject) this.callbacks.push({ type: "reject", handler: onReject });
    return this;
  };

  catch = (onReject: (error: Error) => any) => {
    this.callbacks.push({ type: "reject", handler: onReject });
    return this;
  };

  cancel = () => {
    this.xhr.abort();
  };

  finally = (onComplete: (xhr: XMLHttpRequest) => void) => {
    this.finallyHandler = onComplete;
    return this;
  };
}
