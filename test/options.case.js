(function optionsCase() {
  var kXhr = window.kXhr;

  if (typeof kXhr != "function") {
    return new TypeError("kXhr is not executable");
  }

  var xhr = kXhr({
    url: "http://httpbin.org/post?custom_param=1",
    method: "post",
    async: true,
    contentType: "application/json",
    headers: { "X-Custom-Header": "testing" },
    withCredentials: true,
    data: JSON.stringify({ postData: { msg: "Running POST test" } }),
    beforeSend: xhr => {
      xhr.beforeSendCalled = true;
      xhr.progressRecords = [];
    },
    onprogress: e => {
      e.currentTarget.progressRecords.push(e);
    },
    timeout: 3000
  });

  return xhr.then(resText => {
    var res = JSON.parse(resText);

    if (typeof res.args.custom_param != "string") {
      return new TypeError("res.args.custom_param is not a string");
    }

    if (typeof res.data != "string") {
      return new TypeError("res.data is not a string");
    }

    if (typeof res.headers["X-Custom-Header"] != "string") {
      return new TypeError("res.headers.[X-Custom-Header] is not a string");
    }

    if (typeof res.headers["Content-Type"] != "string") {
      return new TypeError("res.headers.[X-Custom-Header] is not a string");
    }

    if (!xhr.withCredentials) {
      return new Error("xhr.withCredentials is not correctly set");
    }

    return 0;
  });
})();
