export = kXhr;

declare function kXhr(options: {
  url: string;
  method?: string;
  async?: boolean;
  contentType?: string;
  headers?: object;
  withCredentials?: boolean | string;
  data?: Document | FormData | ReadableStream | Blob;
  beforeSend?: () => any;
  timeout?: number;
}): PromiseLike<any>;

declare namespace kXhr {
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
}
