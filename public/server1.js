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
        Cpass: req.body.Cpass,
        remember_me: req.body.remember_me


    };

    Agent.push({
        Name: req.body.Name,
        Id: req.body.Id,
        Mobile_No: req.body.Mobile_No,
        Email: req.body.Email,
        pass: req.body.pass,
        Cpass: req.body.Cpass,
        remember_me: req.body.remember_me
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
	console.log("docs lenth"+docs.length);
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

    


   MongoDBQuery('agent', {Id:Id, pass: pass}, (docs) => {
        console.log('docs', docs);
	console.log("docs lenth"+docs.length);
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