var express = require('express');
var app = express();
var path = require('path');

app.use(express.static(__dirname + '/public'));




app.listen(1337, function (){
  console.log('app is running on port 1337');

});