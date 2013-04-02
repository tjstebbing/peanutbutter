/* this is a mongodb backend , it takes a mongoDB client connection and a 
 * collection name to store avatars in */

mongo = require('mongodb');

exports.Backend = function(db, collection) {
    var self = this;
    var avatars = new mongo.Collection(db, collection);

    self.find = function(id, callback) {
        //find an avatar ID or null
        avatars.findOne(id, function(err, av) {
            if(err) callback(err, null);
            if(av
        };

        if(self.db[id]) {
            if(!self.db[id].isCurrent()) {
                //expire out of date avatars
                return self.expire(id, function(err, success) {
                    return callback(null, null);
                });
            }
            return callback(null, self.db[id]);
        }
        return callback(null, null);
    };

    self.save = function(id, avatar, callback) {
        //save an avatar
        self.db[id] = avatar;
        return callback(null, true);
    };

    self.expire(id, callback) {
        //removes an avatar from the store
        if(self.db[id]) delete self.db[id];
        return callback(null, true);
    }
};
