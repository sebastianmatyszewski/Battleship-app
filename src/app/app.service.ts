/* 
* @author Shashank Tiwari
* Multiplayer Tic-Tac-Toe Game using Angular, Nodejs
*/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

/* Importing from rxjs library starts*/
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
/* Importing from rxjs library ends*/
import { angularMath } from 'angular-ts-math';
import { shipArrayInterface, shipStatus, shipDirection} from './shipArrayInterface';

import * as io from 'socket.io-client';

@Injectable()
export class AppService {
  /* Const and variable for Tic Tac Toe Game starts. */
  public temp:boolean = true;
  public gameGrid = <Array<Object>>[[1, 2, 3], [4, 5, 6], [7, 8, 9]];
  public player1Board:  shipArrayInterface[] = null;
  public player2Board:  shipArrayInterface[] = null;

  public ships = [
    {
      id: 0,
      name: 'oneMastShip',
      mastCount: 1,
      disabled: false,
      orientation: "horizontally",
      positionOnArray: [],
    },
    {
      id: 1,
      name: 'oneMastShip',
      mastCount: 1,
      disabled: false,
      orientation: "horizontally",
      positionOnArray: []
    },
    {
      id: 2,
      name: 'twoMastShip',
      mastCount: 2,
      disabled: false,
      orientation: "horizontally",
      positionOnArray: []
    },
    {
      id: 3,
      name: 'twoMastShip',
      mastCount: 2,
      disabled: false,
      orientation: "horizontally",
      positionOnArray: []
    },
    {
      id: 4,
      name: 'threeMastShip',
      mastCount: 3,
      disabled: false,
      orientation: "horizontally",
      positionOnArray: []
    },
    {
      id: 5,
      name: 'threeMastShip',
      mastCount: 3,
      disabled: false,
      orientation: "horizontally",
      positionOnArray: []
    },
    {
      id: 6,
      name: 'fourMastShip',
      mastCount: 4,
      disabled: false,
      orientation: "horizontally",
      positionOnArray: []
    },
    {
      id: 7,
      name: 'fiveMastShip',
      mastCount: 5,
      disabled: false,
      orientation: "horizontally",
      positionOnArray: []
    },
  ]
  rightBorder = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90];
  leftBorder = [9, 19, 29, 39, 49, 59, 69, 79, 89, 99];
  downBorder = [90, 91, 92, 93, 94, 95, 96, 97, 98, 99];
  arrayBorder = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60,
    61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80,
    81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99];
  

  getRandomNumber(): number {
    return angularMath.getIntegerRandomRange(0, 99);
  }
  
  
  
  generatePlayerBoard(){
    var player:  shipArrayInterface[] = [];
    for (let i = 0; i < 100; i++) {
      var test: shipArrayInterface = {
        index: i,
        shipIndex: null,
        isShip: false,
        isBlock: false,
        status: shipStatus.NO_ACTION,
        tooltip: "",
        positionOnBoard: []
      }
      player.push(test);
    }
    this.generatePlayerShip(this.ships[0], player);
    this.generatePlayerShip(this.ships[1], player);
    this.generatePlayerShip(this.ships[2], player);
    this.generatePlayerShip(this.ships[3], player);
    this.generatePlayerShip(this.ships[4], player);
    this.generatePlayerShip(this.ships[5], player);
    this.generatePlayerShip(this.ships[6], player);
    this.generatePlayerShip(this.ships[7], player);

    for(let k = 0; k<player.length; k++){
      if(player[k].isShip == true){
        for(let i = 0; i<player.length; i++){
          if(player[k].shipIndex == player[i].shipIndex){
            player[k].positionOnBoard.push(player[i].index);

          }
        }
        
      }
      
}
    return player;
  }
  start(){
    console.log('Start')
  }
  generatePlayerShip(ship, player){
    let randomDirection = angularMath.getIntegerRandomRange(0, 1);
    let direction;
    if (randomDirection === 0) direction = 1
    if (randomDirection === 1) direction = 10
    let randomShipPosition = this.getRandomNumber();
    let fieldUsed = false;
    // console.log(this.player1Board)
    for (let i = 0; i < ship.mastCount; i++) {
      if (i > 0) {
        if (direction == 1) {
          if (this.leftBorder.includes(randomShipPosition + (i * direction) - direction) && this.rightBorder.includes(randomShipPosition + (i * direction))) {
            fieldUsed = true;
            break;
          }
        }
        if (randomShipPosition + (i * direction) - 1 == 99) {
          fieldUsed = true;
          break;
        }
        if (direction == 10) {
          if (this.downBorder.includes(randomShipPosition + (i * direction) - direction)) {
            fieldUsed = true;
            break;
          }
        }
        
        if (player[randomShipPosition + (i * direction)].isShip) {
          fieldUsed = true;
          break;
        }
        if (player[randomShipPosition + (i * direction)].isBlock) {
          fieldUsed = true;
          break;
        }
      } else {
        if (player[randomShipPosition + (i * direction)].isShip) {
          fieldUsed = true;
          break;
        }
        if (player[randomShipPosition + (i * direction)].isBlock) {
          fieldUsed = true;
          break;
        }
      }
    }
    if (!fieldUsed) {
      for (let i = 0; i < ship.mastCount; i++) {

        player[randomShipPosition + (i * direction)].isShip = true;
        player[randomShipPosition + (i * direction)].shipIndex = ship.id;
        player[randomShipPosition + (i * direction)].isBlock = true;

        if (this.arrayBorder.includes(randomShipPosition + (i * direction) - 9)) {
          player[randomShipPosition + (i * direction) - 9].isBlock = true;
        }
        if (this.arrayBorder.includes(randomShipPosition + (i * direction) - 10)) {
          player[randomShipPosition + (i * direction) - 10].isBlock = true;
        }
        if (this.arrayBorder.includes(randomShipPosition + (i * direction) - 11)) {
          player[randomShipPosition + (i * direction) - 11].isBlock = true;
        }
        if (this.arrayBorder.includes(randomShipPosition + (i * direction) - 1)) {
          player[randomShipPosition + (i * direction) - 1].isBlock = true;
        }
        if (this.arrayBorder.includes(randomShipPosition + (i * direction) + 1)) {
          player[randomShipPosition + (i * direction) + 1].isBlock = true;
        }
        if (this.arrayBorder.includes(randomShipPosition + (i * direction) + 9)) {
          player[randomShipPosition + (i * direction) + 9].isBlock = true;
        }
        if (this.arrayBorder.includes(randomShipPosition + (i * direction) + 10)) {
          player[randomShipPosition + (i * direction) + 10].isBlock = true;
        }
        if (this.arrayBorder.includes(randomShipPosition + (i * direction) + 11)) {
          player[randomShipPosition + (i * direction) + 11].isBlock = true;
        }
//fe
      }
    } else {
      // console.log("przeszło petle");
      this.generatePlayerShip(ship, player);


    }
    
    
  }
  
  /* Const and variable for Tic Tac Toe Game ends.*/
  /* Const and variable for SocketEvent and HTTP call starts. */
  private BASE_URL = 'http://localhost:4000';
  public socket;
  private headerOptions = new RequestOptions({
    headers: new Headers({ 'Content-Type': 'application/json;charset=UTF-8' })
  });
  /* Const and variable for SocketEvent and HTTP call ends. */
  constructor(private http: HttpClient) { }

  /**
   * This method will call the HTTP request to get the Total room count and Available rooms to play
   */
  public getRoomStats() {
    return new Promise(resolve => {
      this.http.get(`http://localhost:4000/getRoomStats`).subscribe(data => {
        resolve(data);
      });
    });
  }
  /*
  * Method to connect the users to socket
  */
  connectSocket() {
    this.socket = io(this.BASE_URL);
  }
  /* Method to receive rooms-available event.*/
  getRoomsAvailable(): any {
    const observable = new Observable(observer => {
      this.socket.on('rooms-available', (data) => {
        observer.next(
          data
        );
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }
  /* Method to create new room, create-room event.*/
  createNewRoom(player): any {
    console.log('nowy pokój')
    this.player1Board = this.generatePlayerBoard();
      this.player2Board = this.generatePlayerBoard();
    this.socket.emit('create-room', { 'createroom': 1, 'player1Board': this.player1Board, 'player2Board': this.player2Board, 'player1': player});
    const observable = new Observable(observer => {
      this.socket.on('new-room', (data) => {
        // this.socket.emit('send-player1', { 'roomNumber': data.roomNumber, 'player1': player});
        observer.next(
          data
        );
        
      });
      return () => {
        this.socket.disconnect();
        
      };
    });
    return observable;
  }
  /* Method to join new room, create-room event.*/
  joinNewRoom(roomNumber, player): any {
    this.socket.emit('join-room', { 'roomNumber': roomNumber, 'player2': player });
  }
  /* Method to receive start-game event.*/

  startGame(): any {
    // if(this.temp){
    //   this.player1Board = this.generatePlayerBoard();
    //   this.player2Board = this.generatePlayerBoard();
    //   this.temp = false
    // }
    
    console.log("Appservice działa");
    // this.socket.emit('send-broadcast');
    const observable = new Observable(observer => {
      this.socket.on('start-game', (data) => {
        
        this.socket.emit('send-boards', { 'roomNumber': data.roomNumber, 'player1Board': data.player1Board, 'player2Board': data.player2Board, 'player1': data.player1, 'player2' : data.player2});
        
        observer.next(
          data
        );
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }

  receiveBoards(): any {
    console.log('receive boards')
    const observable = new Observable(observer => {
      this.socket.on('receive-boards', (data) => {
        observer.next(
          data
        );
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }
  /* Method to join new room, create-room event.*/
  sendPlayerMove(params): any {
    this.socket.emit('send-move', params);
  }
  /* Method to receive start-game event.*/
  receivePlayerMove(): any {
    const observable = new Observable(observer => {
      this.socket.on('receive-move', (data) => {
        // console.log(data)
        observer.next(
          data
        );
        
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }
  /* Event to check the if any player is leaving the game */
  playerLeft(): any {
    const observable = new Observable(observer => {
      this.socket.on('room-disconnect', (data) => {
        observer.next(
          data
        );
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }
}
