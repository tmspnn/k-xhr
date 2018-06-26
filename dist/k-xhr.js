"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function kXhr(options) {
    var xhr = Object.assign(new XMLHttpRequest(), {
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
    });
    xhr.open(xhr.method, xhr.url, xhr.async);
    if (xhr.contentType) {
        xhr.setRequestHeader('Content-Type', xhr.contentType);
    }
    if (xhr.headers) {
        for (var h in xhr.headers) {
            if (xhr.headers.hasOwnProperty(h)) {
                xhr.setRequestHeader(h, xhr.headers[h]);
            }
        }
    }
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 400) {
            xhr.state = 'fulfilled';
            xhr.value = xhr.responseText;
            xhr.resolve();
        }
        else {
            xhr.onerror();
        }
    };
    xhr.onerror = function () {
        xhr.state = 'rejected';
        xhr.error = xhr.responseText || xhr.status;
        xhr.reject();
    };
    if (xhr.beforeSend) {
        xhr.beforeSend(xhr);
    }
    setTimeout(function () { return xhr.send(xhr.data); });
    return xhr;
    function xhrResolve() {
        var _a;
        if (xhr.value && xhr.value.extendedBy == 'k-xhr') {
            (_a = xhr.value.callbacks).push.apply(_a, xhr.callbacks);
            xhr.value.finallyHandler = xhr.finallyHandler;
            xhr.callbacks.length = 0;
            xhr.finallyHandler = null;
        }
        else {
            var cb = void 0;
            while ((cb = xhr.callbacks.shift())) {
                if (cb.type == 'resolve') {
                    try {
                        xhr.value = cb.handler(xhr.value);
                    }
                    catch (e) {
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
        var cb;
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
    function xhrThen(onResolve, onReject) {
        xhr.callbacks.push({ type: 'resolve', handler: onResolve });
        if (onReject) {
            xhr.callbacks.push({ type: 'reject', handler: onReject });
        }
        return xhr;
    }
    function xhrCatch(onReject) {
        xhr.callbacks.push({ type: 'reject', handler: onReject });
        return xhr;
    }
    function xhrCancel() {
        xhr.abort();
    }
    function xhrFinally(onComplete) {
        xhr.finallyHandler = onComplete;
        return xhr;
    }
}
exports.default = kXhr;
//# sourceMappingURL=k-xhr.js.map