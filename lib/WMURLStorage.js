(function(global) {
"use strict";

// --- dependency modules ----------------------------------
var JSON         = global["JSON"];
var Task         = global["Task"]           || require("uupaa.task.js");
var JSZip        = global["WMJSZip"]        || require("duxca.wmjszip.js");
var URLShortener = global["WMURLShortener"] || require("duxca.wmurlshortener.js");

// --- define / local variables ----------------------------
//var _runOnNode = "process" in global;
//var _runOnWorker = "WorkerLocation" in global;
//var _runOnBrowser = "document" in global;

// --- class / interfaces ----------------------------------
function WMURLStorage(opt){
    opt = opt || {};
    this["parallelConnection"] = opt["parallelConnection"] || 3;
}

//{@dev
WMURLStorage["repository"] = "https://github.com/duxca/WMURLStorage.js"; // GitHub repository URL. http://git.io/Help
//}@dev

WMURLStorage["prototype"]["save"] = WMURLStorage_save; // WMURLStorage#save(str:String, callback:Function):void
WMURLStorage["prototype"]["load"] = WMURLStorage_load; // WMURLStorage#load(url:URLString, callback:Function):void

// --- implements ------------------------------------------
function WMURLStorage_save(str,       // @arg String
                           callback){ // @arg Function - callback(err:Error|null, url:URLString):void
                                      // @ret void
//{@dev
    $args(WMURLStorage_save, arguments);
//}@dev
    var that = this;
    var base64url = _zip(str);
    var chunks = _split(base64url, 14000);
    var parallelChunks = [];
    while(chunks["length"] > 0){
        parallelChunks["push"](chunks["splice"](0, that["parallelConnection"]));
    }
    var shortUrls = [];
    (function recur(offsetIndex){
        if(parallelChunks["length"] <= 0){
            _makeIndexURL(shortUrls, function(err, indexUrl){
                if(!!err) return callback(err, "");
                callback(null, indexUrl);
            });
        }else{
            var chunks = parallelChunks["shift"]();
            _parallelUpload(offsetIndex, chunks, function(err, urls){
                if(!!err) return callback(err, "");
                shortUrls = []["concat"](shortUrls, urls);
                recur(offsetIndex + 6);
            });
        }
    }(0));
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
    zipObj["file"]("data.txt", str);
    var base64 = zipObj["generate"]({ "compression": "DEFLATE" });
    var base64url = base64.split("+").join("-").split("/").join("_");
    return base64url;
}

function _makeIndexURL(urls,      // @arg URLStringArray
                       callback){ // @arg Function - callback(err:Error|null, url:URLString):void
                                  // @ret void
//{@dev
    $args(_makeIndexURL, arguments);
//}@dev
    var base64url = _zip(JSON.stringify(urls));
    var longUrl = "http://urls.json/#" + base64url;
    new URLShortener({"maximumRetryCount": 20})["shorten"](longUrl, function(err, shortUrl) {
        if(!!err) return callback(err, "");
        callback(null, shortUrl);
    });
}

function _parallelUpload(offsetIndex, // @arg Number
                         chunks,      // @arg StringArray
                         callback){   // @arg Function - callback(err:Error|null, urls:URLStringArray):void
                                      // @ret void
//{@dev
    $args(_parallelUpload, arguments);
//}@dev
    var task = new Task(chunks["length"], function(err, shortUrls){
        if(!!err) return callback(err, "");
        callback(null, shortUrls);
    });
    chunks["forEach"](function(chunk, i){
        new URLShortener({"maximumRetryCount": 20})["shorten"]("http://"+(offsetIndex+i)+".zip/#"+chunk, function(err, shortUrl){
            if(!!err) return task["done"](err);
            task["set"](i, shortUrl);
            task["done"](err);
        });
    });
}

function _unzip(base64url){ // @arg Base64URLString - base64url encoding
                            // @ret String
//{@dev
    $args(_unzip, arguments);
//}@dev
    var base64 = base64url.split("-").join("+").split("_").join("/");
    var zipObj = new JSZip();
    zipObj["load"](base64, {"base64": true});
    return zipObj["file"]("data.txt")["asText"]();
}

function _decodeIndexURL(indexUrl,  // @arg URLString
                         callback){ // @arg Function - callback(err:Error|null, chunkUrls:URLString):void
                                    // @ret void
//{@dev
    $args(_decodeIndexURL, arguments);
//}@dev
    new URLShortener({"maximumRetryCount": 20})["expand"](indexUrl, function(err, longUrl) {
        if(!!err) return callback(err, "");
        var base64url = longUrl.split("#").slice(1).join("#");
        var json = _unzip(base64url);
        var chunkUrls = JSON.parse(json);
        callback(null, chunkUrls);
    });
}

function _parallelDownload(chunkUrls,   // @arg URLStringArray
                           callback){   // @arg Function - callback:Function(err:Error|null, chunks:StringArray):void
                                        // @ret void
//{@dev
    $args(_parallelDownload, arguments);
//}@dev
    var task = new Task(chunkUrls["length"], function(err, shortUrls){
        if(!!err) return callback(err, "");
        callback(null, shortUrls);
    });
    chunkUrls["forEach"](function(chunkUrl, i){
        new URLShortener({"maximumRetryCount": 20})["expand"](chunkUrl, function(err, chunk){
            if(!!err) return task["done"](err);
            task["set"](i, chunk["split"]("#")["slice"](1)["join"]("#"));
            task["done"](err);
        });
    });
}

function WMURLStorage_load(indexUrl,  // @arg URLString
                           callback){ // @arg Function - callback(err:Error|null, str:String):void
                                      // @ret void
//{@dev
    $args(WMURLStorage_load, arguments);
//}@dev
    var that = this;
    _decodeIndexURL(indexUrl, function(err, chunkUrls){
        if(!!err) return callback(err, "");
        var parallelChunkUrls = [];
        while(chunkUrls["length"] > 0){
            parallelChunkUrls["push"](chunkUrls["splice"](0, that["parallelConnection"]));
        }
        var buffer = "";
        (function recur(){
            if(parallelChunkUrls["length"] <= 0){
                callback(null, _unzip(buffer));
            }else{
                var chunkUrls = parallelChunkUrls["shift"]();
                _parallelDownload(chunkUrls, function(err, chunks){
                    if(!!err) return callback(err, "");
                    buffer += chunks["join"]("");
                    recur();
                });
            }
        }());
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
    module["exports"] = WMURLStorage;
}

global["WMURLStorage" in global ? "WMURLStorage_" : "WMURLStorage"] = WMURLStorage;　// switch module.

})((this || 0).self || global); // WebModule idiom. http://git.io/WebModule
