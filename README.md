# k-xhr
Lightweight extended XMLHttpRequest

## Installation
#### Node
```
npm install k-xhr
```
#### Browser
```
<script src="node_modules/k-xhr/dist/k-xhr.min.js"></script>
```

## Options
- ```async: Bool``` optional, default ```false```

- ```beforeSend: Function``` optional

- ```contentType: String``` optional

- ```data: FormData|ArrayBufferView|Blob|Document|String``` optional

- ```headers: Object``` optional

- ```method: String``` optional, default ```'GET'```

- ```headers: Object``` optional

- ```timeout: Number``` optional, default ```3000```

- ```url: String``` required

- ```withCredentials: Bool|String``` optional, default ```false```

## Methods
- ```then(h: Function)```

- ```catch(h: Function)```

- ```finally(h: Function)```
