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
        both:       true, // test the primary module and secondary module
    }).add([
        test_URLStorage,
    ]).run().clone();

function test_URLStorage(test, pass, miss) {
    var length = 10000;
    var original = new Uint8Array(length);

    for(var i=0; i < length; i++){
        original[i] = Math.random()*255|0;
    }

    new URLStorage().save(original, function(err, shortUrl){
        Valid(Valid.type(err, "Error|null"), test_URLStorage, "err");
        Valid(Valid.type(shortUrl, "String"), test_URLStorage, "shortUrl");
        if(!!err){
            return test.done(miss(err.message));
        }
        new URLStorage().load(shortUrl, function(err, arr){
            Valid(Valid.type(err, "Error|null"), test_URLStorage, "err");
            Valid(Valid.type(arr, "Uint8Array"), test_URLStorage, "arr");
            if(!!err){
                return test.done(miss(err.message));
            }
            for(var i=0; i < length; i++){
                if(original[i] !== arr[i]){
                    return test.done(miss());
                }
            }
            test.done(pass());
        });
    });
}

})((this || 0).self || global);
