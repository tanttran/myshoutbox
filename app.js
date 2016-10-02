var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var bcrypt = require('bcryptjs');
var jwt = require('jwt-simple');
var morgan = require('morgan');
var mongoose = require('mongoose');

var path = require('path');


// var server = require('http').createServer(app);
// var io = require('socket.io').listen(server);


// io.on('connection', function (socket) {
//   console.log('new client connected');
// });


// server.listen(process.env.PORT || 8000);


var JWT_SECRET = 'shoutBox';

app.use(bodyParser.json());

app.use(morgan(':method :url :response-time'));

// app.use(morgan('combined'));

// var db = null;
// MongoClient.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/myshoutbox", function(err, dbconn) {
//   if(!err) {
//     console.log("MONGODB connected");
//     db = dbconn;
//   }
// });

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/myshoutbox", function(err, dbconn) {
  if(!err) {
    console.log("MONGOOSE connected");
    db = dbconn;
  }
});

var Featured = mongoose.model('featured', { 
  text: { type: String, required: true, minlength: 1},
  user: String,
  username: String,
  deactivated: { type: Boolean, default: false},
  created: { type: Date, default: Date.now }
});

var Sports = mongoose.model('sport', { 
  text: { type: String, required: true, minlength: 1},
  user: String,
  username: String,
  deactivated: { type: Boolean, default: false},
  created: { type: Date, default: Date.now }
});

var Music = mongoose.model('music', { 
  text: { type: String, required: true, minlength: 1},
  user: String,
  username: String,
  deactivated: { type: Boolean, default: false},
  created: { type: Date, default: Date.now }
});

var Users = mongoose.model('users', { 
  username: String,
  password: String,
  email: String,
  created: { type: Date, default: Date.now }
});

app.use(express.static(__dirname + '/public'));


app.get('/featuredshouts', function(req, res, next) {

  Featured.find({deactivated: false})
  .sort('-created')
  .limit(10)
  .exec (function(err, featured) {
    return res.json(featured);
  });
  // db.collection('featureds', function(err, featuredsCollection) {
  //   featuredsCollection.find({deactivated: false}).toArray(function(err, featured) {
  //     console.log(featured);
  //     return res.json(featured);
  //   });
  // });
});


app.get('/sportsshouts', function(req, res, next) {

  Sports.find({deactivated: false}) 
  .sort('-created')
  .limit(10)
  .exec (function(err, sports){
    return res.json(sports);
  });
  // db.collection('sports', function(err, sportsCollection) {
  //   sportsCollection.find().toArray(function(err, sports) {
  //     console.log(sports);
  //     return res.json(sports);
  //   });
  // });
});

app.get('/musicshouts', function(req, res, next) {
  Music.find({deactivated: false})
  .sort('-created')
  .limit(10)
  .exec (function(err, music){
    return res.json(music);
  });
  // db.collection('musics', function(err, musicsCollection) {
  //   musicsCollection.find().toArray(function(err, music) {
  //     console.log(music);
  //     return res.json(music);
  //   });
  // });
});    

app.post('/featuredshouts', function(req, res, next){

  var token = req.headers.authorization;
  var user = jwt.decode(token, JWT_SECRET);

  console.log(token);
  console.log(req.body);

  // db.collection('featured', function(err, featuredCollection) {

    var newFeatured = new Featured({ 
      text: req.body.newShout,
      user: user._id,
      username: user.username 
    });
    // var newShout = {
    //   text: req.body.newShout,
    //   user: user._id,
    //   username: user.username
    // };
    // if (req.body.newShout.length < 1) {
    //   return res.status(400).send('Shouts cannot be blank');
    // }

    newFeatured.save(function(err) {
      if (err) return res.status(400).send(err);
      // io.emit('newFeatured');
      return res.send();
    });
    // featuredCollection.insert(newShout, {w:1}, function(err) {
    //   return res.send();
    // });
  // });

});

app.post('/sportsshouts', function(req, res, next){

  var token = req.headers.authorization;
  var user = jwt.decode(token, JWT_SECRET);

  console.log(token);
  console.log(req.body);

  var newSport = new Sports({ 
    text: req.body.sportsShout,
    user: user._id,
    username: user.username 
  });

  newSport.save(function(err) {
    if (err) return res.status(400).send(err);
    // io.emit('newSport');
    return res.send();
  });
  // if (req.body.sportsShout.length < 1) {
  //   return res.status(400).send('Shouts cannot be blank');
  // }
  // newSport.save(function(err) {
  //   return res.send();
  // });

});

