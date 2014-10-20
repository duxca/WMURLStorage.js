# WMURLStorage.js [![Build Status](https://travis-ci.org/duxca/WMURLStorage.js.png)](http://travis-ci.org/duxca/WMURLStorage.js)

[![npm](https://nodei.co/npm/duxca.wmurlstorage.js.png?downloads=true&stars=true)](https://nodei.co/npm/duxca.wmurlstorage.js/)


## Document

- [WMURLStorage.js wiki](https://github.com/duxca/WMURLStorage.js/wiki/WMURLStorage)
- [WebModule](https://github.com/uupaa/WebModule)
    - [Slide](http://uupaa.github.io/Slide/slide/WebModule/index.html)
    - [Development](https://github.com/uupaa/WebModule/wiki/Development)

## How to use

### Browser

```js
<script src="lib/WMURLStorage.js"></script>
<script>
new WMURLStorage().save("🍣🍣🍣", function(err, url){
    console.log(url);
});
</script>
```

### WebWorkers

```js
importScripts("lib/URLStorage.js");

new WMURLStorage().save("🍣🍣🍣", function(err, url){
    console.log(url);
});
```

### Node.js

```js
var WMURLStorage = require("lib/WMURLStorage.js");

new WMURLStorage().save("🍣🍣🍣", function(err, url){
    console.log(url);
});
```
