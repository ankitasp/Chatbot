var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/mydb';

// Use connect method to connect to the server
MongoClient.connect(url,{useNewUrlParser: true}, function(err, db) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

    var database=db.db('mydb');

    database.collection('agents2').insertOne(
        {
            username: 'efgh'
        });
  
  
  db.close();
});
