export as namespace Kxhr;

export = XhrPromise;

declare class XhrPromise {
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
    data?:
      | Document
      | FormData
      | ReadableStream
      | Blob
      | BufferSource
      | URLSearchParams
      | string
      | null;
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
