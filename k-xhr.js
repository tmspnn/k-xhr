import { assign, isObject, isFunction } from 'k-util'

/**
 * @param {String} options.method
 * @param {String} options.url
 * @param {Boolean} options.async, optional, default true
 * @param {String} options.contentType, optional
 * @param {Object} options.headers
 * @param {FormData|ArrayBufferView|Blob|Document} options.data, default null
 * @param {Function} options.beforeSend, optional
 * @return {XMLHttpRequest}
 */
export default function Ajax(options) {
  const xhr = assign(new XMLHttpRequest, {
    async: options.async !== false,
    beforeSend: options.beforeSend,
    callbacks: [],
    cancel: xhrCancel,
    catch: xhrCatch,
    contentType: options.contentType,
    data: options.data || null,
    error: null,
    errorHandlers: [],
    finally: xhrFinally,
    finallyHandler: null,
    headers: options.headers,
    method: (options.method || 'get').toUpperCase(),
    resolve: xhrResolve,
    state: 'pending',
    then: xhrThen,
    timeout: options.timeout || 3000,
    url: options.url,
    value: null,
    withCredentials: options.withCredentials || false
  })
  const { method, url, async, contentType, headers, beforeSend, data } = xhr
  xhr.open(method, url, async)
  if (contentType) {
    xhr.setRequestHeader('Content-Type', contentType)
  }
  if (isObject(headers)) {
    for (let h in headers) {
      if (headers.hasOwnProperty(h)) {
        xhr.setRequestHeader(h, headers[h])
      }
    }
  }
  xhr.onload = () => {
    if (xhr.status >= 200 && xhr.status < 400) {
      xhr.state = 'fulfilled'
      xhr.value = xhr.responseText
      xhr.callbacks.length ? xhr.resolve() : xhr.finally()
    } else {
      xhr.onerror()
    }
  }
  xhr.onerror = () => {
    xhr.state = 'rejected'
    xhr.error = xhr.responseText || xhr.status
    xhr.catch()
  }
  if (isFunction(beforeSend)) {
    beforeSend(xhr)
  }
  setTimeout(() => xhr.send(data))
  return xhr
}

function xhrCancel() {
  this.abort()
  return this
}

function xhrCatch(arg) {
  if (isFunction(arg)) {
    this.errorHandlers.push(arg)
  }
  if (this.state === 'rejected') {
    if (this.errorHandlers.length) {
      this.errorHandlers.forEach(h => h.call(this, this.error))
    }
    this.finally()
  }
  return this
}

function xhrResolve() {
  if (isObject(this.value) && isFunction(this.value.then)) {
    assign(this.value, {
      callbacks: this.value.callbacks.concat(this.callbacks),
      errorHandlers: this.value.errorHandlers.concat(this.errorHandlers),
      finallyHandler: this.finallyHandler
    })
    this.callbacks.length = 0
    this.errorHandlers.length = 0
    this.finallyHandler = null
  } else {
    const resolver = this.callbacks.shift()
    this.value = resolver(this.value)
    this.callbacks.length ? this.resolve() : this.finally()
  }
}

function xhrThen(onResolve) {
  this.callbacks.push(onResolve)
  return this
}

function xhrFinally(arg) {
  if (isFunction(arg)) {
    this.finallyHandler = arg
  } else if (isFunction(this.finallyHandler)) {
    this.finallyHandler()
  }
}
