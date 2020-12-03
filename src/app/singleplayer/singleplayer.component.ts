import { Component, OnInit, ViewChild,ElementRef} from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { shipArrayInterface, shipStatus, shipDirection} from '../shipArrayInterface';
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
  constructor(private auth: AuthService) { }
  @ViewChild('cdkBoard',{read:ElementRef,static:false}) boardElement
  public index: number;
  public shipPartId: any;
  public shipId: any;
  humanBoard: Number[] = new Array(100).fill(0);
  public playerBoard: shipArrayInterface[] = [];
  public computerBoard: shipArrayInterface[] = [];
  playerHitStatus: String;
  computerHitStatus: String;
  shipsShotedByPlayer: number = 0;
  shipsShotedByComputer: number = 0;
  gameIsPending: Boolean = false;
  // Zmienne bota
  shotShipDirection = shipDirection.NOT_SET;
  shotShipPosition: number;
  shotShipArray: number[] = new Array();
  isShipShoted: Boolean = false;
  isShipShotedPosition: number;
  isShipShotedPositionDirection: number;
  isShipShotedPositionCount: number[] = new Array();



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
          tooltip: "",
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
        tooltip: "",
        positionOnBoard: []
      }
      this.computerBoard.push(test);
    }
    console.log(' ')
    console.log(' ')
    console.log(' ')
    console.log(' ')

    console.log(this.computerBoard)

    console.log(' ')
    console.log(' ')
    console.log(' ')
    console.log(' ')

    
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
    console.log('Długosc statków: s'+this.shipsInBoard.length)
    console.log(this.shipsInBoard)
    
    for(let i = 0; i<this.shipsInBoard.length; i++){ //8 statków

      console.log(i + ': ' + this.shipsInBoard[i].mastCount)
      console.log(this.shipsInBoard[i].mastCount)
      // console.log(this.shipsInBoard)

      for(let j = 0; j<this.shipsInBoard[i].mastCount; j++){ //ilosc masztów statku
        // console.log(this.playerBoard[this.shipsInBoard[i].positionOnArray[j]])
        // this.playerBoard[this.shipsInBoard[i].positionOnArray[j]].isShip = true;
        // this.playerBoard[this.shipsInBoard[i].positionOnArray[j]].isBlock = true;
        // this.playerBoard[this.shipsInBoard[i].positionOnArray[j]].shipIndex = this.shipsInBoard[i].id;
        for(let k = 0; k<this.shipsInBoard[i].positionOnArray.length; k++){
          this.playerBoard[this.shipsInBoard[i].positionOnArray[k]].isShip = true;
          this.playerBoard[this.shipsInBoard[i].positionOnArray[k]].isBlock= true;
          this.playerBoard[this.shipsInBoard[i].positionOnArray[k]].shipIndex = this.shipsInBoard[i].positionOnArray[k];
          console.log('in statku '+this.shipsInBoard[i].positionOnArray[k])
          this.playerBoard[this.shipsInBoard[i].positionOnArray[k]].positionOnBoard.push(this.shipsInBoard[i].positionOnArray)
          
        }

        // if(this.shipsInBoard[i].isShip){
        //   this.playerBoard[i].isShip = true;
        //   this.playerBoard[i].isBlock = true;
        //   this.playerBoard[i].shipIndex = this.shipsInBoard[i].id;
        //   this.playerBoard[i].positionOnBoard.push(this.shipsInBoard[i].positionOnArray)
          
        // }console.log('wkurwiam sie bardziej ' + this.playerBoard[i])
        // this.playerBoard[this.shipsInBoard[i].index].isShip = true;
        // this.playerBoard[this.shipsInBoard[i].index].isBlock = true;
        // this.playerBoard[this.shipsInBoard[i].index].shipIndex = this.shipsInBoard[i].id;
        // for(let k = 0; k<this.shipsInBoard[i].positionOnBoard.length; k++){

          // if(this.shipsInBoard[k].id == this.playerBoard[this.shipsInBoard[i].positionOnArray[j]].shipIndex){
          //   console.log('wkurwia ' +this.playerBoard[this.shipsInBoard[i].positionOnArray[j]].shipIndex)
          //   console.log('wkurwia2 ' +this.shipsInBoard[i].positionOnArray[j])
          //   console.log('wkurwia3' + this.shipsInBoard[k].index)
          //   // ddd
          //   this.playerBoard[this.shipsInBoard[i].positionOnArray[j]].positionOnBoard.push(this.shipsInBoard[i].positionOnArray[j]);
          //   console.log(this.playerBoard[this.shipsInBoard[i].positionOnArray[j]].positionOnBoard)
          //   // this.computerBoard[k].positionOnBoard.push(this.computerBoard[i].index);
          //   // console.log(this.playerBoard)
          // }
          
        // }


        // this.computerBoard[randomShipPosition + (i * direction) - 1].isBlock = true;
        // this.humanBoard[this.shipsInBoard[i].positionOnArray[j]] = 1
      }
    }

    //wyświetlenie tablic kazdego ze statkow zawierającego inne czesci statki nalezące do statków
    console.log(this.playerBoard)

    // console.log('Bot')
    // for(let i = 0; i<this.playerBoard.length; i=i+10){
    //   console.log(i + ': ' + (this.playerBoard[i].isShip? 1:0) + ' '+(this.playerBoard[i+1].isShip? 1:0) + ' '+(this.playerBoard[i+2].isShip? 1:0) + ' '+(this.playerBoard[i+3].isShip? 1:0) + ' '+(this.playerBoard[i+4].isShip? 1:0) + ' '+(this.playerBoard[i+5].isShip? 1:0) + ' '+(this.playerBoard[i+6].isShip? 1:0) + ' '+(this.playerBoard[i+7].isShip? 1:0) + ' '+(this.playerBoard[i+8].isShip? 1:0) + ' '+(this.playerBoard[i+9].isShip? 1:0)); 
    // }
    // for(let i = 0; i<this.playerBoard.length; i++){
    //   if(this.playerBoard[i].isShip)
    //   console.log('dlugosc'+this.playerBoard[i].positionOnBoard.length)
    //   for(let j = 0; j<this.playerBoard[i].positionOnBoard.length; j++){
    //     console.log(this.playerBoard[i].positionOnBoard[j])
    //   }
    // }




        

    
    // console.log('Player' + this.playerBoard.length + ', ' + this.humanBoard.length)
    // for(let i = 0;i<this.humanBoard.length;i=i+10){
    
    //   // console.log(i + ': ' + (this.humanBoard[i]) + ' '+(this.humanBoard[i+1]) + ' '+(this.humanBoard[i+2]) + ' '+(this.humanBoard[i+3]) + ' '+(this.humanBoard[i+4]) + ' '+(this.humanBoard[i+5]) + ' '+(this.humanBoard[i+6]) + ' '+(this.humanBoard[i+7]) + ' '+(this.humanBoard[i+8]) + ' '+(this.humanBoard[i+9])); 
      
    //   console.log(i + ': ' + (this.playerBoard[i].isShip? 1:0) + ' '+(this.playerBoard[i+1].isShip? 1:0) + ' '+(this.playerBoard[i+2].isShip? 1:0) + ' '+(this.playerBoard[i+3].isShip? 1:0) + ' '+(this.playerBoard[i+4].isShip? 1:0) + ' '+(this.playerBoard[i+5].isShip? 1:0) + ' '+(this.playerBoard[i+6].isShip? 1:0) + ' '+(this.playerBoard[i+7].isShip? 1:0) + ' '+(this.playerBoard[i+8].isShip? 1:0) + ' '+(this.playerBoard[i+9].isShip? 1:0)); 
    // }
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
    this.gameIsPending = true;

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

  playerShot(shot){
    if(this.gameIsPending){
      if(shot.isShip === true){
        this.computerBoard[shot.index].status = shipStatus.HIT;
  
        var hitAndSink = 0;
        for(let i = 0; i<this.computerBoard[shot.index].positionOnBoard.length; i++){
          // console.log('tuTaj ' +  this.playerBoard[shot].positionOnBoard.length + ', ' + this.playerBoard[shot].positionOnBoard[i])
            hitAndSink = hitAndSink + this.computerBoard[this.computerBoard[shot.index].positionOnBoard[i]].status;
            // hitAndSink = hitAndSink + this.playerBoard[this.playerBoard[shot].positionOnBoard[i]].status;
        }
        if(hitAndSink == this.computerBoard[shot.index].positionOnBoard.length){
          this.playerHitStatus = "TRAFIONY ZATOPIONY"
          this.shipsShotedByPlayer = this.shipsShotedByPlayer + 1;
          console.log('GRACZ' + this.shipsShotedByPlayer + '/' + this.shipsInBoard.length)
          
        }else{
          this.playerHitStatus = "TRAFIONY"
        }
        
      }else{
        
        this.computerBoard[shot.index].status = shipStatus.MISS;
          
          this.playerHitStatus = "PUDŁO"
          
      }
      
      // console.log(this.computerBoard[shot.index])
      if(this.shipsShotedByPlayer == this.shipsInBoard.length){
        alert(this.user = JSON.parse(localStorage.getItem("user")).displayName); 
          this.gameIsPending = false;
        
        
      }
      this.delay(500).then(any => {
          this.computerShot();
      });
        
    }
    // console.log(this.computerBoard[shot.index])
    
  }
  async delay(ms: number) {
    await new Promise(resolve => setTimeout(()=>resolve(), ms));
}
 
