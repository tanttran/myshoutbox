var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;

var path = require('path');
app.use(bodyParser.json());

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
  db.collection('featured', function(err, featuredCollection) {
    var newShout = {
      text: req.body.newShout
    };

    featuredCollection.insert(newShout, {w:1}, function(err) {
      return res.send();
    });
  });
});

app.put('/featuredshouts/remove', function(req, res, next){
  db.collection('featured', function(err, featuredCollection) {
    var shoutId = req.body.shout._id;

    featuredCollection.remove({_id: ObjectId(shoutId)}, {w:1}, function(err, result) {
      
      return res.send();
    });
  });
});


app.listen(1337, function (){
  console.log('app is running on port 1337');

});