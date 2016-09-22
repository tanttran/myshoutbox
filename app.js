var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var bcrypt = require('bcryptjs');
var jwt = require('jwt-simple');

var path = require('path');
app.use(bodyParser.json());


var JWT_SECRET = 'shoutBox';

var db = null;
MongoClient.connect("mongodb://localhost:27017/myshoutbox", function(err, dbconn) {
  if(!err) {
    console.log("MONGODB connected");
    db = dbconn;
  }
});

app.use(express.static(__dirname + '/public'));


app.get('/featuredshouts', function(req, res, next) {
  db.collection('featured', function(err, featuredCollection) {
    featuredCollection.find().toArray(function(err, featured) {
      console.log(featured);
      return res.json(featured);
    });
  });
}); 

app.post('/featuredshouts', function(req, res, next){

  var token = req.headers.authorization;
  var user = jwt.decode(token, JWT_SECRET);

  console.log(token);

  db.collection('featured', function(err, featuredCollection) {
    var newShout = {
      text: req.body.newShout,
      user: user._id,
      username: user.username
    };

    featuredCollection.insert(newShout, {w:1}, function(err) {
      return res.send();
    });
  });
});

app.put('/featuredshouts/remove', function(req, res, next){

  var token = req.headers.authorization;
  var user = jwt.decode(token, JWT_SECRET);

  db.collection('featured', function(err, featuredCollection) {
    var shoutId = req.body.shout._id;

    featuredCollection.remove({_id: ObjectId(shoutId), user: user._id}, {w:1}, function(err, result) {

      return res.send();
    });
  });
});

// no password encrytpion //

app.post('/users', function(req, res, next){
  db.collection('users', function(err, usersCollection) {
    var newUser = {
      username: req.body.username,
      password: req.body.password
    };
    usersCollection.insert(newUser, {w:1}, function(err) {
      return res.send();
    });
  });
});

app.put('/users/login', function(req, res, next){
  
  console.log(req.body);

  db.collection('users', function(err, usersCollection) {

    usersCollection.findOne({username: req.body.username, password: req.body.password}, function(err, user) {

        if(user) {
          var mytoken = jwt.encode(user, JWT_SECRET);
          return res.json({token: mytoken});
        } 
        if (err) {
          return res.status(500).send();
        }

        if(!user) {
          return res.status(400).send();
        }

        return res.status(200).send();
      });

    });
    
  });


// app.post('/users', function(req, res, next){

//   db.collection('users', function(err, usersCollection) {
//     bcrypt.genSalt(10, function(err, salt) {
//       console.log(salt);
//       bcrypt.hash(req.body.password, salt, function(err, hash) {
//         console.log(hash);
//         var newUser = {
//           username: req.body.username,
//           password: hash
//         };
//         usersCollection.insert(newUser, {w:1}, function(err) {
//           return res.send();
//         });
//       });
//     });

    
//   });
// });

// app.put('/users/login', function(req, res, next){
  
//   console.log(req.body);

//   db.collection('users', function(err, usersCollection) {

//     usersCollection.findOne({username: req.body.username}, function(err, user) {

//       bcrypt.compare(req.body.password, user.password, function(err, result){
//         if(result) {
//           var mytoken = jwt.encode(user, JWT_SECRET);

//           return res.json({token: mytoken});
//         } else {
//           return res.status(400).send
//         }
//       });

//     });
    
//   });
// });


app.listen(1337, function (){
  console.log('app is running on port 1337');

});