computerShot(){
  if(this.isShipShoted){
    if(this.isShipShotedPositionCount.length == 2){
      if(this.shotShipDirection == shipDirection.HORIZONTAL){
        this.shotShipDirection = shipDirection.VERTICAL
        this.isShipShotedPositionCount.push(1)
      }else{
        this.shotShipDirection = shipDirection.HORIZONTAL
        this.isShipShotedPositionCount.push(1)
      }
    }else if(this.isShipShotedPositionCount.length >20){
        // alert("Error"); 
        this.gameIsPending = false;
    }

    if(this.shotShipDirection == shipDirection.HORIZONTAL){
      console.log('shipDirection HORIZONTAL')
      
      if(this.shotShipPosition == 0){
        console.log('max ' + Math.max(...this.shotShipArray))
        console.log('min ' + Math.min(...this.shotShipArray))
        console.log('idz w lewo od pola ' + this.isShipShotedPosition)
        if(this.isShipShotedPosition%10 == 0){
          this.shotShipPosition = 1
          if(this.playerBoard[this.isShipShotedPosition+1].status == 0){
            console.log('pudlo1')
            this.isShipShotedPositionCount.push(1)
            this.isShipShotedPositionCount.push(1)
            this.isShipShotedPositionCount.push(1)
            console.log('tyle jest'+this.isShipShotedPositionCount)
            // this.isShipShotedPositionCount.push(1)
            this.shotShipDirection = shipDirection.VERTICAL
            console.log('this.computerShot3();')
            this.computerShot();
          }else{
            this.shotShipPosition = 1;
          this.isShipShotedPosition = Math.max(...this.shotShipArray)
          this.checkComputerShot((this.isShipShotedPosition+1))
          console.log('this.computerShot2();')
          }
          
          // this.computerShot();
        }else{
          if(this.playerBoard[this.isShipShotedPosition-1].status == 0){
            console.log('pudlo2')
            this.shotShipPosition = 1
            this.isShipShotedPosition = Math.max(...this.shotShipArray)  /////////////////////////////////////////////////////////////////////////////////////
            this.isShipShotedPositionCount.push(1)
            console.log('tyle jest'+this.isShipShotedPositionCount)
            console.log('this.computerShot();')
            this.computerShot();
            
          }else{
            this.checkComputerShot((this.isShipShotedPosition-1))
            if(this.playerBoard[this.isShipShotedPosition].status == 0){
              console.log('pudlo3')
              this.shotShipPosition = 1
              this.isShipShotedPosition = Math.max(...this.shotShipArray)
              this.isShipShotedPositionCount.push(1)
              console.log('tyle jest'+this.isShipShotedPositionCount)
          }
          }
          
        }
        

      }else{
        console.log('max ' + Math.max(...this.shotShipArray))
        console.log('min ' + Math.min(...this.shotShipArray))
        console.log('idz w prawo od pola ' + this.isShipShotedPosition)
        if(this.isShipShotedPosition%10 == 9){
          this.shotShipPosition = 0
          if(this.playerBoard[this.isShipShotedPosition-1].status == 0){
            console.log('pudlo4')
            this.isShipShotedPositionCount.push(1)
            this.isShipShotedPositionCount.push(1)
            this.isShipShotedPositionCount.push(1)
            console.log('tyle jest'+this.isShipShotedPositionCount)
            // this.isShipShotedPositionCount.push(1)
            this.shotShipDirection = shipDirection.VERTICAL
            console.log('this.computerShot3();')
            this.computerShot();
          }else{
            this.shotShipPosition = 0;
            this.isShipShotedPosition = Math.min(...this.shotShipArray)
            this.checkComputerShot((this.isShipShotedPosition-1))
            console.log('this.computerShot2();')
            // this.computerShot();
          }
        }else{
          if(this.playerBoard[this.isShipShotedPosition+1].status == 0){
            console.log('pudlo5')
            this.shotShipPosition = 0
            this.isShipShotedPosition = Math.min(...this.shotShipArray) ////////////////////////////////////////////////////////////////////
            this.isShipShotedPositionCount.push(1)
            console.log('tyle jest'+this.isShipShotedPositionCount)
            console.log('this.computerShot();')
            this.computerShot();
            
          }else{
            this.checkComputerShot((this.isShipShotedPosition+1))
            if(this.playerBoard[this.isShipShotedPosition].status == 0){
              console.log('pudlo6')
              this.shotShipPosition = 0
              this.isShipShotedPosition = Math.min(...this.shotShipArray)
              this.isShipShotedPositionCount.push(1)
              console.log('tyle jest'+this.isShipShotedPositionCount)
          }
          }
          
        }
      }
 
      

    }else if(this.shotShipDirection == shipDirection.VERTICAL){
      console.log('shipDirection VERTICAL')
      if(this.shotShipPosition == 0){
        console.log('max ' + Math.max(...this.shotShipArray))
        console.log('min ' + Math.min(...this.shotShipArray))
        console.log('idz w górę od pola ' + this.isShipShotedPosition)
        if(this.isShipShotedPosition-10 < 0){
          if(this.playerBoard[this.isShipShotedPosition+10].status == 0){
            console.log('pudlo7')
            this.isShipShotedPositionCount.push(1)
            this.isShipShotedPositionCount.push(1)
            this.isShipShotedPositionCount.push(1)
            console.log('tyle jest'+this.isShipShotedPositionCount)
            // this.isShipShotedPositionCount.push(1)
            this.shotShipDirection = shipDirection.HORIZONTAL
            console.log('this.computerShot3();')
            this.computerShot();
          }else{
            this.shotShipPosition = 1;
            this.isShipShotedPosition = Math.max(...this.shotShipArray)
            this.checkComputerShot((this.isShipShotedPosition+10))
            console.log('this.computerShot2();')
            // this.computerShot();
          }
        }else{
          if(this.playerBoard[this.isShipShotedPosition-10].status == 0){
            console.log('pudlo8')
            this.shotShipPosition = 1
            this.isShipShotedPosition = Math.max(...this.shotShipArray)  ///////////////////////////////////////////////
            this.isShipShotedPositionCount.push(1)
            console.log('tyle jest'+this.isShipShotedPositionCount)
            console.log('this.computerShot();')
            this.computerShot();
            
          }else{
            this.checkComputerShot((this.isShipShotedPosition-10))
            if(this.playerBoard[this.isShipShotedPosition].status == 0){
              this.shotShipPosition = 1
              this.isShipShotedPosition = Math.max(...this.shotShipArray)
              this.isShipShotedPositionCount.push(1)
              console.log('tyle jest'+this.isShipShotedPositionCount)
            }
          }
          
        }
        

      }else{
        console.log('max ' + Math.max(...this.shotShipArray))
        console.log('min ' + Math.min(...this.shotShipArray))
        console.log('idz w dół od pola ' + this.isShipShotedPosition)
        if(this.isShipShotedPosition+10 >100){
          if(this.playerBoard[this.isShipShotedPosition-10].status == 0){
            console.log('pudlo9')
            this.isShipShotedPositionCount.push(1)
            this.isShipShotedPositionCount.push(1)
            this.isShipShotedPositionCount.push(1)
            console.log('tyle jest'+this.isShipShotedPositionCount)
            // this.isShipShotedPositionCount.push(1)
            this.shotShipDirection = shipDirection.HORIZONTAL
            console.log('this.computerShot3();')
            this.computerShot();
          }else{
            
            this.shotShipPosition = 0;
            this.isShipShotedPosition = Math.min(...this.shotShipArray)
            this.checkComputerShot((this.isShipShotedPosition-10))
            console.log('this.computerShot2();')
            // this.computerShot();
          }
        }else{
          if(this.playerBoard[this.isShipShotedPosition+10].status == 0){
            console.log('pudlo10')
            this.shotShipPosition = 0
            this.isShipShotedPosition = Math.min(...this.shotShipArray)
            this.isShipShotedPositionCount.push(1)
            console.log('tyle jest'+this.isShipShotedPositionCount)
            console.log('this.computerShot();')
            this.computerShot();
            
          }else{
              this.checkComputerShot((this.isShipShotedPosition+10))
            if(this.playerBoard[this.isShipShotedPosition].status == 0){
              console.log('pudlo11')
              this.shotShipPosition = 0
              this.isShipShotedPosition = Math.min(...this.shotShipArray)
              this.isShipShotedPositionCount.push(1)
              console.log('tyle jest'+this.isShipShotedPositionCount)
            }
          }
          
        }
      }

    }else{
      console.log('shipDirection NOT SET')
      if(angularMath.getIntegerRandomRange(0, 1) == 0){
        this.shotShipDirection = shipDirection.HORIZONTAL;
        if(this.isShipShotedPosition%10 == 0){
          if(this.playerBoard[this.isShipShotedPosition+1].status == 0){
            console.log('pudlo12')
            // this.shotShipPosition = 0
            // this.isShipShotedPosition = Math.max(...this.shotShipArray)
            this.isShipShotedPositionCount.push(1)
            console.log('tyle jest'+this.isShipShotedPositionCount)
            console.log('this.computerShot();')
            this.computerShot();
            
          }else{
          this.checkComputerShot(this.isShipShotedPosition+1)
          this.shotShipPosition = 1;
          }
        }else if(this.isShipShotedPosition%10 == 9){
          if(this.playerBoard[this.isShipShotedPosition-1].status == 0){
            console.log('pudlo13')
            // this.shotShipPosition = 0
            // this.isShipShotedPosition = Math.max(...this.shotShipArray)
            this.isShipShotedPositionCount.push(1)
            console.log('tyle jest'+this.isShipShotedPositionCount)
            console.log('this.computerShot();')
            this.computerShot();
            
          }else{
            this.checkComputerShot((this.isShipShotedPosition-1))
            this.shotShipPosition = 0;  // prawo
          }
        }else{
          if(angularMath.getIntegerRandomRange(0, 1) == 0){
            this.shotShipPosition = 0
            if(this.playerBoard[this.isShipShotedPosition-1].status == 0){
              console.log('pudlo14')
              this.shotShipPosition = 1
              // this.isShipShotedPosition++
              this.isShipShotedPositionCount.push(1)
              console.log('tyle jest'+this.isShipShotedPositionCount)
              this.computerShot();
            }else{
              if(this.playerBoard[this.isShipShotedPosition-1].status == 0){
                console.log('pudlo15')
                this.shotShipPosition = 1
                // this.isShipShotedPosition = Math.max(...this.shotShipArray)
                this.isShipShotedPositionCount.push(1)
                console.log('tyle jest'+this.isShipShotedPositionCount)
                console.log('this.computerShot();')
                this.computerShot();
                
              }else{
                this.checkComputerShot(this.isShipShotedPosition-1)
                if(this.playerBoard[this.isShipShotedPosition].status == 0){
                  console.log('pudlo16')
                  this.shotShipPosition = 1
                  this.isShipShotedPosition++
                  this.isShipShotedPositionCount.push(1)
                  console.log('tyle jest'+this.isShipShotedPositionCount)
                }
              }
            }
            
            
          }else{
            this.shotShipPosition = 1
            if(this.playerBoard[this.isShipShotedPosition+1].status == 0){
              console.log('pudlo17')
              this.shotShipPosition = 0
              // this.isShipShotedPosition--
              this.isShipShotedPositionCount.push(1)
              console.log('tyle jest'+this.isShipShotedPositionCount)
              this.computerShot();
            }else{
              if(this.playerBoard[this.isShipShotedPosition+1].status == 0){
                console.log('pudlo18')
                // this.shotShipPosition = 0
                // this.isShipShotedPosition = Math.max(...this.shotShipArray)
                this.isShipShotedPositionCount.push(1)
                console.log('tyle jest'+this.isShipShotedPositionCount)
                console.log('this.computerShot();')
                this.computerShot();
                
              }else{
                this.checkComputerShot(this.isShipShotedPosition+1)
                if(this.playerBoard[this.isShipShotedPosition].status == 0){
                  console.log('pudlo19')
                  this.shotShipPosition = 0
                  this.isShipShotedPosition--
                  this.isShipShotedPositionCount.push(1)
                  console.log('tyle jest'+this.isShipShotedPositionCount)
                }
              }
            }
            
          }
        }
      }else{
        console.log("VERTICAL")
        this.shotShipDirection = shipDirection.VERTICAL;
        if(this.isShipShotedPosition-10 < 0){
          if(this.playerBoard[this.isShipShotedPosition+10].status == 0){
            console.log('pudlo20')
            // this.shotShipPosition = 0
            // this.isShipShotedPosition = Math.max(...this.shotShipArray)
            this.isShipShotedPositionCount.push(1)
            console.log('tyle jest'+this.isShipShotedPositionCount)
            console.log('this.computerShot();')
            this.computerShot();
            
          }else{
            this.checkComputerShot(this.isShipShotedPosition+10)
            this.shotShipPosition = 1;
          }
        }else if(this.isShipShotedPosition+10 > 100){
          if(this.playerBoard[this.isShipShotedPosition-10].status == 0){
            console.log('pudlo21')
            // this.shotShipPosition = 0
            // this.isShipShotedPosition = Math.max(...this.shotShipArray)
            this.isShipShotedPositionCount.push(1)
            console.log('tyle jest'+this.isShipShotedPositionCount)
            console.log('this.computerShot();')
            this.computerShot();
            
          }else{
            this.checkComputerShot((this.isShipShotedPosition-10))
            this.shotShipPosition = 0;  // prawo
          }
        }else{
          if(angularMath.getIntegerRandomRange(0, 1) == 0){
            this.shotShipPosition = 0
            if(this.playerBoard[this.isShipShotedPosition-10].status == 0){
              console.log('pudlo22')
              this.shotShipPosition = 1
              // this.isShipShotedPosition = this.isShipShotedPosition + 10
              this.isShipShotedPositionCount.push(1)
              console.log('tyle jest'+this.isShipShotedPositionCount)
              this.computerShot();
            }else{
              if(this.playerBoard[this.isShipShotedPosition-10].status == 0){
                console.log('pudlo23')
                this.shotShipPosition = 1
                // this.isShipShotedPosition = Math.max(...this.shotShipArray)
                this.isShipShotedPositionCount.push(1)
                console.log('tyle jest'+this.isShipShotedPositionCount)
                console.log('this.computerShot();')
                this.computerShot();
                
              }else{
                this.checkComputerShot(this.isShipShotedPosition-10)
                if(this.playerBoard[this.isShipShotedPosition].status == 0){
                  console.log('pudlo24')
                  this.shotShipPosition = 1
                  this.isShipShotedPosition = this.isShipShotedPosition + 10
                  this.isShipShotedPositionCount.push(1)
                  console.log('tyle jest'+this.isShipShotedPositionCount)
                }
              }
            }
            
            
          }else{
            this.shotShipPosition = 1
            if(this.playerBoard[this.isShipShotedPosition+10].status == 0){
              console.log('pudlo25')
              this.shotShipPosition = 0
              // this.isShipShotedPosition = this.isShipShotedPosition - 10
              this.isShipShotedPositionCount.push(1)
              console.log('tyle jest'+this.isShipShotedPositionCount)
              this.computerShot();
            }
            if(this.playerBoard[this.isShipShotedPosition+10].status == 0){
              console.log('pudlo26')
              this.shotShipPosition = 0
              // this.isShipShotedPosition = Math.max(...this.shotShipArray)
              this.isShipShotedPositionCount.push(1)
              console.log('tyle jest'+this.isShipShotedPositionCount)
              console.log('this.computerShot();')
              this.computerShot();
              
            }else{
              this.checkComputerShot(this.isShipShotedPosition+10)
              if(this.playerBoard[this.isShipShotedPosition].status == 0){
                console.log('pudlo27                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              ')
                this.shotShipPosition = 0
                this.isShipShotedPosition = this.isShipShotedPosition - 10
                this.isShipShotedPositionCount.push(1)
                console.log('tyle jest'+this.isShipShotedPositionCount)
              }
            }
          }
        }
      }
    }

  }else{
    var shot = this.getRandomNumber();
    if(this.playerBoard[shot].status == 2){
      this.checkComputerShot(shot);
      
    }else{
      console.log('Trzeba powtorzyc')
      this.computerShot();
    }
    
  }

}
checkComputerShot(shot){
  console.log('strzał: '+shot)
  var hitAndSink = 0;
    if(this.playerBoard[shot].status === shipStatus.NO_ACTION){
      if(this.playerBoard[shot].isShip){
        console.log('Dlugosc ' + this.playerBoard[shot].positionOnBoard.length)
        console.log('this.playerBoard')
        console.log(this.playerBoard)
        this.playerBoard[shot].status = shipStatus.HIT;
        // this.playerBoard[shot].positionOnBoard.push(shot)
        if(this.playerBoard[shot].positionOnBoard.length == 1){
          // this.playerBoard[shot].status = shipStatus.HIT;
          this.computerHitStatus = "TRAFIONY ZATOPIONY"
          this.shipsShotedByComputer = this.shipsShotedByComputer + 1;
          console.log('BOT: ' + this.shipsShotedByComputer + '/' + this.shipsInBoard.length)
          this.isShipShoted = false;
        }else{
          for(var i = 0; i<this.playerBoard[shot].positionOnBoard.length; i++){
            console.log(this.playerBoard[shot].positionOnBoard.length)
            console.log(this.playerBoard[shot].positionOnBoard[i][i])
            console.log(this.playerBoard[this.playerBoard[shot].positionOnBoard[i][i]].status)
            if(this.playerBoard[this.playerBoard[shot].positionOnBoard[i][i]].status == 1){
              hitAndSink = hitAndSink + 1;
            }
          }
          console.log('hitAndSink ' + hitAndSink)
          if(hitAndSink == this.playerBoard[shot].positionOnBoard.length){
            this.computerHitStatus = "TRAFIONY ZATOPIONY"
            this.shipsShotedByComputer = this.shipsShotedByComputer + 1;
            console.log('BOT: ' + this.shipsShotedByComputer + '/' + this.shipsInBoard.length)
            this.isShipShoted = false;
            this.isShipShotedPositionCount = [];
            console.log('tyle jest'+this.isShipShotedPositionCount)
            this.shotShipArray = [];
            this.shotShipDirection = shipDirection.NOT_SET
          }else{
            this.computerHitStatus = "TRAFIONY"
            this.isShipShoted = true;
            this.isShipShotedPosition = shot;
            this.shotShipArray.push(this.isShipShotedPosition)
            // if(this.shotShipArray.length == 2){
            //   if(this.shotShipDirection == shipDirection.HORIZONTAL){
            //     this.shotShipDirection = shipDirection.VERTICAL
        
            //   }else{
            //     this.shotShipDirection = shipDirection.HORIZONTAL
        
            //   }
            // }
          }
          // this.playerBoard[shot].status = shipStatus.HIT;
          // this.playerBoard[shot].positionOnBoard.push(shot)
          
        }
      }else{
        this.playerBoard[shot].status = shipStatus.MISS;
        this.computerHitStatus = "PUDŁO"
        // this.isShipShotedPosition = shot;
      }

    }

    if(this.shipsShotedByComputer == this.shipsInBoard.length){
      this.delay(500).then(any => {
        alert("BOT wygrał"); 
      this.gameIsPending = false;
    });
      
      
      
    }
  }

  checkComputerShot1(shot){
    var hitAndSink = 0;
    if(this.playerBoard[shot].status === shipStatus.NO_ACTION){
      if(this.playerBoard[shot].isShip){
        this.playerBoard[shot].status = shipStatus.HIT;
        console.log('Dlugosc ' + this.playerBoard[shot].positionOnBoard.length)
        for(let i = 0; i<this.playerBoard[shot].positionOnBoard.length; i++){
          // console.log('tuTaj ' + this.playerBoard[shot].positionOnBoard.length + ': ' + this.playerBoard[shot].positionOnBoard)
          // console.log('1: ' + this.playerBoard[shot].positionOnBoard[i]+' koniec')
          // console.log('2: ' + this.playerBoard[shot].status)
          console.log('status value: ' + this.playerBoard[shot].status)
          hitAndSink = hitAndSink + this.playerBoard[shot].status;
          console.log(i + ' przejscie ' + hitAndSink)
        }
        if(hitAndSink == this.playerBoard[shot].positionOnBoard.length){
          this.computerHitStatus = "TRAFIONY ZATOPIONY"
          this.shipsShotedByComputer = this.shipsShotedByComputer + 1;

          console.log('BOT: ' + this.shipsShotedByComputer + '/' + this.shipsInBoard.length)
          this.isShipShoted = false;
          console.log(' ')
          
        }else{
          this.computerHitStatus = "TRAFIONY"
          // this.shotShipArray.push(shot)
          console.log(this.shotShipArray)
          this.isShipShoted = true;
          console.log(' ')
        }
      }else{
        this.playerBoard[shot].status = shipStatus.MISS;
        this.computerHitStatus = "PUDŁO"
        console.log(' ')
      }
      if(this.shipsShotedByComputer == this.shipsInBoard.length){
        alert("BOT wygrał"); 
          this.gameIsPending = false;
        
        
      }
    }else{
      this.computerShot2();
    }
  }

  computerShot2(){
    var shot = this.getRandomNumber();
    this.checkComputerShot1(shot);

    
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
