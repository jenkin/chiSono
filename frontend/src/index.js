import _ from 'lodash';
import io from 'socket.io-client';

$(function () {

    const socket = io('http://localhost:3000/');
    var nickName = "",
        id = "",
        btnState = false

    $('#nicknameButton').click(function (e) {
        console.log("submit", $('#nicknameInput').val())
        e.preventDefault(); // prevents page reloading
        nickName = $('#nicknameInput').val()
        socket.emit('login', { nickName: nickName });
        $('#nicknameInput').val('');
        $("#userLogin").hide();
    
       
        return false;
       
        
    });

    $('#buttonerators').click(function (e) {
        if (!btnState) { // if btnState is false
            btnState = true
        } else {
            btnState = false
        }
        e.preventDefault(); // prevents page reloading
        socket.emit('ready', { readyState: btnState });
        return false;
    });

    $('.btnMessage').click(function (e) {
        e.preventDefault(); // prevents page reloading
        socket.emit('chat message', { nickName: nickName, message: $('#messageInput').val() });
        $('#messageInput').val('');
        return false;
    });
<<<<<<< HEAD
    
=======

    socket.on('connection', function (data) {
        console.log(data)
    });

>>>>>>> 5e92b795fad535b18c6567561564f0d0e77cb6e4
    socket.on('login', function (data) {
        console.log(data)
        id = data.id
        mioID = data.id
        let source = document.getElementById("cardPlayer").innerHTML;
        let template = Handlebars.compile(source)
        $('.messages').append($(template(data)));
        
    });
    
   
    $("#readyBtn").hide();
    $("#messageForm").hide();

    $('#readyBtn').click(function (e) {
        if(!btnState){ // if btnState is false
            btnState = true
        } else {
            btnState = false
        }
        e.preventDefault(); // prevents page reloading
        socket.emit('ready', {readyState: btnState});
        $('#messages').append($('<li>').text( "Waiting for other players ..." ));
        $("#readyBtn").hide();
        return false;
    });

    socket.on('ready', function (data) {
        console.log(data)
        $("#messageForm").show();
    });

    socket.on('chat message', function (msg) {
        console.log(msg.nickName)
        if (msg.character) {
            $('#messages').append($('<li>').text( " (" + msg.nickName + " as " + msg.character.name + ")" + msg.message));
        } else {
            $('#messages').append($('<li>').text( " (" + msg.nickName + ")" + msg.message ));
        }
    });
    socket.on('connection', function (data) {
        console.log(data)
        id = data.id
        let source = document.getElementById("cardPlayer").innerHTML;
        let template = Handlebars.compile(source)
        $('.messages').append($(template(data)));
    });
});

/*$(document).ready( function init()
{
    // existing data is always null. 
    var existingData = localStorage.getItem("existingData");
    if( existingData !== null )
    {
        var existingDataListHtml = existingData.split(",");
        existingDataListHtml = $.each(existingData, function(data) {
                return "<li>" + data + "<\/li>";
            });

        $("#existingData").html("<ul>" + existingDataListHtml + "<\/ul>");
    }
} );

*/




/*socket.on('login', function(msg){
    // un utente si è connesso
 let nome_utente = msg.nickName
 let nome_personaggio= msg.character.name
});
$( "#buttonerators" ).click(function() {
    let nickName =$( "#single" ).val();
  });
/*
on form submit function() {
    socket.emit('login', { nickName: valore dell'input })
}
*/