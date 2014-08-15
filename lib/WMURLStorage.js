(function(global) {
"use strict";

// --- dependency modules ----------------------------------
var JSON         = global["JSON"];
var Promise      = global["Promise"];
var JSZip        = global["WMJSZip"] || require("legokichi.wmjszip.js");
var URLShortener = global["WMURLShortener"] || require("legokichi.wmurlshortener.js");

// --- define / local variables ----------------------------
//var _runOnNode = "process" in global;
//var _runOnWorker = "WorkerLocation" in global;
//var _runOnBrowser = "document" in global;

// --- class / interfaces ----------------------------------
function URLStorage(){
}

//{@dev
URLStorage["repository"] = "https://github.com/legokichi/WMURLStorage.js"; // GitHub repository URL. http://git.io/Help
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
    var promises = strs.map(function(str, i){
        return new Promise(function(resolve, reject){
            var tryCount = 0;
            (function trySave(){
                new URLShortener()["shorten"]("http://"+i+".zip/#"+str, function(err, url){
                    if(!!err){
                        if(0 < tryCount++){
                            reject(err);
                        }else{
                            //{@dev
                            console.info("save(retry):"+tryCount);
                            //}@dev
                            setTimeout(trySave, 1000*tryCount);
                        }
                    }else{ resolve(url); }
                });
            }());
        });
    });
    Promise["all"](promises)["then"](function(urls){
        var json = JSON.stringify(urls);
        //{@dev
        console.info("save(urls.json):"+json);
        //}@dev
        var base64url = _zip(json);
        var longUrl = "http://urls.json/#" + base64url;
        new URLShortener()["shorten"](longUrl, function(err, shortUrl) {
            if(!!err) return callback(err, "");
            callback(null, shortUrl);
        });
    })["catch"](function(err){
        callback(err, "");
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
    zipObj["file"]("data.txt", str);
    var base64 = zipObj["generate"]({ "compression": "DEFLATE" });
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
    zipObj["load"](base64, {"base64": true});
    return zipObj["file"]("data.txt")["asText"]();
}

function URLStorage_load(url,       // @arg URLString
                         callback){ // @arg Function - callback:Function(err:Error, str:String):void
                                    // @ret void
//{@dev
    $args(URLStorage_load, arguments);
//}@dev
    new URLShortener()["expand"](url, function(err, longUrl) {
        if(!!err) return callback(err, "");
        var base64url = longUrl.split("#").slice(1).join("#");
        var json = _unzip(base64url);
        //{@dev
        console.info("load(urls.json):"+json);
        //}@dev
        var urls = JSON.parse(json);
        var promises = urls.map(function(url){
            return new Promise(function(resolve, reject){
                var tryCount = 0;
                (function tryLoad(){
                    new URLShortener()["expand"](url, function(err, longUrl){
                        if(!!err){
                            if(3 < tryCount++){
                                reject(err);
                            }else{
                                //{@dev
                                console.info("save(retry):"+tryCount);
                                //}@dev
                                setTimeout(tryLoad, 1000*tryCount);
                            }
                        }else{
                            var base64url = longUrl.split("#").slice(1).join("#");
                            resolve(base64url);
                        }
                    });
                }());
            });
        });
        Promise["all"](promises)["then"](function(base64urls){
            var base64url = base64urls.join("");
            var str = _unzip(base64url);
            callback(null, str);
        })["catch"](function(err){
            callback(err, "");
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

global["WMURLStorage" in global ? "WMURLStorage_" : "WMURLStorage"] = URLStorage;　// switch module.

})((this || 0).self || global); // WebModule idiom. http://git.io/WebModule
