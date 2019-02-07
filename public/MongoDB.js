var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/mydb';

// Use connect method to connect to the server

function MongoDBOperation(f) {
    MongoClient.connect(url, { useNewUrlParser: true },  function (err, db) {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        database = db.db('mydb');

        f(database);
        db.close();
    });
}


function MongoDBQuery(collection, query, f) {
    MongoDBOperation(function (database) {
        database.collection(collection).find(query).toArray().then(f);
    });
}

module.exports={
    MongoDBOperation: MongoDBOperation,
    MongoDBQuery: MongoDBQuery
};