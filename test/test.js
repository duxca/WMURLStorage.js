var ModuleTestURLStorage = (function(global) {

var _runOnNode = "process" in global;
var _runOnWorker = "WorkerLocation" in global;
var _runOnBrowser = "document" in global;

var URLStorage = WMURLStorage;

return new Test("URLStorage", {
        disable:    false,
        browser:    true,
        worker:     true,
        node:       true,
        button:     true,
        both:       false, // test the primary module and secondary module
    }).add([
        test_URLStorage,
    ]).run().clone();

function test_URLStorage(test, pass, miss) {
    var originalStr = "🍣🍣🍣";
    for(var i=0;i<10000;i++){ originalStr+=Math.random()*10|0;}
    new URLStorage().save(originalStr, function(err, shortUrl){
        Valid(Valid.type(err, "Error|null"), test_URLStorage, "err");
        Valid(Valid.type(shortUrl, "String"), test_URLStorage, "shortUrl");
        if(!!err){
            return test.done(miss(err.message));
        }
        new URLStorage().load(shortUrl, function(err, str){
            Valid(Valid.type(err, "Error|null"), test_URLStorage, "err");
            Valid(Valid.type(str, "String"), test_URLStorage, "str");
            if(!!err){
                return test.done(miss(err.message));
            }
            if(originalStr === str){
                test.done(pass(JSON.stringify(str)));
            }else{
                test.done(miss(JSON.stringify(str)));
            }
        });
    });
}

})((this || 0).self || global);
