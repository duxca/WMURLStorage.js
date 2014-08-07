(function(global) {
"use strict";

// --- dependency modules ----------------------------------
var JSZip        = global["JSZip"] || require("JSZip");
var Task         = global["Task"] || require("uupaa.task.js");
var URLShortener = global["URLShortener"] || require("legokichi.urlshortener.js");

// --- define / local variables ----------------------------
//var _runOnNode = "process" in global;
//var _runOnWorker = "WorkerLocation" in global;
//var _runOnBrowser = "document" in global;

// --- class / interfaces ----------------------------------
function URLStorage(){
}

//{@dev
URLStorage["repository"] = "https://github.com/legokichi/URLStorage.js"; // GitHub repository URL. http://git.io/Help
//}@dev

URLStorage["prototype"]["save"]     = URLStorage_save;     // URLStorage#save(json:JSONObject, callback:Function):void
URLStorage["prototype"]["load"]     = URLStorage_load;     // URLStorage#load(url:URLString, callback:Function):void

// --- implements ------------------------------------------
function URLStorage_save(json,      // @arg JSONObject
                         callback){ // @arg Function - callback:Function(err:Error, url:URLString):void
                                    // @ret void
//{@dev
    $args(URLStorage_save, arguments);
//}@dev
    var base64 = jsonToZippedString(json);
    base64ToShortURLs(base64, function(err, urls) {
        if(!!err) return callback(err, "");
        var _base64 = jsonToZippedString({ "urls.json": JSON.stringify(urls) });
        var longUrl = "http://urls.json/#" + _base64;
        new URLShortener().shorten(longUrl, function(err, shortUrl) {
            if(!!err) return callback(err, "");
            callback(null, shortUrl);
        });
    });
}

function URLStorage_load(url,       // @arg URLString
                         callback){ // @arg Function - callback:Function(err:Error, json:JSONObject):void
                                    // @ret void
//{@dev
    $args(URLStorage_load, arguments);
//}@dev
    new URLShortener().expand(url, function(err, longUrl) {
        if(!!err) return callback(err, "");
        var tmp = longUrl.split("#");
        var base64 = tmp.slice(1).join("#");
        var files = zippedStringToJson(base64);
        var urls = JSON.parse(files["urls.json"]);
        shortURLsToBase64(urls, function(err, base64){
            if(!!err) return callback(err, "");
            var files = zippedStringToJson(base64);
            callback(null, files);
        });
    });
}

function jsonToZippedString(json){ // @arg JSONObject
                                   // @ret Base64String
//{@dev
    $args(jsonToZippedString, arguments);
//}@dev
    var zipObj = new JSZip();
    Object.keys(json).forEach(function(key) {
        zipObj.file(key, json[key]);
    });
    return zipObj.generate({ compression: "DEFLATE" });
}

function zippedStringToJson(base64){ // @arg Base64String
                                     // @ret JSONObject
//{@dev
    $args(zippedStringToJson, arguments);
//}@dev
    var zipObj = new JSZip();
    zipObj.load(base64, {base64: true});
    return Object.keys(zipObj.files).reduce(function(dic, key){
        dic[key] = zipObj.file(key).asText();
        return dic;
    }, {});
}

function base64ToShortURLs(base64,    // @arg Base64String
                           callback){ // @arg Function - callback(err:Error, urls:URLStringArray):void
                                      // @ret void
//{@dev
    $args(base64ToShortURLs, arguments);
//}@dev
    var n = 14000;
    var strs = [];
    for(var i=0; i<=Math.ceil(base64.length/n)-1; i++){
        strs.push(base64.substring(i*n, (i+1)*n));
    }
    var task = new Task(strs.length, function(err, urls){
        if(!!err) return callback(err, "");
        callback(err, urls);
    });
    strs.forEach(function(str, i){
        new URLShortener().shorten("http://#{i}.zip/#"+str, function(err, url){
            task["set"](i, url);
            task["done"](err);
        });
    });
}

function shortURLsToBase64(urls,      // @arg URLStringArray
                           callback){ // @arg Function - callback(err:Error, base64:Base64Array):void
                                      // @ret void
//{@dev
    $args(shortURLsToBase64, arguments);
//}@dev
    var task = new Task(urls.length, function(err, base64s){
        if(!!err) return callback(err, "");
        callback(err, base64s.join(""));
    });
    urls.forEach(function(url, i){
        new URLShortener().expand(url, function(err, longUrl){
            var tmp = longUrl.split("#");
            var base64 = tmp.slice(1).join("#");
            task["set"](i, base64);
            task["done"](err);
        });
    });
}

// --- validate / assertions -------------------------------
//{@dev
//function $valid(val, fn, hint) { if (global["Valid"]) { global["Valid"](val, fn, hint); } }
//function $type(obj, type) { return global["Valid"] ? global["Valid"].type(obj, type) : true; }
//function $keys(obj, str) { return global["Valid"] ? global["Valid"].keys(obj, str) : true; }
//function $some(val, str, ignore) { return global["Valid"] ? global["Valid"].some(val, str, ignore) : true; }
function $args(fn, args) { if (global["Valid"]) { global["Valid"].args(fn, args); } }
//}@dev

// --- exports ---------------------------------------------
if ("process" in global) {
    module["exports"] = URLStorage;
}
global["URLStorage" in global ? "URLStorage_" : "URLStorage"] = URLStorage; // switch module. http://git.io/Minify

})((this || 0).self || global); // WebModule idiom. http://git.io/WebModule
