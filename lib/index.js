

exports.createRouter = function(args) {
    /* create a new PB router */
    var pb = args || {};

    if(!pb.backend) { //default backend, in memory
        var inMem = require('.backends/inmemory');
        pb.backend = new inMem.Backend();
    }

    if(!pb.timeOut)  pb.timeOut = 120; //default timeout 2 hrs

    if(!pb.authenticate) {
        pb.authenticate = function() { 
            throw "you must provide an authenticate function";
        };
    }

    pb.avatar = function(id, args, callback) {
        /* creates a new avatar object, takes a unique id and 'args';
           key/values to keep with the avatar. It is important to note
           that anything on the avatar will be kept in the backend until the
           avatar expires.  */
        var av = args || {};
        av._caps = {}; //blessed capabilities

        av.bless = function(capabilitiesMap, callback) {

        };

        av.revoke = function(capabilitiesList, callback) {

        };

        av.expire = function(callback) {

        };

        av.isCurrent = function() {
            if av._ts < 
        };

    };

    pb.findAvatar = function(id, callback) {
        /* finds an avatar by id, returns null if none are found */
        return pb.backend.find(id, callback);
    };

    pb.connectToAJAXAPI = function(service) {
        //register connect/express middleware that makes PB AJAX APIs
        service.use(new require('.connect').Middleware(pb));
    };

    pb.connectToSocketIO = function(io) {
        //take a socket.io service and connect this router to it
        require('.socketio').connect(io, pb);
    };
};
