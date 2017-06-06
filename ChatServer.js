/*var url=require('url');
var request = require('request');
var express = require('express');
var options = {protocol:"http:",host:"search.twitter.com",pathname:"/search.json",query:{q:"codeschool"}};
var searchURL = url.format(options);
console.log(searchURL);
var app = express();
app.get('/',function(req,res){
     request(searchURL,function(err,res,body){      
        console.log(err);
        req.pipe(body);

    });
});
app.listen(1000);*/
var express = require('express');
var app=express();
var server =require('http').createServer(app);
var io = require('socket.io')(server);

io.on('connection',function(client){
    client.on('join',function(name){
        client.name = name;
        var rgb = [];

        for(var i = 0; i < 3; i++)
            rgb.push(Math.floor(Math.random() * 255));
        client.color = rgb.join(',');
        console.log( client.name + ' Connected');
        var message ={name:name,color:client.color,msg:"Just Joined the chat"};
        client.broadcast.emit('messages',message);
    });

    client.on('messages',function(data){
        var name = client.name ;
        var message ={name:name,color:client.color,msg:data};
        client.broadcast.emit('messages',message);
        client.emit('messages',message);
    });

    client.on('typing',function(){
        var name = client.name;
        client.broadcast.emit("typingUser",name+" Typing...")
        client.emit("typingUser",name+" Typing...")
    });

});

app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
});

app.use('/img', express.static(__dirname + "/public/img"));
app.use('/js', express.static(__dirname + "/public/js"));
app.use('/css', express.static(__dirname + "/public/css"));
console.log('Server Listening on port 1000');
server.listen(1000);