$(function() {
    if (window.Notification) {
        return Notification.requestPermission();
    }
});

var socket = io.connect("http://173.229.213.119:1000");
socket.on('connect',UserName);
function UserName(data){
    var name = prompt("Whats ur Name");
    if(name){
        socket.emit('join',name);
        $("#name").text("");
        $("#welcome").show();
        $("#name").append(name);
    }
    else{
        UserName();
    }
}
socket.on("messages",function(data){
    $("#message").append("<b style='color:rgb("+ data.color + ")'>"+data.name+"</b>  :"+data.msg+"</br>").scrollTop($("#message")[0].scrollHeight);
    $("#typingUser").empty();
    if($("#name").text()!==data.name){
        ShowNotificationMsg(data.name,data.msg)
    }
});
socket.on("typingUser",function(data){
    $("#typingUser").empty().append(data);
    setTimeout(function(){
        $("#typingUser").empty();
    },4000);
});

$('#chat-msg').on('keydown',function(e) {
    socket.emit("typing");
    if (e.keyCode == 13) {
        sendMessage();
    }
});
function sendMessage(){
    var message = $('#chat-msg').val();
    socket.emit("messages",message);
    $('#chat-msg').val("");
    $("#typingUser").empty();
}


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
