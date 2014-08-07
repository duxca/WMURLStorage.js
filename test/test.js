var ModuleTestURLStorage = (function(global) {

var _runOnNode = "process" in global;
var _runOnWorker = "WorkerLocation" in global;
var _runOnBrowser = "document" in global;

return new Test("URLStorage", {
        disable:    false,
        browser:    true,
        worker:     false,
        node:       false,
        button:     true,
        both:       false, // test the primary module and secondary module
    }).add([
        test_URLStorage,
    ]).run().clone();

function test_URLStorage(test, pass, miss) {
    var originalStr = "🍣🍣🍣";
    new URLStorage().save(originalStr, function(err, shortUrl){
        Valid(Valid.type(err, "Error|null"), test_URLStorage, "err");
        Valid(Valid.type(shortUrl, "String"), test_URLStorage, "shortUrl");
        if(!!err){
            return test.done(miss(err));
        }
        new URLStorage().load(url, function(err, str){
            Valid(Valid.type(err, "Error|null"), test_URLStorage, "err");
            Valid(Valid.type(str, "String"), test_URLStorage, "str");
            if(!!err){
                return test.done(miss(err));
            }
            if(originalStr === str){
                test.done(pass(JSON.storingify(str)));
            }else{
                test.done(miss(JSON.storingify(str)));
            }
        });
    });
}

})((this || 0).self || global);
