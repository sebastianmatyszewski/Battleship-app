import { Component, Renderer2, ViewChild, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { shipArrayInterface, shipStatus, shipDirection} from '../shipArrayInterface';
import { ResponseContentType } from '@angular/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-multiplayer',
  templateUrl: './multiplayer.component.html',
  styleUrls: ['./multiplayer.component.css'],
  providers: [AppService]
})
export class MultiplayerComponent {
  @ViewChild('content') private content;
  public title = 'Gra w statki';
  public meNickname : string = 'Player 1';
  public enemyNickname : string = 'Player 2';
  public myBoard: shipArrayInterface[];
  public enemyBoard: shipArrayInterface[];
  public myTurn: Boolean = true;
  public gameIsPending: Boolean = false;
  public modalOption: NgbModalOptions = {};
  public totalRooms: number = 0;
  public emptyRooms: Array<number> = [];
  public roomNumber: number = 0;
  public localModalRef:any;
  constructor(
    public _renderer: Renderer2,
    public modalService: NgbModal,
    public appService: AppService,
    private router: Router
  ) {
  
  }
  private ngAfterViewInit() {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.centered = true
    this.modalOption.size = "lg";
    this.localModalRef = this.modalService.open(this.content, this.modalOption);
    this.appService.connectSocket();
    this.appService.getRoomStats().then(response => {
      this.totalRooms = response['totalRoomCount'];
      this.emptyRooms = response['emptyRooms'];
    });

    this.appService.getRoomsAvailable().subscribe(response => {
      this.totalRooms = response['totalRoomCount'];
      this.emptyRooms = response['emptyRooms'];
    });

    this.appService.startGame().subscribe((response) => {
      this.localModalRef.close();
      this.roomNumber = response['roomNumber'];
    });

    this.appService.receivePlayerMove().subscribe((response) => {
      this.opponentMove(response);

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

    this.appService.playerLeft().subscribe((response) => {
      alert('Player Left');
      window.location.reload();
    });
  }

  private joinRoom(roomNumber) {
    this.myTurn = false;
    this.appService.joinNewRoom(roomNumber, JSON.parse(localStorage.getItem("user")));
    
  }

  private createRoom() {
    this.appService.createNewRoom(JSON.parse(localStorage.getItem("user"))).subscribe((response) => {
      this.roomNumber = response.roomNumber;
    });
  }

  private opponentMove(response) {
    if (response['winner'] === null) {
      if(response.turn == JSON.parse(localStorage.getItem("user")).displayName){
        this.myBoard = response.myBoard
        this.enemyBoard = response.enemyBoard

      }else{
        this.myBoard = response.enemyBoard
        this.enemyBoard = response.myBoard
      }

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
  private goHome(){
    this.localModalRef.close();
    this.router.navigate(['/home']);
  }
  private shot(number) {
    if (!this.myTurn) {
      return;
    }
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

  }

  private resetGame() {
    window.location.reload();
  }
  private array(n: number): number[] {
    return Array(n);
  }
}
