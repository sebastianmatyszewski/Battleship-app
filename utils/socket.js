/* 
* @author Shashank Tiwari
* Multiplayer Tic-Tac-Toe Game using Angular, Nodejs
*/
'use strict';


class Socket{
    roomStats = []
    player1Board = null
    player2Board = null
    constructor(socket,redisDB){
        this.io = socket;
        this.redisDB = redisDB;
        redisDB.set("totalRoomCount", 1);
        redisDB.set("allRooms", JSON.stringify({
            emptyRooms: [1],
            fullRooms : []
        }));
    }
    
    socketEvents(){   
        const IO = this.io;
        const redisDB = this.redisDB;
        let allRooms = null;
        let totalRoomCount = null;
        IO.on('connection', (socket) => {
            socket.setMaxListeners(20); /* Setting Maximum listeners */
            socket.on('create-room', (data) => {
                Promise.all(['totalRoomCount','allRooms'].map(key => redisDB.getAsync(key))).then(values => {
                    const allRooms = JSON.parse(values[1]);
                    let totalRoomCount = values[0];
                    let fullRooms = allRooms['fullRooms'];
                    let emptyRooms = allRooms['emptyRooms'];
                    let isIncludes = emptyRooms.includes(totalRoomCount);
                    if(!isIncludes){
                        totalRoomCount++;
                        emptyRooms.push(totalRoomCount);
                        socket.join("room-"+totalRoomCount);
                        redisDB.set("totalRoomCount", totalRoomCount);
                        redisDB.set("allRooms", JSON.stringify({
                            emptyRooms: emptyRooms,
                            fullRooms : fullRooms
                        }));
                        this.roomStats[totalRoomCount] = {
                            'player1' : data.player1,
                            'player2' : null,
                            'player1Board': data.player1Board,
                            'player2Board': data.player2Board,
                            'shipsShotedByPlayer1' : null,
                            'shipsShotedByPlayer2' : null,
                        }
                        IO.emit('rooms-availalbe', {
                            'totalRoomCount' : totalRoomCount,
                            'fullRooms' : fullRooms,
                            'emptyRooms': emptyRooms
                        });
                        IO.sockets.in("room-"+totalRoomCount).emit('new-room', {
                            'totalRoomCount' : totalRoomCount,
                            'fullRooms' : fullRooms,
                            'emptyRooms': emptyRooms,
                            'roomNumber' : totalRoomCount
                        });
                    }
                });
            });
            socket.on('join-room', (data) => {
                const roomNumber = data.roomNumber;
                Promise.all(['totalRoomCount','allRooms'].map(key => redisDB.getAsync(key))).then(values => {
                    const allRooms = JSON.parse(values[1]);
                    let totalRoomCount = values[0];
                    let fullRooms = allRooms['fullRooms'];
                    let emptyRooms = allRooms['emptyRooms'];
                    let indexPos = emptyRooms.indexOf(roomNumber);
                    if(indexPos > -1){
                        emptyRooms.splice(indexPos,1);
                        fullRooms.push(roomNumber);
                    }
                    socket.join("room-"+roomNumber);
                    redisDB.set("allRooms", JSON.stringify({
                        emptyRooms: emptyRooms,
                        fullRooms : fullRooms
                    }));
                    const currentRoom = (Object.keys(IO.sockets.adapter.sids[socket.id]).filter(item => item!=socket.id)[0]).split('-')[1];
                    IO.emit('rooms-available', {
                        'totalRoomCount' : totalRoomCount,
                        'fullRooms' : fullRooms,
                        'emptyRooms': emptyRooms
                    });
                    this.roomStats[roomNumber].player2 = data.player2;
                    IO.sockets.in("room-"+roomNumber).emit('start-game', {
                        'player1Board': this.roomStats[roomNumber].player1Board,
                        'player2Board': this.roomStats[roomNumber].player2Board,
                        'player1' : this.roomStats[roomNumber].player1,
                        'player2' : this.roomStats[roomNumber].player2,
                        'totalRoomCount' : totalRoomCount,
                        'fullRooms' : fullRooms,
                        'emptyRooms': emptyRooms,
                        'roomNumber' : currentRoom
                    });
                });
            });
            socket.on('send-boards', (data) => {
                const roomNumber = data.roomNumber;
                socket.broadcast.to("room-"+roomNumber).emit('receive-boards', {
                    'broadcast' : 'wszystcy dołączyli do gry',
                    'player1Board' : this.roomStats[roomNumber].player1Board,
                    'player2Board' : this.roomStats[roomNumber].player2Board,
                    'player1' : this.roomStats[roomNumber].player1,
                    'player2' : this.roomStats[roomNumber].player2,
     
                });
            });
            socket.on('send-move', (data) => {
                console.log(" ")
                console.log("Nowa Runda")
                const roomNumber = data.roomNumber;
                const enemyBoard = data.enemyBoard;
                const playerShot = data.playerShot;
                console.log("roomNumber"+roomNumber)
                console.log("playerShot"+playerShot)
                const turn = data.turn;
                console.log("turn"+turn)
                let winner = null;
                if(playerShot.isShip === true){
                    enemyBoard[playerShot.index].status = 1;
                    var hitAndSink = 0;
                    for(let i = 0; i<enemyBoard[playerShot.index].positionOnBoard.length; i++){
                        hitAndSink = hitAndSink + enemyBoard[enemyBoard[playerShot.index].positionOnBoard[i]].status;
                    }
                    
                    if(hitAndSink == enemyBoard[playerShot.index].positionOnBoard.length){
                        if(this.roomStats[roomNumber].player1 == turn){
                            this.roomStats[roomNumber].shipsShotedByPlayer1 = this.roomStats[roomNumber].shipsShotedByPlayer1 + 1
                        }
                        else{
                            this.roomStats[roomNumber].shipsShotedByPlayer2 = this.roomStats[roomNumber].shipsShotedByPlayer2 + 1
                        }
                        console.log("trafien gracza 1"+this.roomStats[roomNumber].shipsShotedByPlayer1)
                        console.log("trafien gracza 2"+this.roomStats[roomNumber].shipsShotedByPlayer2)
                    }
                }else{
                    enemyBoard[playerShot.index].status = 0;               
                }
                if(this.roomStats[roomNumber].shipsShotedByPlayer1 == 8 || this.roomStats[roomNumber].shipsShotedByPlayer2 == 8){
                    winner=this.roomStats[roomNumber].turn + 'wins'
                    console.log("winner" + winner)
                }
                if(winner === null){
                    IO.sockets.in("room-"+roomNumber).emit('receive-move', {
                        'winner' : null,
                        'turn' : turn,
                        'player1' : data.player1,
                        'player2' : data.player2,
                        'roomNumber': roomNumber,
                        'myBoard': data.myBoard,
                        'enemyBoard': enemyBoard,
                    });
                }else{
                    IO.sockets.in("room-"+roomNumber).emit('receive-move', {
                        'position' : data.position,
                        'playedText' : data.playedText,
                        'winner' : data.turn + ' wygrał!',
                    });
                }
            });
            socket.on('disconnecting',()=>{
                const rooms = Object.keys(socket.rooms);
                const roomNumber = ( rooms[1] !== undefined && rooms[1] !== null) ? (rooms[1]).split('-')[1] : null;
                if(rooms !== null){
                    Promise.all(['totalRoomCount','allRooms'].map(key => redisDB.getAsync(key))).then(values => {
                        const allRooms = JSON.parse(values[1]);
                        let totalRoomCount = values[0];
                        let fullRooms = allRooms['fullRooms'];
                        let emptyRooms = allRooms['emptyRooms'];
                    
                        let fullRoomsPos = fullRooms.indexOf(parseInt(roomNumber));
                        if( fullRoomsPos > -1 ){
                            fullRooms.splice(fullRoomsPos,1);
                        }
                        if (totalRoomCount > 1) {
                            totalRoomCount--;
                        }else{
                            totalRoomCount = 1;
                        }
                        redisDB.set("totalRoomCount", totalRoomCount);
                        redisDB.set("allRooms", JSON.stringify({
                            emptyRooms: emptyRooms,
                            fullRooms : fullRooms
                        }));
                        IO.sockets.in("room-"+roomNumber).emit('room-disconnect', {id: socket.id});    
                    });
                }
            });

        });
    }
    
    socketConfig(){
        this.socketEvents();
    }
}
module.exports = Socket;