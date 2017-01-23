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
## QuickStart
```javascript
import Ajax from 'k-xhr'

Ajax({ url: '/' })
    .then(responseText => console.log(responseText))
    .catch(e => console.error(e)) // e will be the responseText or status code
    .finally(() => console.log('XMLHttpRequest finished')) // finally will envoke after the xhr is fulfilled or rejected
```

## Options
- ```async: Bool``` optional, default ```false```

- ```beforeSend: Function``` optional

- ```contentType: String``` optional

- ```data: FormData|ArrayBufferView|Blob|Document|String``` optional

- ```headers: Object``` optional

- ```method: String``` optional, default ```'GET'```

- ```headers: Object``` optional

- ```timeout: Number``` optional, default ```0```

- ```url: String``` required

- ```withCredentials: Bool|String``` optional, default ```false```

## Methods
- ```then(h: Function)```

- ```catch(h: Function)```

- ```finally(h: Function)```

- ```cancel()``` cancel the request

```catch``` and ```finally``` will envode with ```this``` set to the XMLHttpRequest instance itself
