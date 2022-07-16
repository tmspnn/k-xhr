declare function kxhr(
	url: string,
	method: string,
	data:
		| Document
		| FormData
		| ReadableStream
		| Blob
		| BufferSource
		| URLSearchParams
		| string
		| null,
	options: {
		success?: (cb: any) => void;
		fail?: (e: Error) => void;
		complete?: (k: Kxhr) => void;
		contentType?: string;
		headers?: { [k: string]: string };
		withCredentials?: boolean;
		timeout?: number;
		onProgress?: (e: ProgressEvent) => void;
		beforeSend?: (xhr: XMLHttpRequest) => void;
	}
): Kxhr;

interface Kxhr {
	state: "pending" | "resolved" | "rejected" | "cancelled";
	result: any;
	err: null | Error;
	resolve: null | (() => void);
	reject: null | (() => void);
	callbacks: Array<(any) => any>;
	onComplete: null | ((Kxhr) => void);
	xhr: XMLHttpRequest;
	then: (onResolve: (r: any) => any, onReject?: (e: Error) => any) => Kxhr;
	catch: (onReject: (e: Error) => any) => Kxhr;
	cancel: () => void;
	finally: (onComplete: (k: Kxhr) => void) => Kxhr;
}
