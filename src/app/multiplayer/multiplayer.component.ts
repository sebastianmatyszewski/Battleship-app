
/* 
* @author Shashank Tiwari
* Multiplayer Tic-Tac-Toe Game using Angular, Nodejs
*/
import { Component, Renderer2, ViewChild, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { shipArrayInterface, shipStatus, shipDirection} from '../shipArrayInterface';
import { ResponseContentType } from '@angular/http';

@Component({
  selector: 'app-multiplayer',
  templateUrl: './multiplayer.component.html',
  styleUrls: ['./multiplayer.component.css'],
  providers: [AppService]
})
export class MultiplayerComponent {

  /*
  * Initial Game Variables and constants starts
  */
 public title = 'BattleShip multiplayer';
  public gameGrid = <Array<Object>>[];
  public meNickname : string = 'Player 1'
  public enemyNickname : string = 'Player 2'
  public myBoard: shipArrayInterface[];
  public enemyBoard: shipArrayInterface[];
  public playedGameGrid = <Array<Object>>[];
  public movesPlayed = <number>0;
  public myTurn = <Boolean>true;
  public whoWillStart = <Boolean>true;
  public playerName: any;
  public gameIsPending: Boolean = false;
  /*
  * Initial Game Variables and constants starts
  */

  /*Bootstrap modal Options starts*/
  @ViewChild('content') private content;
  public modalOption: NgbModalOptions = {};
  /* Bootstrap modal Options ends */

  /*socket related Variable,ng-models and constant starts*/
  public totalRooms = <Number>0;
  public emptyRooms = <Array<number>>[];
  public roomNumber = <Number>0;
  public playedText = <string>'';
  public whoseTurn = 'X';
  /*socket related Variable,ng-models and constant starts*/

  constructor(
    public _renderer: Renderer2,
    public modalService: NgbModal,
    public appService: AppService,
  ) {
    this.gameGrid = appService.gameGrid;
    console.log(this.gameGrid);
  }
  ngAfterViewInit() {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.size = 'lg';
    // const localModalRef = this.modalService.open(this.content, this.modalOption);
    const localModalRef = this.modalService.open(this.content, { size: 'lg', backdrop: 'static' });

    /*Code to display the Modal start*/

    /*Code to display the Modal start*/

    // connect the player to the socket
    this.appService.connectSocket();

    // HTTP call to get Empty rooms and total room numbers
    this.appService.getRoomStats().then(response => {
      this.totalRooms = response['totalRoomCount'];
      this.emptyRooms = response['emptyRooms'];
    });

    // Socket evenet will total available rooms to play.
    this.appService.getRoomsAvailable().subscribe(response => {
      this.totalRooms = response['totalRoomCount'];
      this.emptyRooms = response['emptyRooms'];
    });

    // Socket evenet to start a new Game
    this.appService.startGame().subscribe((response) => {
      localModalRef.close();
      this.roomNumber = response['roomNumber'];
      console.log('1 gracz: ' + response.player1.displayName)
      console.log('2 gracz: ' + response.player2.displayName)
    });

    // Socket event will receive the Opponent player's Move
    this.appService.receivePlayerMove().subscribe((response) => {
      this.opponentMove(response);
      console.log('ruch')
    });
    this.appService.receiveBoards().subscribe((response) => {
      if(response.player1.displayName == JSON.parse(localStorage.getItem("user")).displayName){
        this.myBoard = response.player1Board
        this.enemyBoard = response.player2Board
        this.meNickname = response.player1.displayName
        this.enemyNickname = response.player2.displayName

      }else{
        this.myBoard = response.player2Board
        this.enemyBoard = response.player1Board
        this.meNickname = response.player2.displayName
        this.enemyNickname = response.player1.displayName

      }
      
      this.gameIsPending = true;
    });

    // Socket event to check if any player left the room, if yes then reload the page.
    this.appService.playerLeft().subscribe((response) => {
      alert('Player Left');
      window.location.reload();
    });
  }

  /**
   * Method to join the new Room by passing Romm Number
   * @param roomNumber
   */
  // brodcast(message){
  //   this.player1Board = message.player1Board
  //   this.player2Board = message.player2Board
  //   this.gameIsPending = true;
  //   console.log('Gracz 1')
  //     for(let i = 0; i<this.player1Board.length; i=i+10){
  //       console.log(i + ': ' + (this.player1Board[i].isShip? 1:0) + ' '+(this.player1Board[i+1].isShip? 1:0) + ' '+(this.player1Board[i+2].isShip? 1:0) + ' '+(this.player1Board[i+3].isShip? 1:0) + ' '+(this.player1Board[i+4].isShip? 1:0) + ' '+(this.player1Board[i+5].isShip? 1:0) + ' '+(this.player1Board[i+6].isShip? 1:0) + ' '+(this.player1Board[i+7].isShip? 1:0) + ' '+(this.player1Board[i+8].isShip? 1:0) + ' '+(this.player1Board[i+9].isShip? 1:0)); 
  //     }
  //     // this.player2Board = this.appService.player2Board;
  //     console.log('Gracz 2')
  //     for(let i = 0; i<this.player2Board.length; i=i+10){
  //       console.log(i + ': ' + (this.player2Board[i].isShip? 1:0) + ' '+(this.player2Board[i+1].isShip? 1:0) + ' '+(this.player2Board[i+2].isShip? 1:0) + ' '+(this.player2Board[i+3].isShip? 1:0) + ' '+(this.player2Board[i+4].isShip? 1:0) + ' '+(this.player2Board[i+5].isShip? 1:0) + ' '+(this.player2Board[i+6].isShip? 1:0) + ' '+(this.player2Board[i+7].isShip? 1:0) + ' '+(this.player2Board[i+8].isShip? 1:0) + ' '+(this.player2Board[i+9].isShip? 1:0)); 
  //     }
  //   console.log('Informacja zwrotna')
  //   console.log(message)
  // }
  joinRoom(roomNumber) {
    this.myTurn = false;
    this.whoWillStart = false;
    this.whoseTurn = 'O';
    this.appService.joinNewRoom(roomNumber, JSON.parse(localStorage.getItem("user")));
    
  }
  /**
   * Method create new room
   */
  createRoom() {
    this.myTurn = true;
    this.whoseTurn = 'X';
    this.whoWillStart = true;
    this.appService.createNewRoom(JSON.parse(localStorage.getItem("user"))).subscribe((response) => {
      this.roomNumber = response.roomNumber;
    });
  }

  /**
   * This method will be called by the socket event subscriber to make the Opponent players moves
   * @param response
   */
  opponentMove(response) {
    console.log(response)
    // console.log(response)
    // this.displayPlayerTurn = !this.displayPlayerTurn ? true : false;
    if (response['winner'] === null) {
      if(response.turn == JSON.parse(localStorage.getItem("user")).displayName){
        this.myBoard = response.myBoard
        this.enemyBoard = response.enemyBoard
        
        // this.meNickname = response.player2.displayName
        // this.enemyNickname = response.player1.displayName

      }else{
        this.myBoard = response.enemyBoard
        this.enemyBoard = response.myBoard
        
        // this.meNickname = response.player1.displayName
        // this.enemyNickname = response.player2.displayName
        

      }
      // this.playedGameGrid[params['position']] = {
      //   position: params['position'],
      //   player: params['playedText']
      // };
      if(response.turn == JSON.parse(localStorage.getItem("user")).displayName){
        this.myTurn = false;
      }else{
        this.myTurn = true;
      }
      
      
    } else {
      alert(response['winner']);
      this.resetGame();
    }
  }

  /**
   * This method will be called when the current user tries to play his/her move
   * Also we will send the socket event to the server.
   * @param number
   */
  shot(number) {
    if (!this.myTurn) {
      return;
    }
    console.log(number)
    // this.movesPlayed += 1;
    // this.playedGameGrid[number] = {
    //   position: number,
    //   player: this.whoseTurn
    // };
    // // this.appService.sendBoards({
    // //   'roomNumber': this.roomNumber,
    // // });
    // // this.appService.sendPlayer({
    // //   'roomNumber': this.roomNumber,
    // // });
    this.appService.sendPlayerMove({
      'player1' : this.meNickname,
      'player2' : this.enemyNickname,
      'roomNumber': this.roomNumber,
      'turn': this.meNickname,
      'playerShot': number,
      'myBoard': this.myBoard,
      'enemyBoard': this.enemyBoard,
      
    });
    this.myTurn = false;
    // console.log('receivePlayerMove')
    // this.appService.receivePlayerMove().subscribe((response) => {
    //   this.opponentMove(response);
    //   console.log('ruch2')
    // });
    
    // this.displayPlayerTurn = !this.displayPlayerTurn ? true : false;
  }
  /**
   * This method will be used to render the data between the Grids.
   * @param number
   */
  renderPlayedText(number) {
    if (this.playedGameGrid[number] === undefined) {
      return '';
    } else {
      this.playedText = this.playedGameGrid[number]['player'];
      return this.playedText;
    }
  }
  /**
   * As the name suggests here in this method we will reset the game.
   */
  resetGame() {
    this.playedGameGrid = [];
    this.gameGrid = [];
    this.gameGrid = this.appService.gameGrid;
    this.movesPlayed = 0;
    if (this.whoWillStart) {
      this.myTurn = true;
      // this.displayPlayerTurn = true;
      this.whoseTurn = 'X';
    } else {
      // this.displayPlayerTurn = true;
      this.whoseTurn = 'O';
    }
  }
  array(n: number): number[] {
    return Array(n);
  }
}
