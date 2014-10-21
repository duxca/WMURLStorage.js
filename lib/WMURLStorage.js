(function(global) {
"use strict";

// --- dependency modules ----------------------------------
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
    var base64url = _zip(str);
    if(base64url["length"] <= 14000){
        var longUrl = "http://data.txt/#" + base64url;
        new URLShortener().shorten(longUrl, function(err, shortUrl) {
            if(!!err) return callback(err, "");
            callback(null, shortUrl);
        });
    }else{
        setTimeout(function(){
            callback(new Error("data too lerge"), "")
        });
    }
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


function WMURLStorage_load(indexUrl,       // @arg URLString
                         callback){ // @arg Function - callback(err:Error|null, str:String):void
                                    // @ret void
//{@dev
    $args(WMURLStorage_load, arguments);
//}@dev
    new URLShortener()["expand"](indexUrl, function(err, longUrl) {
        if(!!err) return callback(err, "");
        var base64url = longUrl.split("#").slice(1).join("#");
        var str = _unzip(base64url);
        callback(null, str);
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
