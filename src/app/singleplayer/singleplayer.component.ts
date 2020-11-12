import { Component, OnInit, ViewChild,ElementRef} from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { shipArrayInterface, shipStatus } from '../shipArrayInterface';
import { angularMath } from 'angular-ts-math';
import {
  CdkDragDrop,
  CdkDragEnd,
  CdkDragMove,
  CdkDragStart,
  moveItemInArray,
  transferArrayItem
} from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-singleplayer',
  templateUrl: './singleplayer.component.html',
  styleUrls: ['./singleplayer.component.css']
})
export class SingleplayerComponent implements OnInit {
  user
  isLoggedIn = false;
  gameStarted = false;
  constructor(private auth: AuthService) { }
  @ViewChild('cdkBoard',{read:ElementRef,static:false}) boardElement
  public index: number;
  public shipPartId: any;
  public shipId: any;
  humanBoard: Number[] = new Array(100).fill(0);
  public playerBoard: shipArrayInterface[] = [];
  public computerBoard: shipArrayInterface[] = [];


  rightBorder = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90];
  leftBorder = [9, 19, 29, 39, 49, 59, 69, 79, 89, 99];
  downBorder = [90, 91, 92, 93, 94, 95, 96, 97, 98, 99];
  arrayBorder = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60,
    61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80,
    81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99];


  width = 10;
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
  shipOrientation = "horizontally";

  array(n: number): number[] {
    return Array(n);
  }
  changeOrientation(){
    if(this.shipOrientation === 'horizontally'){
      this.shipOrientation = 'vertically'
      for(let i = 0; i<this.ships.length; i++){
        this.ships[i].orientation='vertically'
      }
    }else{
      this.shipOrientation = 'horizontally'
      for(let i = 0; i<this.ships.length; i++){
        this.ships[i].orientation='horizontally'
      }
    }
  }
  
  allShipPlaced = false;
  
  ClickShipOrientation:any
  public shipsInBoard: any[] = [];
  position:any
  shipPositionOnArray:any
  public foo = new Array(100).fill(0);
  onDragStarted(event: CdkDragStart): void {
    console.log('zlapane: ' + this.shipId)
    // console.log('xxx: ' +this.position.x)
    // console.log('yyy: ' +this.position.y)
    //this.ships[this.shipId].positionOnArray = this.shipPositionOnArray;
    for(let i = 0; i<this.shipsInBoard.length; i++){
      if(this.shipsInBoard[i].id == this.shipId){
        console.log('ship position on array: ' + this.shipsInBoard[i].positionOnArray[0])
        console.log('ShipId: ' + this.shipId)
        this.foo[this.shipsInBoard[i].positionOnArray[0]]--;
        this.foo[this.shipsInBoard[i].positionOnArray[0]+1]--;
        this.foo[this.shipsInBoard[i].positionOnArray[0]-1]--;
        this.foo[this.shipsInBoard[i].positionOnArray[0]-10]--;
        this.foo[this.shipsInBoard[i].positionOnArray[0]-11]--;
        this.foo[this.shipsInBoard[i].positionOnArray[0]-9]--;
        this.foo[this.shipsInBoard[i].positionOnArray[0]+10]--;
        this.foo[this.shipsInBoard[i].positionOnArray[0]+11]--;
        this.foo[this.shipsInBoard[i].positionOnArray[0]+9]--;
      }
    }
    
    // this.foo[this.shipPositionOnArray]--;
    // this.foo[this.shipPositionOnArray+1]--;
    // this.foo[this.shipPositionOnArray-1]--;
    // this.foo[this.shipPositionOnArray-10]--;
    // this.foo[this.shipPositionOnArray-11]--;
    // this.foo[this.shipPositionOnArray-9]--;
    // this.foo[this.shipPositionOnArray+10]--;
    // this.foo[this.shipPositionOnArray+11]--;
    // this.foo[this.shipPositionOnArray+9]--;
    for(let i = 0;i<this.foo.length;i=i+10){
      console.log(i + ': ' + (this.foo[i]) + ' '+(this.foo[i+1]) + ' '+(this.foo[i+2]) + ' '+(this.foo[i+3]) + ' '+(this.foo[i+4]) + ' '+(this.foo[i+5]) + ' '+(this.foo[i+6]) + ' '+(this.foo[i+7]) + ' '+(this.foo[i+8]) + ' '+(this.foo[i+9])); 
    }
  }
  drop(event: CdkDragDrop<string[]>) {
    
    console.log(' ')

    console.log('idstatkuaktualniezłapanego: '+this.shipId)
    // 
    console.log(this.shipPositionOnArray)

    for(let i = 0; i<this.ships.length; i++){
      if(this.ships[i].id == this.shipId){
          console.log('id statku złapanego: '+this.shipId)
          this.ships[i].disabled = true;
          console.log('zablokuj statek')
          console.log('id statku: '+this.ships[i].id)
          

      }}
    //console.log('hhh '+this.ships[this.shipId].positionOnArray)
    // console.log('previous index: ' + event.previousIndex)
    // console.log('current index: ' + event.currentIndex)
    // console.log('id czesci statku: ' + this.shipPartId + ', ' + this.index)
    // console.log('id statku: ' + this.shipId)
    
    for(let i = 0; i<this.ships.length; i++){
      if(this.ships[i].id == this.shipId){
        //console.log('1: ' + this.ships[i].id + ', ' + this.shipId)
        //console.log('id statku w [ships]: ' + this.ships[i].id)
        // console.log('id statku złapanego: '+this.shipId)
        //   this.ships[i].disabled = true;
        //   console.log('zablokuj statek')
        //   console.log('id statku: '+this.ships[i].id)
        //   console.log(this.ships[i])
        if(this.ships[i].orientation === 'horizontally'){
          event.previousContainer.data[event.previousIndex]['top']=this.position?this.position.y-this.boardElement.nativeElement.getBoundingClientRect().y:0
          event.previousContainer.data[event.previousIndex]['left']=this.position?this.position.x-this.boardElement.nativeElement.getBoundingClientRect().x-(this.shipPartId*40)-(this.shipPartId*2):0
          console.log('x: ' +this.position.x)
          console.log('y: ' +this.position.y)
        }else{
          event.previousContainer.data[event.previousIndex]['top']=this.position?this.position.y-this.boardElement.nativeElement.getBoundingClientRect().y-(this.shipPartId*40)-(this.shipPartId*2):0
          event.previousContainer.data[event.previousIndex]['left']=this.position?this.position.x-this.boardElement.nativeElement.getBoundingClientRect().x:0
        }
      }
      
    }
    for(let i = 0; i<this.shipsInBoard.length; i++){
      //console.log(this.shipsInBoard[i])
      if(this.shipsInBoard[i].id == this.shipId){
        console.log('ID pola: ' + this.position.y + ' statek: ' + this.shipsInBoard[i].id + ', ' + this.shipId + 'orientation: ' + this.shipsInBoard[i].orientation)
        
        //console.log('orientation: ' + this.shipsInBoard[i].orientation)
        //console.log('id statku w [shipsInBoard]: ' + this.shipsInBoard[i].id)
        if(this.shipsInBoard[i].orientation === 'horizontally'){
          console.log('orientation: ' + this.shipsInBoard[i].orientation)
          event.previousContainer.data[event.previousIndex]['top']=this.position?this.position.y-this.boardElement.nativeElement.getBoundingClientRect().y:200
          event.previousContainer.data[event.previousIndex]['left']=this.position?this.position.x-this.boardElement.nativeElement.getBoundingClientRect().x-(this.shipPartId*40)-(this.shipPartId*2):200
          console.log('x: ' +this.position.x)
          console.log('y: ' +this.position.y)
          //this.shipsInBoard[i].orientation === 'horizontally'
          //event.previousContainer.data[event.previousIndex]['orientation'] = 'horizontally'
        }else if(this.shipsInBoard[i].orientation === 'vertically'){
          console.log('orientation: ' + this.shipsInBoard[i].orientation)
          event.previousContainer.data[event.previousIndex]['top']=this.position?this.position.y-this.boardElement.nativeElement.getBoundingClientRect().y-(this.shipPartId*40)-(this.shipPartId*2):0
          event.previousContainer.data[event.previousIndex]['left']=this.position?this.position.x-this.boardElement.nativeElement.getBoundingClientRect().x:0
          //event.previousContainer.data[event.previousIndex]['orientation'] = 'vertically'
         // this.shipsInBoard[i].orientation === 'vertically'
        }
      }
    }
    for(let i = 0; i<this.shipsInBoard.length; i++){
      if(this.shipsInBoard[i].id == this.shipId){

        console.log(this.shipsInBoard[i].orientation + ', ' + this.shipsInBoard[i].mastCount + ', ' + this.shipPartId)
      }
    }
    for(let i = 0; i<this.ships.length; i++){
      if(this.ships[i].id == this.shipId){
        // console.log('jestem tutaj')
        console.log('Available: ' + this.ships[i].orientation + ', ' + this.ships[i].mastCount + ', ' + this.shipPartId)
      }
    }
    console.log('ship position on array: ' + this.shipPositionOnArray)
    if (event.previousContainer === event.container) {


      

      for(let i = 0; i<this.shipsInBoard.length; i++){
        if(this.shipsInBoard[i].id == this.shipId){
          
          if(this.shipsInBoard[i].mastCount == 1){
            this.shipsInBoard[i].positionOnArray[0] = this.shipPositionOnArray;
            this.foo[this.shipPositionOnArray]++;
            this.foo[this.shipPositionOnArray+1]++;
            this.foo[this.shipPositionOnArray-1]++;
            this.foo[this.shipPositionOnArray-10]++;
            this.foo[this.shipPositionOnArray-11]++;
            this.foo[this.shipPositionOnArray-9]++;
            this.foo[this.shipPositionOnArray+10]++;
            this.foo[this.shipPositionOnArray+11]++;
            this.foo[this.shipPositionOnArray+9]++;
          }else{
            
            if(this.shipsInBoard[i].orientation == 'horizontally'){
              var idShipZero = this.shipPositionOnArray - (this.shipPartId)
              for(let j = 0; j<this.shipsInBoard[i].mastCount; j++){
                this.shipsInBoard[i].positionOnArray[j] = idShipZero+j;
                console.log('ustaw statki horizontally')
              }
              console.log(this.shipsInBoard[i]) 
            }else{
              var idShipZero = this.shipPositionOnArray - (this.shipPartId*10)
              for(let j = 0; j<this.shipsInBoard[i].mastCount; j++){
                this.shipsInBoard[i].positionOnArray[j] = idShipZero+(j*10);
                console.log('ustaw statki vertically')
              }
              console.log(this.shipsInBoard[i])
            }
          }
          

          
        }
        
      }
      
      console.log('move item in array')
      console.log('xx: ' +this.position.x)
      console.log('yy: ' +this.position.y)
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      console.log('xx: ' +this.position.x)
      console.log('yy: ' +this.position.y)
      console.log(this.shipsInBoard)
      
    } else {


      

      for(let i = 0; i<this.ships.length; i++){
        if(this.ships[i].id == this.shipId){
          // console.log('id statku złapanego: '+this.shipId)
          // this.ships[i].disabled = true;
          // console.log('zablokuj statek')
          // console.log('id statku: '+this.ships[i].id)
          // console.log(this.ships[i])
          if(this.ships[i].mastCount == 1){
            this.ships[i].positionOnArray[0] = this.shipPositionOnArray;
            if(this.ships[i].mastCount == 1){
              this.foo[this.shipPositionOnArray]++;
              this.foo[this.shipPositionOnArray+1]++;
              this.foo[this.shipPositionOnArray-1]++;
              this.foo[this.shipPositionOnArray-10]++;
              this.foo[this.shipPositionOnArray-11]++;
              this.foo[this.shipPositionOnArray-9]++;
              this.foo[this.shipPositionOnArray+10]++;
              this.foo[this.shipPositionOnArray+11]++;
              this.foo[this.shipPositionOnArray+9]++;
            }
            
          }
            else{
              if(this.ships[i].orientation == 'horizontally'){
                var idShipZero = this.shipPositionOnArray - (this.shipPartId)
                for(let j = 0; j<this.ships[i].mastCount; j++){
                  this.ships[i].positionOnArray[j] = idShipZero+j;
                  // console.log('ustaw statki horizontally')
                }
                console.log(this.ships[i]) 
              }else{
                var idShipZero = this.shipPositionOnArray - (this.shipPartId*10)
                for(let j = 0; j<this.ships[i].mastCount; j++){
                  this.ships[i].positionOnArray[j] = idShipZero+(j*10);
                  // console.log('ustaw statki vertically')
                }
                console.log(this.ships[i])
              }
              // console.log('Statek z ' + this.ships[i].mastCount + ' masztami')
            }
            
        }
      }
      
      

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      
    }
    // for(let i = 0; i<this.shipsInBoard.length; i++){
    //   if(this.shipsInBoard[i].id == this.shipId){
    //       console.log('id statku złapanego: '+this.shipId)
    //       this.shipsInBoard[i].disabled = true;
    //       console.log('zablokuj statek')
    //       console.log('id statku: '+this.shipsInBoard[i].id)
    //       console.log(this.shipsInBoard[i])

    //   }}
    

    for(let i = 0;i<this.foo.length;i=i+10){
      
      console.log(i + ': ' + (this.foo[i]) + ' '+(this.foo[i+1]) + ' '+(this.foo[i+2]) + ' '+(this.foo[i+3]) + ' '+(this.foo[i+4]) + ' '+(this.foo[i+5]) + ' '+(this.foo[i+6]) + ' '+(this.foo[i+7]) + ' '+(this.foo[i+8]) + ' '+(this.foo[i+9])); 
    }
    console.log(this.shipsInBoard)
    if(this.ships.length == 0){
      this.allShipPlaced = true;

      //uzupełnienie tablicy gracza domyślnymi wartościami
      for (let i = 0; i < 100; i++) {
        var test: shipArrayInterface = {
          index: i,
          shipIndex: null,
          isShip: false,
          isBlock: false,
          status: shipStatus.NO_ACTION,
          positionOnBoard: []
        }
        this.playerBoard.push(test);
      }


      
    }else{
      this.allShipPlaced = false;
    }
  //   for(let i = 0; i<this.shipsInBoard.length; i++){
  //     for(let j = 0; j<this.shipsInBoard[i].mastCount; j++){
  //       console.log(this.shipsInBoard[i].positionOnArray[j])
  //   }
  // }
  }

  mouseoverShip(pos){
    // console.log(pos)
  }

  drawBotShips(){
    for (let i = 0; i < 100; i++) {
      var test: shipArrayInterface = {
        index: i,
        shipIndex: null,
        isShip: false,
        isBlock: false,
        status: shipStatus.NO_ACTION,
        positionOnBoard: []
      }
      this.computerBoard.push(test);
    }

    
    this.generateBotShip(this.shipsInBoard[0]);
    this.generateBotShip(this.shipsInBoard[1]);
    this.generateBotShip(this.shipsInBoard[2]);
    this.generateBotShip(this.shipsInBoard[3]);
    this.generateBotShip(this.shipsInBoard[4]);
    this.generateBotShip(this.shipsInBoard[5]);
    this.generateBotShip(this.shipsInBoard[6]);
    this.generateBotShip(this.shipsInBoard[7]);

    console.log('Bot')
    for(let i = 0; i<this.computerBoard.length; i=i+10){
      console.log(i + ': ' + (this.computerBoard[i].isShip? 1:0) + ' '+(this.computerBoard[i+1].isShip? 1:0) + ' '+(this.computerBoard[i+2].isShip? 1:0) + ' '+(this.computerBoard[i+3].isShip? 1:0) + ' '+(this.computerBoard[i+4].isShip? 1:0) + ' '+(this.computerBoard[i+5].isShip? 1:0) + ' '+(this.computerBoard[i+6].isShip? 1:0) + ' '+(this.computerBoard[i+7].isShip? 1:0) + ' '+(this.computerBoard[i+8].isShip? 1:0) + ' '+(this.computerBoard[i+9].isShip? 1:0)); 
    }
  }

  startGame(){
    
    for(let i = 0; i<this.shipsInBoard.length; i++){
      for(let j = 0; j<this.shipsInBoard[i].mastCount; j++){
        // console.log(this.playerBoard[this.shipsInBoard[i].positionOnArray[j]])
        this.playerBoard[this.shipsInBoard[i].positionOnArray[j]].isShip = true;
        this.playerBoard[this.shipsInBoard[i].positionOnArray[j]].isBlock = true;
        this.playerBoard[this.shipsInBoard[i].positionOnArray[j]].shipIndex = this.shipsInBoard[i].id;
        for(let k = 0; k<this.shipsInBoard.length; k++){
          if(this.shipsInBoard[k].id == this.playerBoard[this.shipsInBoard[i].positionOnArray[j]].shipIndex){
            
            this.playerBoard[this.shipsInBoard[i].positionOnArray[j]].positionOnBoard.push(this.shipsInBoard[k].positionOnArray);
            console.log(this.playerBoard[this.shipsInBoard[i].positionOnArray[j]].positionOnBoard)
          }
          
        }


        // this.computerBoard[randomShipPosition + (i * direction) - 1].isBlock = true;
        // this.humanBoard[this.shipsInBoard[i].positionOnArray[j]] = 1
      }
    }



        

    
    console.log('Player' + this.playerBoard.length + ', ' + this.humanBoard.length)
    for(let i = 0;i<this.humanBoard.length;i=i+10){
    
      // console.log(i + ': ' + (this.humanBoard[i]) + ' '+(this.humanBoard[i+1]) + ' '+(this.humanBoard[i+2]) + ' '+(this.humanBoard[i+3]) + ' '+(this.humanBoard[i+4]) + ' '+(this.humanBoard[i+5]) + ' '+(this.humanBoard[i+6]) + ' '+(this.humanBoard[i+7]) + ' '+(this.humanBoard[i+8]) + ' '+(this.humanBoard[i+9])); 
      
      console.log(i + ': ' + (this.playerBoard[i].isShip? 1:0) + ' '+(this.playerBoard[i+1].isShip? 1:0) + ' '+(this.playerBoard[i+2].isShip? 1:0) + ' '+(this.playerBoard[i+3].isShip? 1:0) + ' '+(this.playerBoard[i+4].isShip? 1:0) + ' '+(this.playerBoard[i+5].isShip? 1:0) + ' '+(this.playerBoard[i+6].isShip? 1:0) + ' '+(this.playerBoard[i+7].isShip? 1:0) + ' '+(this.playerBoard[i+8].isShip? 1:0) + ' '+(this.playerBoard[i+9].isShip? 1:0)); 
    }
    this.drawBotShips();

    for(let k = 0; k<this.computerBoard.length; k++){
      if(this.computerBoard[k].isShip == true){
        for(let i = 0; i<this.computerBoard.length; i++){
          if(this.computerBoard[k].shipIndex == this.computerBoard[i].shipIndex){
            this.computerBoard[k].positionOnBoard.push(this.computerBoard[i].index);
            console.log(this.computerBoard[k].positionOnBoard)
          }
        }
        
      }
      
}
    this.gameStarted = true;

  }

  generateBotShip(ship){
    let randomDirection = angularMath.getIntegerRandomRange(0, 1);
    let direction;
    if (randomDirection === 0) direction = 1
    if (randomDirection === 1) direction = 10
    let randomShipPosition = this.getRandomNumber();
    let fieldUsed = false;

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
        if (this.computerBoard[randomShipPosition + (i * direction)].isShip) {
          fieldUsed = true;
          break;
        }
        if (this.computerBoard[randomShipPosition + (i * direction)].isBlock) {
          fieldUsed = true;
          break;
        }
      } else {
        if (this.computerBoard[randomShipPosition + (i * direction)].isShip) {
          fieldUsed = true;
          break;
        }
        if (this.computerBoard[randomShipPosition + (i * direction)].isBlock) {
          fieldUsed = true;
          break;
        }
      }
    }
    if (!fieldUsed) {
      for (let i = 0; i < ship.mastCount; i++) {

        this.computerBoard[randomShipPosition + (i * direction)].isShip = true;
        this.computerBoard[randomShipPosition + (i * direction)].shipIndex = ship.id;
        this.computerBoard[randomShipPosition + (i * direction)].isBlock = true;

        if (this.arrayBorder.includes(randomShipPosition + (i * direction) - 9)) {
          this.computerBoard[randomShipPosition + (i * direction) - 9].isBlock = true;
        }
        if (this.arrayBorder.includes(randomShipPosition + (i * direction) - 10)) {
          this.computerBoard[randomShipPosition + (i * direction) - 10].isBlock = true;
        }
        if (this.arrayBorder.includes(randomShipPosition + (i * direction) - 11)) {
          this.computerBoard[randomShipPosition + (i * direction) - 11].isBlock = true;
        }
        if (this.arrayBorder.includes(randomShipPosition + (i * direction) - 1)) {
          this.computerBoard[randomShipPosition + (i * direction) - 1].isBlock = true;
        }
        if (this.arrayBorder.includes(randomShipPosition + (i * direction) + 1)) {
          this.computerBoard[randomShipPosition + (i * direction) + 1].isBlock = true;
        }
        if (this.arrayBorder.includes(randomShipPosition + (i * direction) + 9)) {
          this.computerBoard[randomShipPosition + (i * direction) + 9].isBlock = true;
        }
        if (this.arrayBorder.includes(randomShipPosition + (i * direction) + 10)) {
          this.computerBoard[randomShipPosition + (i * direction) + 10].isBlock = true;
        }
        if (this.arrayBorder.includes(randomShipPosition + (i * direction) + 11)) {
          this.computerBoard[randomShipPosition + (i * direction) + 11].isBlock = true;
        }
//fe
      }
    } else {
      // console.log("przeszło petle");
      this.generateBotShip(ship);


    }
    
  }

  shothimself(shot){
    console.log(this.playerBoard[shot.index])
  }

  shotEnemyBoard(shot){
    console.log(this.computerBoard[shot.index])
    if(shot.isShip === true){
      this.computerBoard[shot.index].status = shipStatus.HIT;
    }else{
      this.computerBoard[shot.index].status = shipStatus.MISS;
    }
    console.log(this.computerBoard[shot.index])
  }

  getRandomNumber(): number {
    return angularMath.getIntegerRandomRange(0, 99);
  }

  ngOnInit(): void {
    if(localStorage.getItem('user')!== null){
      this.isLoggedIn = true;
      this.user = JSON.parse(localStorage.getItem("user"));
      console.log('singleplayer: ' + this.user)
    }
    else{
      this.isLoggedIn = false;
    }
    
    // this.auth.getUserState()
    //   // .subscribe(user =>{
    //     this.user = this.auth.user;
      // })
  }
  zrobcos(){
    console.log('robie coś')
  }

}
