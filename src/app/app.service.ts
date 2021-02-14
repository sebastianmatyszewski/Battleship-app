import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { angularMath } from 'angular-ts-math';
import { shipArrayInterface, shipStatus, shipDirection} from './shipArrayInterface';

import * as io from 'socket.io-client';

@Injectable()
export class AppService {
  public player1Board:  shipArrayInterface[] = null;
  public player2Board:  shipArrayInterface[] = null;
  private BASE_URL: string = 'http://localhost:4000';
  public socket: any;
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

  private getRandomNumber(): number {
    return angularMath.getIntegerRandomRange(0, 99);
  }
  
  private generatePlayerBoard(){
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
  private generatePlayerShip(ship, player){
    let direction = angularMath.powerOfNumber(10, angularMath.getIntegerRandomRange(0, 1));
    let randomPosition = this.getRandomNumber();
    let fieldUsed = false;
    for (let i = 0; i < ship.mastCount; i++) {
      if (direction == 10) {
        if ((randomPosition + (i * direction) - direction) >= 90) {
          fieldUsed = true;
          break;
        }
      }
      if ((player[randomPosition + (i * direction)].isShip)
        || (player[randomPosition + (i * direction)].isBlock)
        || (randomPosition + (i * direction) - 1 == 99)
        || ((randomPosition + (i * direction)) % 10 == 9)) {
        fieldUsed = true;
        break;
      }
    }
    if (!fieldUsed) {
      for (let i = 0; i < ship.mastCount; i++) {
        player[randomPosition + (i * direction)].isShip = true;
        player[randomPosition + (i * direction)].shipIndex = ship.id;
        player[randomPosition + (i * direction)].isBlock = true;
        var surrounding = [-9, -10, -11, -1, 1, 9, 10, 11];
        for (let j = 0; j < surrounding.length; j++) {
          if (((randomPosition + (i * direction) + surrounding[j]) >= 0)
            && ((randomPosition + (i * direction) + surrounding[j]) <= 99)) {
              player[randomPosition + (i * direction) + surrounding[j]].isBlock = true;
          }
        }
      }
    } else {
      this.generatePlayerShip(ship, player);
    }
       
    
  }

  private headerOptions = new RequestOptions({
    headers: new Headers({ 'Content-Type': 'application/json;charset=UTF-8' })
  });

  constructor(private http: HttpClient) { }

  public getRoomStats() {
    return new Promise(resolve => {
      this.http.get(`http://localhost:4000/getRoomStats`).subscribe(data => {
        resolve(data);
      });
    });
  }

  connectSocket() {
    this.socket = io(this.BASE_URL);
  }

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

  createNewRoom(player): any {
    this.player1Board = this.generatePlayerBoard();
    this.player2Board = this.generatePlayerBoard();
    this.socket.emit('create-room', { 'createroom': 1, 
                                      'player1Board': this.player1Board, 
                                      'player2Board': this.player2Board, 
                                      'player1': player});
    const observable = new Observable(observer => {
      this.socket.on('new-room', (data) => {
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

  joinNewRoom(roomNumber, player): any {
    this.socket.emit('join-room', { 'roomNumber': roomNumber, 'player2': player });
  }


  startGame(): any {
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
  sendPlayerMove(params): any {
    this.socket.emit('send-move', params);
  }
  receivePlayerMove(): any {
    const observable = new Observable(observer => {
      this.socket.on('receive-move', (data) => {
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