app.post('/musicshouts', function(req, res, next){

  var token = req.headers.authorization;
  var user = jwt.decode(token, JWT_SECRET);

  console.log(token);
  console.log(req.body);

  var newMusic = new Music({ 
    text: req.body.musicShout,
    user: user._id,
    username: user.username 
  });

  newMusic.save(function(err) {
      if (err) return res.status(400).send(err);
      // io.emit('newMusic');
      return res.send();
    });
  // if (req.body.musicShout.length < 1) {
  //   return res.status(400).send('Shouts cannot be blank');
  // }
  // newMusic.save(function(err) {
  //   return res.send();
  // });
});

app.put('/featuredshouts/remove', function(req, res, next){

  var token = req.headers.authorization;
  var user = jwt.decode(token, JWT_SECRET);

  var shoutId = req.body.shout._id;

  Featured.update({_id: shoutId, user: user._id}, {$set: {deactivated: true}}, function(err) {
    return res.send();
  });
  // db.collection('featureds', function(err, featuredCollection) {
  //   var shoutId = req.body.shout._id;
  //   featuredCollection.remove({_id: ObjectId(shoutId), user: user._id}, {w:1}, function(err, result) {
  //     return res.send();
  //   });
  // });
});

app.put('/sportsshouts/remove', function(req, res, next){

  var token = req.headers.authorization;
  var user = jwt.decode(token, JWT_SECRET);

  var shoutId = req.body.shout._id;

  Sports.update({_id: shoutId, user: user._id}, {$set: {deactivated: true}}, function(err) {
    return res.send();
  });
  // db.collection('sports', function(err, sportsCollection) {
  //   var shoutId = req.body.shout._id;
  //   sportsCollection.remove({_id: ObjectId(shoutId), user: user._id}, {w:1}, function(err, result) {
  //     return res.send();
  //   });
  // });
});


app.put('/musicshouts/remove', function(req, res, next){

  var token = req.headers.authorization;
  var user = jwt.decode(token, JWT_SECRET);

  var shoutId = req.body.shout._id;

  Music.update({_id: shoutId, user: user._id}, {$set: {deactivated: true}}, function(err) {
    return res.send();
  });
  // db.collection('musics', function(err, musicsCollection) {
  //   var shoutId = req.body.shout._id;
  //   musicsCollection.remove({_id: ObjectId(shoutId), user: user._id}, {w:1}, function(err, result) {
  //     return res.send();
  //   });
  // });
});

// no password encrytpion //

app.post('/users', function(req, res, next){

  var newUser = new Users({ 
    username: req.body.username,
    password: req.body.password,
    email: req.body.email 
  });

  newUser.save(function(err) {
    if (err) return res.status(400).send(err);
    return res.send();
  });

  // db.collection('users', function(err, usersCollection) {
  //   var newUser = {
  //     username: req.body.username,
  //     password: req.body.password
  //   };
  //   usersCollection.insert(newUser, {w:1}, function(err) {
  //     return res.send();
  //   });
  // });
});

app.put('/users/login', function(req, res, next) {

  console.log(req.body);

  // db.collection('users', function(err, usersCollection) {
  //   usersCollection.findOne({username: req.body.username, password: req.body.password}, function(err, user) {
    
    Users.findOne({username: req.body.username, password: req.body.password}, function(err, user) {

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
// });


app.put('/users/resetPassword', function(req, res, next){
  console.log(req.body);

  Users.findOne({email: req.body.email}, function(err, user) {

    if (user) {
      var newPassword = Math.random().toString(36).substr(2, 5);
      console.log('New Password: ' + newPassword);

      Users.update({email: req.body.email}, {$set: {password: newPassword}}, function(){

        // put code here for sending email containing new password

        return res.send();
      });
    } 
    if(!user){
      return res.status(400).send();
    }
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

app.get('*', function(req, res, next){
  return res.redirect('/#' + req.originalUrl);
});

var port = process.env.PORT || 1337;

app.listen(port);
