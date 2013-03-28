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



