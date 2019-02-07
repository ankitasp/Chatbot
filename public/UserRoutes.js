let mongo=require('./MongoDB');
var user=[];
let Application;

module.exports=function(express, app){

    Application=app;

    express.get('/NewSiteClient', NewSiteClient);

    express.get('/loginclient', loginclient);
    express.post('/addUserLoginSubmit', loginclientpost);

    express.get('/register', register);
    express.post('/addUserFormSubmit', registerclientpost);

    express.get('/getusers',getusers);

    express.get('/adduserstatus',adduserstatus);

    express.get('/adduserstatusclose',adduserstatusclose);
  
    express.post('/setuserstatus', setuserstatus);
  
    express.post('/setuserstatusclose', setuserstatusclose);

    express.get('/ClientList', ClientList);

    express.get('/Client', Clients);

};
function adduserstatus(req, res) {
    res.sendFile('dataonline.html', { root: __dirname });
}

function adduserstatusclose(req, res) {
    res.sendFile('dataoffline.html', { root: __dirname });
}
function Clients(req, res) {
    res.sendFile('Client.html', { root: __dirname });
}

function ClientList(req, res) {
    res.sendFile('ClientList.html', { root: __dirname });
}
function setuserstatus(req, res) {
    let userid = req.body.userid;
    let status = 'online';
  


    if (!Application.userMap[userid]) {
        Application.userMap[userid] = {};
    }

    Application.userMap[userid]['status'] = status;
}

function setuserstatusclose(req, res) {
    let userid = req.body.userid;
    let status = 'offline';
    



    if (!Application.userMap[userid]) {
        Application.userMap[userid] = {};
    }

    Application.userMap[userid]['status'] = status;
}

function getusers(req,res)
{
    res.send(Application.userMap);
}

function NewSiteClient(req, res) {
    res.sendFile('NewSiteClient.html', { root: __dirname });
}

function register(req, res) {
    res.sendFile('index.html', { root: __dirname });
}

function loginclient(req, res) {
    res.sendFile('login.html', { root: __dirname });
}

async function registerclientpost(req, res) {

    let count = 0;
    var email=req.body.email;
    mongo.MongoDBOperation(function (database) {

        database.collection('usercurrent').countDocuments().then(function (counter) {
            console.log('got count ', counter);
            //you will get the count of number of documents in mongodb collection in the variable 
            count = counter;

            console.log("Database Count" + count);
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
                Client_ID: count + 1
            };

            user.push(userObjVar);

            
               
            
    
        mongo.MongoDBQuery('usercurrent', { email:email}, (docs) => {
            //console.log('docs', docs);
            //console.log("docs lenth" + docs.length);
            if (docs.length > 0) {
                console.log("Email Id is already exist");
                result = {};
                result['result'] = 'Email Id is already exist';
                //result['user'] = docs[0];
    
                res.send(JSON.stringify(result));
            }
       else
           {
               console.log(userObjVar);
               mongo.MongoDBOperation(function (database) {
               database.collection('usercurrent').insertOne(userObjVar);
               for (i = 0; i < user.length; i++) {
                console.log("User:" + i);
                console.log(user[i]);
            }

                });
           }           
       });
    });
});

    }
   
       function loginclientpost(req, res) {
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



    mongo.MongoDBQuery('usercurrent', { Client_ID: Client_ID, password: password }, (docs) => {
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
