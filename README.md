# URLStorage.js [![Build Status](https://api.travis-ci.org/legokichi/WMURLStorage.js.png)](http://travis-ci.org/legokichi/WMURLStorage.js)

[![npm](https://nodei.co/npm/legokichi.wmurlstorage.js.png?downloads=true&stars=true)](https://nodei.co/npm/legokichi.wmurlstorage.js/)

Online Storage using [goo.gl](http://goo.gl/) URL Shortener API.

## Document

- [URLStorage.js wiki](https://github.com/legokichi/WMURLStorage.js/wiki/WMURLStorage)
- [Development](https://github.com/uupaa/WebModule/wiki/Development)
- [WebModule](https://github.com/uupaa/WebModule) ([Slide](http://uupaa.github.io/Slide/slide/WebModule/index.html))


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
