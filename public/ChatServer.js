let mongo = require('./MongoDB');

let Application;

module.exports = function (app) {

    Application=app;

    // Optional. You will see this name in eg. 'ps' or 'top' command
    process.title = 'node-chat';
    // Port where we'll run the websocket server
    var webSocketsServerPort = 1337;
    // websocket and http servers
    var webSocketServer = require('websocket').server;
    var http = require('http');
    var express=require('express');
        var cookieParser=require('cookie-parser');
    /**
     * Global variables
     */
    // latest 100 messages
    var history = [];
    // list of currently connected clients (users)
    var clients = [];
    var A = [];
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

            //console.log(request.cookies);

        // accept connection - you should check 'request.origin' to
        // make sure that client is connecting from your website
        // (http://en.wikipedia.org/wiki/Same_origin_policy)
        var connection = request.accept(null, request.origin);
        //var connection=null;
        // we need to know client index to remove them on 'close' event
        //console.log(connection.cookie);
        var userName = false;
        var ToReceiver = false;
        var userColor = false;

        
        //console.log(request.cookies);
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

                    //Application.userMap[userName]={status:'waiting'};  //TODO: push whole user object

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
                    //Application.agentMap[ToReceiver]={status:"waiting"};
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
                        let o = {};
                        o['from'] = userName;
                        o['to'] = ToReceiver;
                        o['message'] = message.utf8Data;
                        o['datetime'] = new Date();

                        mongo.MongoDBOperation((database) => {
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

};