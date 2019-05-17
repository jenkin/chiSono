import _ from 'lodash';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');



$(function () {

    var socket = io(),
        nickName = "",
        id = "",
        btnState = false

    $('.nicknameForm').submit(function (e) {
        e.preventDefault(); // prevents page reloading
        nickName = $('#nicknameInput').val()
        socket.emit('login', { nickName: nickName });
        $('#nicknameInput').val('');
        return false;
    });

    $('#buttonerators').click(function (e) {
        if(!btnState){ // if btnState is false
            btnState = true
        } else {
            btnState = false
        }
        e.preventDefault(); // prevents page reloading
        socket.emit('ready', {readyState: btnState});
        return false;
    });

    $('.messageForm').submit(function (e) {
        e.preventDefault(); // prevents page reloading
        socket.emit('chat message', { nickName: nickName, message: $('#messageInput').val() });
        $('#messageInput').val('');
        return false;
    });

    socket.on('login', function (data) {
        console.log(data)
        id = data.id
        $('#messages').append($('<li>').text(data.nickName + " has joined!"));
        if (data.character) {
            $('#messages').append($('<li>').text(data.nickName + " is " + data.character.name));
        }
    });

    socket.on('ready', function (data) {
        console.log(data)
    });
    
    socket.on('chat message', function (msg) {
        console.log(msg.nickName)
        if (msg.character) {
            $('#messages').append($('<li>').text(msg.message + " (" + msg.nickName + " as " + msg.character.name + ")"));
        } else {
            $('#messages').append($('<li>').text(msg.message + " (" + msg.nickName + ")"));
        }
    });
});






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