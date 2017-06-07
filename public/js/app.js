$(function() {
    if (window.Notification) {
        return Notification.requestPermission();
    }
});

var original = document.title;
var timeout;

function typingUserMessage(newMsg, howManyTimes) {
    function step() {
        document.title = (document.title == original) ? newMsg : original;

        if (--howManyTimes > 0) {
            timeout = setTimeout(step, 1000);
        };
    };

    howManyTimes = parseInt(howManyTimes);

    if (isNaN(howManyTimes)) {
        howManyTimes = 5;
    };

    canceltypingUser(timeout);
    step();
};
function canceltypingUser() {
    clearTimeout(timeout);
    document.title = original;
};

var socket = io.connect("http://173.229.213.119:1000");
socket.on('connect',UserName);
function UserName(data){
    var name = prompt("Whats ur Name");
    if(name){
        var name = name.charAt(0).toUpperCase() + name.slice(1);
        socket.emit('join', name);
        $("#name").text("");
        $("#welcome").show();
        $("#name").append(name);
    }
    else{
        UserName();
    }
}
socket.on("messages",function(data){
    document.title = original;
    if($("#name").text()!==data.name){
        ShowNotificationMsg(data.name,data.msg)
        $("#message").append("<div class='msgStyle othersMsg'><b style='color:rgb("+ data.color + ")'>"+data.name+"</b> </br>"+data.msg+"</br></div>").scrollTop($("#message")[0].scrollHeight);
    }
    else{
        $("#message").append("<div class='msgStyle'><b style='color:rgb("+ data.color + ")'>You</b>  </br>"+data.msg+"</br></div>").scrollTop($("#message")[0].scrollHeight);
    }
});
socket.on("typingUser",function(data){
    typingUserMessage(data,1)
});

function sendMessage(){
    var message = $('#chat-msg').val();
    socket.emit("messages",message);
    $('#chat-msg').val("");

}

$('#chat-msg').on('keydown',function(e) {
    socket.emit("typing");
    if (e.keyCode == 13) {
        sendMessage();
    }
});

function ShowNotificationMsg(Name,Msg) {

    var notification;
    notification = new Notification(Name, {
        body: Msg
    });
    return notification.onclick = function() {
        notification.close();
        return window.focus();
    };
}
