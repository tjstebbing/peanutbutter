Peanut butter
=============

In a typical (expressjs etc) API server, one creates routes for every API an
entire applcation needs, and in each handler checks to see if the current user
is allowed to access that API. This is both time consuming and error-prone.

Enter Peanut butter (PB&sup1;), a capabilities-based AJAX/JSON API server library. 

Capabilities based, in this context means that when a user authenticates with
the PB service, an _avatar_ is created which represents the user's session on
the server. This avatar is then _blessed_ with _capabilities_ determined by 
your application logic, and these capabilities make up the available API the
client can access. 


&sup1; The name PB is a shout-out to twisted-python's Perspective Broker, which
introduced me to this model many years ago. 


Basic usage
===========

Requiring peanutbutter returns a function that when called returns a pb 
middleware, this function can be passed config options:

timeout : minutes that a session should be kept alive with no interaction.
authenticate : a function which returns a blessed avatar.

You can also assign these values directly if you wish.

```javascript
var app = connect();
var pb = require("peanutbutter")({ timeout : 120 });


pb.authenticate = function(authData, callback) {
    queryYourBackendForUser(function(err, user) {
        if(err) return callback(err, null); 
        var avatar = pb.avatar({userId : user._id}); 
        avatar.bless({forum : forumUserAPI, user: userSettingsAPI});
        return callback(null, avatar);
    } 
};

app.use(connect.bodyParser()).use(pb).listen(8000);
```

Define capabilities
===================

Capabilities are simply an object containing a mapping of name : handler, when
an avatar is blessed with capabilities, they are namespaced with the name they
are given in the object passed to avatar.bless.

```javascript

var forumUserAPI = {

    createPost : function(req, res, avatar) {
        //...
    },
    
    deletePost : function(req, res, avatar) {
        //delete a post
    }
}

```

note: If you wanted to access database connections and other services, you might
create your capabilities and configure pb inside a closure with access to those
things. 
