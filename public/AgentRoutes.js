let mongo=require('./MongoDB');
var Agent=[];
let Application;
let cookieParser=require('cookie-parser');
let token;


module.exports=function(express, app){

    Application=app;
    
    

  express.get('/NewSiteAgent', NewSiteAgent);

  express.get('/registeragent', AgentRegister);


  express.get('/loginagent', AgentLogin);

  express.post('/addAgentFormSubmit', AgentRegSubmit);


  express.post('/addAgentLoginSubmit', AgentLoginSubmit);

  express.get('/Agent', Agents);

  express.get('/getagents', getagents);

  express.get('/addagentstatus',addagentstatus);

  express.get('/addagentstatusclose',addagentstatusclose);

  express.get('/AgentList', AgentList);

  express.post('/setagentstatus', setagentstatus);

  express.post('/setagentstatusclose', setagentstatusclose);

  express.use(cookieParser());
 
      
    //Iterate users data from cookie 
    express.get('/getagent', (req, res)=>{ 
    //shows all the cookies 
    res.send(document.cookie);
 


    }); 

function addagentstatus(req, res) {
    res.sendFile('data.html', { root: __dirname });
}

function addagentstatusclose(req, res) {
    res.sendFile('dataclose.html', { root: __dirname });
}

function setagentstatus(req, res) {
    let agentid = req.body.agentid;
    let status = 'online';
  


    if (!Application.agentMap[agentid]) {
        Application.agentMap[agentid] = {};
    }

    Application.agentMap[agentid]['status'] = status;
}

function setagentstatusclose(req, res) {
    let agentid = req.body.agentid;
    let status = 'offline';
    



    if (!Application.agentMap[agentid]) {
        Application.agentMap[agentid] = {};
    }

    Application.agentMap[agentid]['status'] = status;
}


function AgentList(req, res) {
    res.sendFile('AgentList.html', { root: __dirname });
}
function getagents(req, res) {
    res.send(Application.agentMap);
}


  function NewSiteAgent(req, res) {
    res.sendFile('NewSiteAgent.html', { root: __dirname });
}  



function AgentRegister(req, res) {
    res.sendFile('RegisterAgent/index.html', { root: __dirname });
}



function AgentLogin(req, res) {
    res.sendFile('ALogin/index.html', { root: __dirname });
    console.log({ root: __dirname });
}



function AgentRegSubmit(req, res) {
    var Id = (req.body.Id);
    var Email = (req.body.Email);
 
    console.log('Agent');
    console.log("Data Received : ");
    //countA++;
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
    mongo.MongoDBQuery('agentcurrent', { Id: Id}, (docs) => {
        //console.log('docs', docs);
        //console.log("docs lenth" + docs.length);
        if (docs.length > 0) {
            console.log("Emp Id is already exist");
            result = {};
            result['result'] = 'Emp Id is already exist';
            //result['user'] = docs[0];

            res.send(JSON.stringify(result));
        }
        else
        {
            mongo.MongoDBQuery('agentcurrent', { Email: Email}, (docs) => {
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
    console.log(agentObjVar);
    mongo.MongoDBOperation(function (database) {
        database.collection('agentcurrent').insertOne(agentObjVar);
    
    });
    }
});
        }
        /*else if(mongo.MongoDBQuery('agent', { Email: Email }, (docs) => {
            //console.log('docs', docs);
            //console.log("docs lenth" + docs.length);
            if (docs.length > 0) {
                console.log("Email Id is already exist");
                result = {};
                result['result'] = 'Email Id is already exist';
                //result['user'] = docs[0];
    
                res.send(JSON.stringify(result));
            }
        }))*/
    
    
       }   );
    //for (i = 0; i < Agent.length; i++) {
    //  console.log("Agent:" + i);
    //console.log(Agent[i]);
    //}

    }
function AgentLoginSubmit(req, res) {
    console.log("Data Received : ");
    //count++;
    var Id = (req.body.Id);


    var pass = req.body.pass;

    console.log(Id);
    console.log(pass);

    var result = false;

   // var  Email = req.body.Email;


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




    mongo.MongoDBQuery('agentcurrent', { Id: Id, pass: pass }, (docs) => {
        console.log('docs', docs);
        console.log("docs lenth" + docs.length);
        if (docs.length > 0) {
            document.cookie="token=abcd;expires=Thu,21 Aug 2020 20:00:00"
            
            console.log("Login Successful");
            result = {};
            result['result'] = 'success';
            //result['token']='abcd';
           
           
           
                
                // var Cookies = require('js.cookie');
                // Cookies.set('token=abcd',{ path: 'http://localhost:8888/Agent' });
                
                 
                
            //document.cookie = "token=abcd;  path=http://localhost:8888/Agent;";
            //result['user'] = docs[0];
            //req.session.usertype='agent';
            //req.session.userid=Id;

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

function Agents(req, res) {
   
    //res.send(req.cookies); 
    
    res.sendFile('Agent.html', { root: __dirname });
    
    
}
};
