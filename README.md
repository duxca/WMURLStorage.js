# URLStorage.js [![Build Status](https://api.travis-ci.org/legokichi/URLStorage.js.png)](http://travis-ci.org/legokichi/URLStorage.js)

[![npm](https://nodei.co/npm/legokichi.urlstorage.js.png?downloads=true&stars=true)](https://nodei.co/npm/legokichi.urlstorage.js/)

Online Storage using [goo.gl](http://goo.gl/) URL Shortener API.

## Document

- [URLStorage.js wiki](https://github.com/legokichi/URLStorage.js/wiki/URLStorage)
- [Development](https://github.com/uupaa/WebModule/wiki/Development)
- [WebModule](https://github.com/uupaa/WebModule) ([Slide](http://uupaa.github.io/Slide/slide/WebModule/index.html))


## How to use

### Browser

```js
<script src="vender/jszip.js"></script>
<script src="lib/URLStorage.js"></script>
<script>
new URLStorage().save("🍣🍣🍣", function(err, url){
    console.log(url);
});
</script>
```

### WebWorkers

```js
importScripts("vender/jszip.js");
importScripts("lib/URLStorage.js");

new URLStorage().save("🍣🍣🍣", function(err, url){
    console.log(url);
});
```
