# Peanut butter

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


# Basic usage

## Server 

Requiring peanutbutter returns a function that when called returns a pb 
object, this function can be passed config options:

 * timeout : minutes that a session should be kept alive with no interaction.
 * authenticate : a function which returns a blessed avatar.
 
You can also assign these values directly if you wish.

```javascript
var app = connect();
var pb = require("peanutbutter")({ timeout : 120 });


pb.authenticate = function(authData, callback) {
    queryYourBackendForUser(function(err, user) {
        if(err) return callback(err, null); 
        var avatar = pb.avatar(user._id); 
        avatar.bless({forum : forumUserAPI, user: userSettingsAPI});
        return callback(null, avatar);
    } 
};


app.use(connect.bodyParser()).use(pb.middleware).listen(8000);
```

## Define capabilities

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


## client side

You can call this however you like, depending on your client library of choice,
this example uses https://github.com/ForbesLindesay/ajax which is a stand-alone
implementation of jQuery.ajax. 

```javascript

var av = {}; //some place to store the returned info

// Authenticate, data is passed to your authenticate handler on the server.
ajax('/authenticate', {
    type : 'POST',
    data : { user: 'Aurora', pass: 'secrets'}, 
    success : function(avatar) {
        av = avatar;
    }
});

/* Subsequent requests must set PB-Session-Token headers to avatar.sessionId,
 * I'd personally wrap this all up in a helper (perhaps I should write a 
 * client library to go with this..
 */

ajax(av.forum.createPost, {
    type : 'POST',
    headers : { 'PB-Session-Token' : av.sessionId },
    data : { title: 'My cool post', body: 'Once, I had a beetle..'}, 
});

```


# API

## pb object: returned from require("peanutbutter")() factory.

### pb.middleware

A connect middleware that serves the API.

### pb.timeout

An integer, time in minutes to remove the avatar if no activity.

### pb.authenticate

A function which takes some authData and a callback(err, avatar). This function
should authenticate the user using the authData provided by the client, and
return an avatar object created using pb.avatar.

### pb.avatar(id, { /* extra avatar attributes */ });

pb.avatar creates a new avatar object, takes a unique id and optional 
key/values to keep with the avatar. It is important to note that anything on
the avatar will be kept in memory until the avatar expires.

### pb.findAvatar(id);

returns an avatar if it already exists with given id. Useful for expiring 
avatars en masse, blessing or revoking capabilities on avatars from app 
logic that already exist, etc.

## avatar object: returned from pb.avatar(id) factory.

### avatar.bless({ foo : fooAPI, ... });

Bless grants the client for this avatar access to a set of capabilities 

### avatar.revoke(["foo"]); 

Revoke removes access to one or more sets of capabilities.

### avatar.expire(); 

Remove the avatar, user will need to re-authenticate.



