/* this is an in-memory backend, not recommended for production */

exports.Backend = function() {
    var self = this;
    self.db = {};

    self.find = function(id, callback) {
        //find an avatar ID or null
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
