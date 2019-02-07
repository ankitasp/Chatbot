var expresslib = require('express');
var bodyParser = require('body-parser');
var express = expresslib();

let Routes=require('./Routes');
let ChatServer=require('./ChatServer');
let Application=require('./Application');


express.use(bodyParser.json());
express.use(bodyParser.urlencoded({ extended: true }));
express.use(expresslib.static('.'));

Routes(express,Application);

ChatServer(Application);

express.listen(8888, function () {
    console.log("Server Started and Running ...");
});


