let UserRoutes=require('./UserRoutes');
let AgentRoutes=require('./AgentRoutes');
module.exports=function(express,Application){

    UserRoutes(express, Application);
    AgentRoutes(express, Application);

};