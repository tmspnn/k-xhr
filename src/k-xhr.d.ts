export = kXhr;

declare function kXhr(options: {
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
}): PromiseLike<string>;

declare namespace kXhr {
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
}
