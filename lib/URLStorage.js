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

URLStorage["prototype"]["save"]     = URLStorage_save;     // URLStorage#save(str:String, callback:Function):void
URLStorage["prototype"]["load"]     = URLStorage_load;     // URLStorage#load(url:URLString, callback:Function):void

// --- implements ------------------------------------------
function URLStorage_save(str,       // @arg String
                         callback){ // @arg Function - callback:Function(err:Error, url:URLString):void
                                    // @ret void
//{@dev
    $args(URLStorage_save, arguments);
//}@dev
    var base64url = _zip(str);
    var strs = _split(base64url, 14000);
    var task = new Task(strs.length, function(err, urls){
        if(!!err) return callback(err, "");
        var base64url = _zip(JSON.stringify(urls));
        var longUrl = "http://urls.json/#" + base64url;
        new URLShortener().shorten(longUrl, function(err, shortUrl) {
            if(!!err) return callback(err, "");
            callback(null, shortUrl);
        });
    });
    strs.forEach(function(str, i){
        new URLShortener().shorten("http://"+i+".zip/#"+str, function(err, url){
            task["set"](i, url);
            task["done"](err);
        });
    });
}

function _split(str, // @arg String
                n){  // @arg Number
                     // @ret StringArray
//{@dev
    $args(_zip, arguments);
//}@dev
    var strs = [];
    for(var i=0; i<=Math.ceil(str.length/n)-1; i++){
        strs.push(str.substring(i*n, (i+1)*n));
    }
    return strs;
}

function _zip(str){ // @arg String
                    // @ret Base64URLString - base64url encoding
//{@dev
    $args(_zip, arguments);
//}@dev
    var zipObj = new JSZip();
    zipObj.file("data.txt", str);
    var base64 = zipObj.generate({ compression: "DEFLATE" });
    var base64url = base64.split("+").join("-").split("/").join("_");
    return base64url;
}

function _unzip(base64url){ // @arg Base64URLString - base64url encoding
                            // @ret String
//{@dev
    $args(_unzip, arguments);
//}@dev
    var base64 = base64url.split("-").join("+").split("_").join("/");
    var zipObj = new JSZip();
    zipObj.load(base64, {base64: true});
    return zipObj.file("data.txt").asText();
}

function URLStorage_load(url,       // @arg URLString
                         callback){ // @arg Function - callback:Function(err:Error, str:String):void
                                    // @ret void
//{@dev
    $args(URLStorage_load, arguments);
//}@dev
    new URLShortener().expand(url, function(err, longUrl) {
        if(!!err) return callback(err, "");
        var base64url = longUrl.split("#").slice(1).join("#");
        var urls = JSON.parse(_unzip(base64url));
        var task = new Task(urls.length, function(err, base64urls){
            if(!!err) return callback(err, "");
            var base64url = base64urls.join("");
            var str = _unzip(base64url);
            callback(null, str);
        });
        urls.forEach(function(url, i){
            new URLShortener().expand(url, function(err, longUrl){
                var base64url = longUrl.split("#").slice(1).join("#");
                task["set"](i, base64url);
                task["done"](err);
            });
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
