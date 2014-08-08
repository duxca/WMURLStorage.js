# URLStorage.js [![Build Status](https://api.travis-ci.org/legokichi/WebModule.URLStorage.js.png)](http://travis-ci.org/legokichi/WebModule.URLStorage.js)

[![npm](https://nodei.co/npm/legokichi.urlstorage.js.png?downloads=true&stars=true)](https://nodei.co/npm/legokichi.urlstorage.js/)

Online Storage using [goo.gl](http://goo.gl/) URL Shortener API.

## Document

- [URLStorage.js wiki](https://github.com/legokichi/WebModule.URLStorage.js/wiki/URLStorage)
- [Development](https://github.com/uupaa/WebModule/wiki/Development)
- [WebModule](https://github.com/uupaa/WebModule) ([Slide](http://uupaa.github.io/Slide/slide/WebModule/index.html))


## How to use

### Browser

```js
<script src="lib/WebModule.URLStorage.js"></script>
<script>
var URLStorage = WebModule.URLStorage;
new URLStorage().save("🍣🍣🍣", function(err, url){
    console.log(url);
});
</script>
```

### WebWorkers

```js
importScripts("lib/URLStorage.js");

var URLStorage = WebModule.URLStorage;
new URLStorage().save("🍣🍣🍣", function(err, url){
    console.log(url);
});
```
