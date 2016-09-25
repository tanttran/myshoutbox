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
app.use(bodyParser.json());

app.use(morgan(':method :url :response-time'));
// app.use(morgan('combined'));


var JWT_SECRET = 'shoutBox';



var db = null;
MongoClient.connect(process.env.MONGODB_URI || "mongodb://heroku_w14jv4tx:ru9k9bcfssn3ub3g28jr8lp27n@ds041526.mlab.com:41526/heroku_w14jv4tx", function(err, dbconn) {
  if(!err) {
    console.log("MONGODB connected");
    db = dbconn;
  }
});

mongoose.connect(process.env.MONGODB_URI || "mongodb://heroku_w14jv4tx:ru9k9bcfssn3ub3g28jr8lp27n@ds041526.mlab.com:41526/heroku_w14jv4tx");

var Featured = mongoose.model('featured', { 
  text: String,
  user: String,
  username: String
});

var Sports = mongoose.model('sport', { 
  text: String,
  user: String,
  username: String
});

var Music = mongoose.model('music', { 
  text: String,
  user: String,
  username: String
});

app.use(express.static(__dirname + '/public'));


app.get('/featuredshouts', function(req, res, next) {
  db.collection('featureds', function(err, featuredsCollection) {
    featuredsCollection.find().toArray(function(err, featured) {
      console.log(featured);
      return res.json(featured);
    });
  });
});


app.get('/sportsshouts', function(req, res, next) {
  db.collection('sports', function(err, sportsCollection) {
    sportsCollection.find().toArray(function(err, sports) {
      console.log(sports);
      return res.json(sports);
    });
  });
});

app.get('/musicshouts', function(req, res, next) {
  db.collection('musics', function(err, musicsCollection) {
    musicsCollection.find().toArray(function(err, music) {
      console.log(music);
      return res.json(music);
    });
  });
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

    if (req.body.newShout.length < 1) {
      return res.status(400).send('Shouts cannot be blank');
    }

    newFeatured.save(function(err) {
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


    if (req.body.sportsShout.length < 1) {
      return res.status(400).send('Shouts cannot be blank');
    }

    newSport.save(function(err) {
      return res.send();
    });

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


    if (req.body.musicShout.length < 1) {
      return res.status(400).send('Shouts cannot be blank');
    }

    newMusic.save(function(err) {
      return res.send();
    });

});

app.put('/featuredshouts/remove', function(req, res, next){

  var token = req.headers.authorization;
  var user = jwt.decode(token, JWT_SECRET);

  db.collection('featureds', function(err, featuredCollection) {
    var shoutId = req.body.shout._id;

    featuredCollection.remove({_id: ObjectId(shoutId), user: user._id}, {w:1}, function(err, result) {

      return res.send();
    });
  });
});

app.put('/sportsshouts/remove', function(req, res, next){

  var token = req.headers.authorization;
  var user = jwt.decode(token, JWT_SECRET);

  db.collection('sports', function(err, sportsCollection) {
    var shoutId = req.body.shout._id;

    sportsCollection.remove({_id: ObjectId(shoutId), user: user._id}, {w:1}, function(err, result) {

      return res.send();
    });
  });
});


app.put('/musicshouts/remove', function(req, res, next){

  var token = req.headers.authorization;
  var user = jwt.decode(token, JWT_SECRET);

  db.collection('musics', function(err, musicsCollection) {
    var shoutId = req.body.shout._id;

    musicsCollection.remove({_id: ObjectId(shoutId), user: user._id}, {w:1}, function(err, result) {

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

var port = process.env.PORT || 1337;

app.listen(port);
