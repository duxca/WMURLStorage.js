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
    var json = {};
    new URLStorage().save(json, function(err, shortUrl){
        Valid(Valid.type(err, "Error|null"), test_URLStorage, "err");
        Valid(Valid.type(shortUrl, "String"), test_URLStorage, "shortUrl");
        if(!!err){
            return test.done(miss(err));
        }
        new URLStorage().load(url, function(err, _json){
            Valid(Valid.type(err, "Error|null"), test_URLStorage, "err");
            Valid(Valid.type(_json, "JSON"), test_URLStorage, "_json");
            if(!!err){
                return test.done(miss(err));
            }
            if(JSON.storingify(json) === JSON.storingify(_json)){
                test.done(pass(JSON.storingify(_json)));
            }else{
                test.done(miss(JSON.storingify(_json)));
            }
        });
    });
}

})((this || 0).self || global);
