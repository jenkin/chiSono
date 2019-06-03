var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
//var path = require('path');

/*app.get('/', function (req, res) {
    console.log(path.join(__dirname,'/index.html'));
    res.sendFile(path.join(__dirname,'/index.html'));
});*/

let vip = [
    {
        name: "Floyd Mayweather",
        photo: "https://specials-images.forbesimg.com/imageserve/5b149bb84bbe6f74868b761f/416x416.jpg?background=000000&cropX1=268&cropX2=2355&cropY1=234&cropY2=2323"
    },
    {
        name: "George Clooney",
        photo: "https://specials-images.forbesimg.com/imageserve/5b43ae4b31358e2c990e9203/416x416.jpg?background=000000&cropX1=403&cropX2=2584&cropY1=60&cropY2=2242"
    },
    {
        name: "Kylie Jenner",
        photo: "https://specials-images.forbesimg.com/imageserve/5b3bc12d4bbe6f604389def2/416x416.jpg?background=000000&cropX1=71&cropX2=3541&cropY1=1071&cropY2=4540"
    },
    {
        name: "Chiara Ferragni",
        photo: "https://www.caffeinamagazine.it/wp-content/uploads/2019/01/chiara-ferragni-.jpg"
    },
    {
        name: "Lewis Hamilton",
        photo: "https://cdn-5.motorsport.com/images/mgl/63kygeJ6/s8/f1-mercedes-amg-f1-w09-launch-2018-lewis-hamilton-mercedes-amg-f1.jpg"
    },
    {
        name: "Brad Pitt",
        photo: "https://images.vanityfair.it/wp-content/uploads/2018/12/05175836/Brad_Pitt_P.jpg"
    },
    {
        name: "Manuel Mazzatelli",
        photo: "https://scontent-sea1-1.cdninstagram.com/vp/1ea3698dcb3042ba10bac8eea671b6d7/5D787330/t51.2885-19/s150x150/28429174_161935441193641_2857634040599543808_n.jpg?_nc_ht=scontent-sea1-1.cdninstagram.com"
    }
]

let numUsers = 0, //num user connected
    players = {};

io.on('connection', function (socket) {

    let player = {
        id: "",
        nickName: "",
        character: { name: "", photo: "" },
    }

    socket.emit('connection', Object.values(players).filter(function (data) { return data.nickName != player.nickName })) //emit only for me players object to show players connected

    console.log('an user connected'); // user connected

    socket.on('disconnect', function () { // user disconnected 
        if (numUsers > 0) { numUsers-- } // user cannot go under 0
        console.log('user disconnected numUser: ' + numUsers);
        players = Object.values(players).filter(function (data) { return data.nickName != player.nickName }) // remove player on disconnect
        io.emit('disconnect', players)
    });

    socket.on('login', function (input) { // on login
        player.nickName = input.nickName;
        players[player.nickName] = player;
        players[player.nickName].character = vip[Math.floor(Math.random() * (+vip.length - +0)) + +0]
        let vipFiltered
        for (let i = 0; i < Object.values(players).length; i++) { // each user is assigned a different character
            console.log(Object.values(players)[i].character.name)
            vipFiltered = vip.filter((vip) => vip.name != Object.values(players)[i].character.name)
        }
        players[player.nickName].character = vipFiltered[Math.floor(Math.random() * (+vipFiltered.length - +0)) + +0]
        player.id = socket.id;
        socket.broadcast.emit('login', player) //emit to everyone except me
        socket.emit('login', { id: player.id, nickName: player.nickName }) //emit only for me
    });

    socket.on('ready', function (state) {
        if (state.readyState && numUsers >= 0) {
            numUsers++;
        } else if (!state.readyState && numUsers > 0) {
            numUsers--;
        }
        console.log('user connected numUser: ' + numUsers);
        if (numUsers == 4) {
            io.emit('ready', "start")
        }
    })

    socket.on('chat message', function (msg) { // on message

        let myNickName = player.nickName;

        let isASuggestion = 0

        isASuggestion = Object
            .values(players)
            .filter((player) => player.nickName.toUpperCase() !== myNickName.toUpperCase())
            .filter((player) => player.character.name.toUpperCase() === msg.message.toUpperCase())
            .length;

        console.log(isASuggestion)

        let isWinner = player.character.name === msg.message;

        if (isASuggestion) {
            socket.emit('chat message', { nickName: player.nickName, message: "warning", character: players[player.nickName].character })
        }

        if (!isASuggestion && isWinner) {
            io.emit('chat message', { nickName: player.nickName, message: "ha vinto", character: players[player.nickName].character })
        }

        if (!isASuggestion && !isWinner) {
            socket.broadcast.emit('chat message', { nickName: player.nickName, message: msg.message, character: players[player.nickName].character })
            socket.emit('chat message', { nickName: player.nickName, message: msg.message })
        }
    });
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});