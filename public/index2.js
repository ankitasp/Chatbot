"use strict";
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var user = [];
var Agent = [];
//var Userlogin = [];
//var Agentlogin = [];
var count = 0;
var countA = 0;
var userObjVar;
var Client_ID = 0;
var Id = 0;
var message = "";
var database;




var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/mydb';

// Use connect method to connect to the server

function MongoDBOperation(f) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
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

app.listen(8888, function () {
    console.log("Server Started and Running ...");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('.'));


app.get('/homeclient', homePageFunc);
app.get('/homeAgent', homePageAgentFunc);
app.get('/register', addUserFormFnc);
app.get('/registeragent', addAgentFormFnc);
app.get('/loginclient', addUserLogin);
app.get('/loginagent', addAgentLogin);
app.post('/addUserFormSubmit', addUserSubmitFnc);

app.post('/addAgentFormSubmit', addAgentSubmitFnc);
app.post('/addUserLoginSubmit', addUserLoginSubmit);
//app.post('/addUserLoginSubmit', getUserDetails);
app.post('/addAgentLoginSubmit', addAgentLoginSubmit);
function homePageFunc(req, res) {
    res.sendFile('homeclient.html', { root: __dirname });
}
function homePageAgentFunc(req, res) {
    res.sendFile('homeAgent.html', { root: __dirname });
}

function addUserFormFnc(req, res) {
    res.sendFile('index.html', { root: __dirname });
}
function addAgentFormFnc(req, res) {
    res.sendFile('RegisterAgent/index.html', { root: __dirname });
}
function addUserLogin(req, res) {
    res.sendFile('login.html', { root: __dirname });
}
function addAgentLogin(req, res) {
    res.sendFile('ALogin/index.html', { root: __dirname });
    console.log({ root: __dirname });
}

function addUserSubmitFnc(req, res) {
    console.log("Data Received : ");
    count++;
    var userObjVar =
    {
        firstname: req.body.first_name,
        lastname: req.body.last_name,
        email: req.body.email,
        phone: req.body.phone,
        city: req.body.city,
        country: req.body.country,
        subject: req.body.subject,
        password: req.body.password,
        confirm_password: req.body.confirm_password,
        Client_ID: count
    };

    user.push(userObjVar);

    MongoDBOperation(function (database) {
        database.collection('users').insertOne(userObjVar);

    });

    for (i = 0; i < user.length; i++) {
        console.log("User:" + i);
        console.log(user[i]);
    }


}
function addAgentSubmitFnc(req, res) {
    console.log('Agent');
    console.log("Data Received : ");
    countA++;
    var agentObjVar =
    {
        Name: req.body.Name,
        Id: req.body.Id,
        Mobile_No: req.body.Mobile_No,
        Email: req.body.Email,
        pass: req.body.pass,
        Cpass: req.body.Cpass
      


    };


    Agent.push({
        Name: req.body.Name,
        Id: req.body.Id,
        Mobile_No: req.body.Mobile_No,
        Email: req.body.Email,
        pass: req.body.pass,
        Cpass: req.body.Cpass
        
    });

    console.log(agentObjVar);
    MongoDBOperation(function (database) {
        database.collection('agent').insertOne(agentObjVar);

    });
    //for (i = 0; i < Agent.length; i++) {
    //  console.log("Agent:" + i);
    //console.log(Agent[i]);
    //}

}
function addUserLoginSubmit(req, res) {
    console.log("Data Received : ");
    // count++;
    // var userLoginObjVar =
    // {

    //     Client_ID: req.body.Client_ID,
    //     password: req.body.password,



    // };
    var Client_ID = parseInt(req.body.Client_ID);
    var password = req.body.password;

    console.log(Client_ID);
    console.log(password);
    //res.render(__dirname + "chat.html", {Client_ID:Client_ID});
    //console.log(userLoginObjVar);
    // Userlogin.push({Client_ID:req.body. Client_ID,
    //     password: req.body.password,
    //     });

    var result = false;
    // var matcheduser;
    // for (i = 0; i < user.length; i++) {
    //     if (user[i].password === password && user[i].Client_ID === Client_ID) {
    //         result = true;
    //         matcheduser = user[i];
    //         break;
    //     }
    // }

    // MongoDBOperation(function (database) {

    //     console.log("querying database");
    //     database.collection('users').find({ Client_ID: Client_ID, password: password }).toArray()
    //         .then(



    MongoDBQuery('users', { Client_ID: Client_ID, password: password }, (docs) => {
        console.log('docs', docs);
        console.log("docs lenth" + docs.length);
        if (docs.length > 0) {
            console.log("Login Successful");
            result = {};
            result['result'] = 'success';
            result['user'] = docs[0];

            res.send(JSON.stringify(result));
        }
        else {
            result = {};
            result['result'] = 'failed';
            console.log("Login failed");
            res.send(JSON.stringify(result));
        }
    });
}

function addAgentLoginSubmit(req, res) {
    console.log("Data Received : ");
    count++;
    var Id = (req.body.Id);


    var pass = req.body.pass;

    console.log(Id);
    console.log(pass);

    var result = false;
    // var userLoginObjVar =
    //{

    //  Id: req.body.Id,
    // pass: req.body.pass,
    //remember_me: req.body.remember_me


    //};
    //console.log(userLoginObjVar);

    // j = 0;
    //for (i = 0; i < Agent.length; i++) {

    //    if (Agent[i].pass === Agentlogin[i].pass) {
    //        console.log("Login Successful");
    //    }
    //    else {
    //        console.log("Login unsuccessful");
    //    }
    //}




    MongoDBQuery('agent', { Id: Id, pass: pass }, (docs) => {
        console.log('docs', docs);
        console.log("docs lenth" + docs.length);
        if (docs.length > 0) {
            console.log("Login Successful");
            result = {};
            result['result'] = 'success';
            //result['user'] = docs[0];

            res.send(JSON.stringify(result));
        }
        else {
            result = {};
            result['result'] = 'failed';
            console.log("Login failed");
            res.send(JSON.stringify(result));
        }
    });
}

function getAgentDetails(req, res) {

    var ID = (req.body.ID);
    return ID;
}


// Optional. You will see this name in eg. 'ps' or 'top' command
process.title = 'node-chat';
// Port where we'll run the websocket server
var webSocketsServerPort = 1337;
// websocket and http servers
var webSocketServer = require('websocket').server;
var http = require('http');
/**
 * Global variables
 */
// latest 100 messages
var history = [];
// list of currently connected clients (users)
var clients = [];
/**
 * Helper function for escaping input strings
 */
function htmlEntities(str) {
    return String(str)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
// Array with some colors
var colors = ['red', 'green', 'blue', 'magenta', 'purple', 'plum', 'orange'];
// ... in random order
colors.sort(function (a, b) { return Math.random() > 0.5; });
/**
 * HTTP server
 */
var server = http.createServer(function (request, response) {
    // Not important for us. We're writing WebSocket server,
    // not HTTP server
});
server.listen(webSocketsServerPort, function () {
    console.log((new Date()) + " Server is listening on port "
        + webSocketsServerPort);
});
/**
 * WebSocket server
 */
var wsServer = new webSocketServer({
    // WebSocket server is tied to a HTTP server. WebSocket
    // request is just an enhanced HTTP request. For more info 
    // http://tools.ietf.org/html/rfc6455#page-6
    httpServer: server
});
// This callback function is called every time someone
// tries to connect to the WebSocket server
wsServer.on('request', function (request) {
    console.log((new Date()) + ' Connection from origin '
        + request.origin + '.');
    // accept connection - you should check 'request.origin' to
    // make sure that client is connecting from your website
    // (http://en.wikipedia.org/wiki/Same_origin_policy)
    var connection = request.accept(null, request.origin);
    //var connection=null;
    // we need to know client index to remove them on 'close' event

    var userName = false;
    var ToReceiver = false;
    var userColor = false;

    console.log((new Date()) + ' Connection accepted.');
    // send back chat history
    if (history.length > 0) {
        connection.sendUTF(
            JSON.stringify({ type: 'history', data: history }));
    }
    // user sent some message
    connection.on('message', function (message) {
        if (message.type === 'utf8') { // accept only text
            // first message sent by user is their name
            if (userName === false) {
                // remember user name
                userName = htmlEntities(message.utf8Data);
                var userobj = {
                    name: userName,
                    con: connection
                };

                var index = clients.push(userobj) - 1;
                // get random color and send it back to the user
                userColor = colors.shift();
                connection.sendUTF(
                    JSON.stringify({ type: 'color', data: userColor }));
                console.log((new Date()) + ' User is known as: ' + userName
                    + ' with ' + userColor + ' color.');
            } else if (userName !== true && ToReceiver === false) {
                ToReceiver = htmlEntities(message.utf8Data);
                console.log('ToReceiver: ' + ToReceiver)
            }
            else { // log and broadcast the message
                console.log((new Date()) + ' Received Message from '
                    + userName + ': ' + message.utf8Data);


                // we want to keep history of all sent messages
                var obj = {
                    time: (new Date()).getTime(),
                    text: htmlEntities(message.utf8Data),
                    author: userName,
                    color: userColor
                };
                history.push(obj);
                history = history.slice(-100);
                // broadcast message to all connected clients
                var json = JSON.stringify({ type: 'message', data: obj });
                //change this function for one to one
                var flag = 0;
                for (var i = 0; i < clients.length; i++) {
                    if (clients[i].name === ToReceiver) {
                        clients[i].con.sendUTF(json); flag = 1;
                        break;
                    }

                }
                if (flag === 0) {
                    console.log('No such user found:  ' + ToReceiver);
                } else {
                    //add entry to db
                    let o={};
                    o['from']=userName;
                    o['to']=ToReceiver;
                    o['message']=message.utf8Data;
                    o['datetime']=new Date();
                    
                    MongoDBOperation((database)=>{
                        database.collection('messages').insertOne(o);
                    });
                }

            }
        }
    });


    // user disconnected
    connection.on('close', function (connection) {
        if (userName !== false && userColor !== false) {
            console.log((new Date()) + " Peer "
                + connection.remoteAddress + " disconnected.");
            // remove user from the list of connected clients
            //----------------------do this clients.splice(index, 1);
            // push back user's color to be reused by another user
            colors.push(userColor);
        }
    });
});
