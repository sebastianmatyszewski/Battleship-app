import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { shipArrayInterface, shipStatus, shipDirection } from '../shipArrayInterface';
import { angularMath } from 'angular-ts-math';
import {
  CdkDragDrop,
  CdkDragEnd,
  CdkDragMove,
  CdkDragStart,
  moveItemInArray,
  transferArrayItem
} from "@angular/cdk/drag-drop";
import { Router } from '@angular/router';

@Component({
  selector: 'app-singleplayer',
  templateUrl: './singleplayer.component.html',
  styleUrls: ['./singleplayer.component.css']
})
export class SingleplayerComponent implements OnInit {
  private user
  private isLoggedIn = false;
  constructor(private auth: AuthService, private router: Router) { }
  @ViewChild('cdkBoard', { read: ElementRef, static: false }) private boardElement
  public index: number;
  public shipPartId: any;
  public shipId: any;
  public playerBoard: shipArrayInterface[] = [];
  public computerBoard: shipArrayInterface[] = [];
  private playerHitStatus: String;
  private computerHitStatus: String;
  private shipsShotedByPlayer: number = 0;
  private shipsShotedByComputer: number = 0;
  public gameIsPending: Boolean = false;
  private shotShipDirection = shipDirection.NOT_SET;
  private shotShipPosition: number;
  private shotShipArray: number[] = new Array();
  private isShipShoted: Boolean = false;
  private isShipShotedPosition: number;
  private isShipShotedPositionCount: number[] = new Array();
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
  private shipOrientation = "horizontally";

  private array(n: number): number[] {
    return Array(n);
  }
  private changeOrientation() {
    if (this.shipOrientation === 'horizontally') {
      this.shipOrientation = 'vertically'
      for (let i = 0; i < this.ships.length; i++) {
        this.ships[i].orientation = 'vertically'
      }
    } else {
      this.shipOrientation = 'horizontally'
      for (let i = 0; i < this.ships.length; i++) {
        this.ships[i].orientation = 'horizontally'
      }
    }
  }

  private allShipPlaced = false;

  public shipsInBoard: any[] = [];
  private position: any
  private shipPositionOnArray: any
  
  private drop(event: CdkDragDrop<string[]>) {
    for (let i = 0; i < this.ships.length; i++) {
      if (this.ships[i].id == this.shipId) {
        this.ships[i].disabled = true;
      }
    }

    for (let i = 0; i < this.ships.length; i++) {
      if (this.ships[i].id == this.shipId) {
        if (this.ships[i].orientation === 'horizontally') {
          event.previousContainer.data[event.previousIndex]['top'] = this.position ? this.position.y - this.boardElement.nativeElement.getBoundingClientRect().y : 0
          event.previousContainer.data[event.previousIndex]['left'] = this.position ? this.position.x - this.boardElement.nativeElement.getBoundingClientRect().x - (this.shipPartId * 40) - (this.shipPartId * 2) : 0
        } else {
          event.previousContainer.data[event.previousIndex]['top'] = this.position ? this.position.y - this.boardElement.nativeElement.getBoundingClientRect().y - (this.shipPartId * 40) - (this.shipPartId * 2) : 0
          event.previousContainer.data[event.previousIndex]['left'] = this.position ? this.position.x - this.boardElement.nativeElement.getBoundingClientRect().x : 0
        }
      }

    }
    for (let i = 0; i < this.shipsInBoard.length; i++) {
      if (this.shipsInBoard[i].id == this.shipId) {
        if (this.shipsInBoard[i].orientation === 'horizontally') {
          event.previousContainer.data[event.previousIndex]['top'] = this.position ? this.position.y - this.boardElement.nativeElement.getBoundingClientRect().y : 200
          event.previousContainer.data[event.previousIndex]['left'] = this.position ? this.position.x - this.boardElement.nativeElement.getBoundingClientRect().x - (this.shipPartId * 40) - (this.shipPartId * 2) : 200
        } else if (this.shipsInBoard[i].orientation === 'vertically') {
          event.previousContainer.data[event.previousIndex]['top'] = this.position ? this.position.y - this.boardElement.nativeElement.getBoundingClientRect().y - (this.shipPartId * 40) - (this.shipPartId * 2) : 0
          event.previousContainer.data[event.previousIndex]['left'] = this.position ? this.position.x - this.boardElement.nativeElement.getBoundingClientRect().x : 0
        }
      }
    }
    if (event.previousContainer === event.container) {
      for (let i = 0; i < this.shipsInBoard.length; i++) {
        if (this.shipsInBoard[i].id == this.shipId) {
          if (this.shipsInBoard[i].mastCount == 1) {
            this.shipsInBoard[i].positionOnArray[0] = this.shipPositionOnArray;
          } else {
            if (this.shipsInBoard[i].orientation == 'horizontally') {
              var idShipZero = this.shipPositionOnArray - (this.shipPartId)
              for (let j = 0; j < this.shipsInBoard[i].mastCount; j++) {
                this.shipsInBoard[i].positionOnArray[j] = idShipZero + j;
              }
            } else {
              var idShipZero = this.shipPositionOnArray - (this.shipPartId * 10)
              for (let j = 0; j < this.shipsInBoard[i].mastCount; j++) {
                this.shipsInBoard[i].positionOnArray[j] = idShipZero + (j * 10);
              }
            }
          }
        }
      }
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      for (let i = 0; i < this.ships.length; i++) {
        if (this.ships[i].id == this.shipId) {
          if (this.ships[i].mastCount == 1) {
            this.ships[i].positionOnArray[0] = this.shipPositionOnArray;


          }
          else {
            if (this.ships[i].orientation == 'horizontally') {
              var idShipZero = this.shipPositionOnArray - (this.shipPartId)
              for (let j = 0; j < this.ships[i].mastCount; j++) {
                this.ships[i].positionOnArray[j] = idShipZero + j;
              }
            } else {
              var idShipZero = this.shipPositionOnArray - (this.shipPartId * 10)
              for (let j = 0; j < this.ships[i].mastCount; j++) {
                this.ships[i].positionOnArray[j] = idShipZero + (j * 10);
              }
            }
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
    if (this.ships.length == 0) {
      this.allShipPlaced = true;
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



    } else {
      this.allShipPlaced = false;
    }
  }

  private drawBotShips() {
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
    this.generateBotShip(this.shipsInBoard[0]);
    this.generateBotShip(this.shipsInBoard[1]);
    this.generateBotShip(this.shipsInBoard[2]);
    this.generateBotShip(this.shipsInBoard[3]);
    this.generateBotShip(this.shipsInBoard[4]);
    this.generateBotShip(this.shipsInBoard[5]);
    this.generateBotShip(this.shipsInBoard[6]);
    this.generateBotShip(this.shipsInBoard[7]);

  }

  private startGame() {
    for (let i = 0; i < this.shipsInBoard.length; i++) {
      for (let j = 0; j < this.shipsInBoard[i].mastCount; j++) {
        for (let k = 0; k < this.shipsInBoard[i].positionOnArray.length; k++) {
          this.playerBoard[this.shipsInBoard[i].positionOnArray[k]].isShip = true;
          this.playerBoard[this.shipsInBoard[i].positionOnArray[k]].isBlock = true;
          this.playerBoard[this.shipsInBoard[i].positionOnArray[k]].shipIndex = this.shipsInBoard[i].positionOnArray[k];
          this.playerBoard[this.shipsInBoard[i].positionOnArray[k]].positionOnBoard.push(this.shipsInBoard[i].positionOnArray)
        }
      }
    }
    this.drawBotShips();
    for (let k = 0; k < this.computerBoard.length; k++) {
      if (this.computerBoard[k].isShip == true) {
        for (let i = 0; i < this.computerBoard.length; i++) {
          if (this.computerBoard[k].shipIndex == this.computerBoard[i].shipIndex) {
            this.computerBoard[k].positionOnBoard.push(this.computerBoard[i].index);
          }
        }
      }
    }
    this.gameIsPending = true;
  }
  private generateBotShip(ship) {
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
      if ((this.computerBoard[randomPosition + (i * direction)].isShip)
        || (this.computerBoard[randomPosition + (i * direction)].isBlock)
        || (randomPosition + (i * direction) - 1 == 99)
        || ((randomPosition + (i * direction)) % 10 == 9)) {
        fieldUsed = true;
        break;
      }
    }
    if (!fieldUsed) {
      for (let i = 0; i < ship.mastCount; i++) {
        this.computerBoard[randomPosition + (i * direction)].isShip = true;
        this.computerBoard[randomPosition + (i * direction)].shipIndex = ship.id;
        this.computerBoard[randomPosition + (i * direction)].isBlock = true;
        var surrounding = [-9, -10, -11, -1, 1, 9, 10, 11];
        for (let j = 0; j < surrounding.length; j++) {
          if (((randomPosition + (i * direction) + surrounding[j]) >= 0)
            && ((randomPosition + (i * direction) + surrounding[j]) <= 99)) {
            this.computerBoard[randomPosition + (i * direction) + surrounding[j]].isBlock = true;
          }
        }
      }
    } else {
      this.generateBotShip(ship);
    }
  }

  private playerShot(shot) {
    if (this.gameIsPending) {
      if (this.computerBoard[shot.index].status == 2) {
        if (shot.isShip === true) {
          this.computerBoard[shot.index].status = shipStatus.HIT;
          var hitAndSink = 0;
          for (let i = 0; i < this.computerBoard[shot.index].positionOnBoard.length; i++) {
            hitAndSink = hitAndSink + this.computerBoard[this.computerBoard[shot.index].positionOnBoard[i]].status;
          }
          if (hitAndSink == this.computerBoard[shot.index].positionOnBoard.length) {
            this.playerHitStatus = "TRAFIONY ZATOPIONY"
            this.shipsShotedByPlayer = this.shipsShotedByPlayer + 1;
          } else {
            this.playerHitStatus = "TRAFIONY"
          }
        } else {
          this.computerBoard[shot.index].status = shipStatus.MISS;
          this.playerHitStatus = "PUDŁO"
        }
        if (this.shipsShotedByPlayer == this.shipsInBoard.length) {
          alert(JSON.parse(localStorage.getItem("user")).displayName + ", Udało Ci się pokonać Pirata Stefana!");
          this.resetGame();
        }
        this.delay(500).then(any => {
          this.computerShot();
        });
      }
    } 
  }
  async delay(ms: number) {
    await new Promise<void>(resolve => setTimeout(() => resolve(), ms));
  }

  private computerShot() {
    if (this.isShipShoted) {
      if (this.isShipShotedPositionCount.length == 2) {
        if (this.shotShipDirection == shipDirection.HORIZONTAL) {
          this.shotShipDirection = shipDirection.VERTICAL
          this.isShipShotedPositionCount.push(1)
        } else {
          this.shotShipDirection = shipDirection.HORIZONTAL
          this.isShipShotedPositionCount.push(1)
        }
      } else if (this.isShipShotedPositionCount.length > 20) {
        this.gameIsPending = false;
      }

      if (this.shotShipDirection == shipDirection.HORIZONTAL) {
        if (this.shotShipPosition == 0) {
          if (this.isShipShotedPosition % 10 == 0) {
            this.shotShipPosition = 1
            if (this.playerBoard[this.isShipShotedPosition + 1].status == 0) {
              this.isShipShotedPositionCount.push(1)
              this.isShipShotedPositionCount.push(1)
              this.isShipShotedPositionCount.push(1)
              this.shotShipDirection = shipDirection.VERTICAL
              this.computerShot();
            } else {
              this.shotShipPosition = 1;
              this.isShipShotedPosition = Math.max(...this.shotShipArray)
              this.checkComputerShot((this.isShipShotedPosition + 1))
            }
          } else {
            if (this.playerBoard[this.isShipShotedPosition - 1].status == 0) {
              this.shotShipPosition = 1
              this.isShipShotedPosition = Math.max(...this.shotShipArray)
              this.isShipShotedPositionCount.push(1)
              this.computerShot();

            } else {
              this.checkComputerShot((this.isShipShotedPosition - 1))
              if (this.playerBoard[this.isShipShotedPosition].status == 0) {
                this.shotShipPosition = 1
                this.isShipShotedPosition = Math.max(...this.shotShipArray)
                this.isShipShotedPositionCount.push(1)
              }
            }
          }
        } else {
          if (this.isShipShotedPosition % 10 == 9) {
            this.shotShipPosition = 0
            if (this.playerBoard[this.isShipShotedPosition - 1].status == 0) {
              this.isShipShotedPositionCount.push(1)
              this.isShipShotedPositionCount.push(1)
              this.isShipShotedPositionCount.push(1)
              this.shotShipDirection = shipDirection.VERTICAL
              this.computerShot();
            } else {
              this.shotShipPosition = 0;
              this.isShipShotedPosition = Math.min(...this.shotShipArray)
              this.checkComputerShot((this.isShipShotedPosition - 1));
            }
          } else {
            if (this.playerBoard[this.isShipShotedPosition + 1].status == 0) {
              this.shotShipPosition = 0
              this.isShipShotedPosition = Math.min(...this.shotShipArray)
              this.isShipShotedPositionCount.push(1)
              this.computerShot();

            } else {
              this.checkComputerShot((this.isShipShotedPosition + 1))
              if (this.playerBoard[this.isShipShotedPosition].status == 0) {
                this.shotShipPosition = 0
                this.isShipShotedPosition = Math.min(...this.shotShipArray)
                this.isShipShotedPositionCount.push(1)
              }
            }
          }
        }
      } else if (this.shotShipDirection == shipDirection.VERTICAL) {
        if (this.shotShipPosition == 0) {
          if (this.isShipShotedPosition - 10 < 0) {
            if (this.playerBoard[this.isShipShotedPosition + 10].status == 0) {
              this.isShipShotedPositionCount.push(1)
              this.isShipShotedPositionCount.push(1)
              this.isShipShotedPositionCount.push(1)
              this.shotShipDirection = shipDirection.HORIZONTAL
              this.computerShot();
            } else {
              this.shotShipPosition = 1;
              this.isShipShotedPosition = Math.max(...this.shotShipArray)
              this.checkComputerShot((this.isShipShotedPosition + 10))
            }
          } else {
            if (this.playerBoard[this.isShipShotedPosition - 10].status == 0) {
              this.shotShipPosition = 1
              this.isShipShotedPosition = Math.max(...this.shotShipArray) 
              this.isShipShotedPositionCount.push(1)
              this.computerShot();

            } else {
              this.checkComputerShot((this.isShipShotedPosition - 10))
              if (this.playerBoard[this.isShipShotedPosition].status == 0) {
                this.shotShipPosition = 1
                this.isShipShotedPosition = Math.max(...this.shotShipArray)
                this.isShipShotedPositionCount.push(1)
              }
            }
          }
        } else {
          if (this.isShipShotedPosition + 10 > 100) {
            if (this.playerBoard[this.isShipShotedPosition - 10].status == 0) {
              this.isShipShotedPositionCount.push(1)
              this.isShipShotedPositionCount.push(1)
              this.isShipShotedPositionCount.push(1)
              this.shotShipDirection = shipDirection.HORIZONTAL
              this.computerShot();
            } else {
              this.shotShipPosition = 0;
              this.isShipShotedPosition = Math.min(...this.shotShipArray)
              this.checkComputerShot((this.isShipShotedPosition - 10))
            }
          } else {
            if (this.playerBoard[this.isShipShotedPosition + 10].status == 0) {
              this.shotShipPosition = 0
              this.isShipShotedPosition = Math.min(...this.shotShipArray)
              this.isShipShotedPositionCount.push(1)
              this.computerShot();

            } else {
              this.checkComputerShot((this.isShipShotedPosition + 10))
              if (this.playerBoard[this.isShipShotedPosition].status == 0) {
                this.shotShipPosition = 0
                this.isShipShotedPosition = Math.min(...this.shotShipArray)
                this.isShipShotedPositionCount.push(1)
              }
            }

          }
        }

      } else {
        if (angularMath.getIntegerRandomRange(0, 1) == 0) {
          this.shotShipDirection = shipDirection.HORIZONTAL;
          if (this.isShipShotedPosition % 10 == 0) {
            if (this.playerBoard[this.isShipShotedPosition + 1].status == 0) {
              this.isShipShotedPositionCount.push(1)
              this.computerShot();
            } else {
              this.checkComputerShot(this.isShipShotedPosition + 1)
              this.shotShipPosition = 1;
            }
          } else if (this.isShipShotedPosition % 10 == 9) {
            if (this.playerBoard[this.isShipShotedPosition - 1].status == 0) {
              this.isShipShotedPositionCount.push(1)
              this.computerShot();
            } else {
              this.checkComputerShot((this.isShipShotedPosition - 1))
              this.shotShipPosition = 0;
            }
          } else {
            if (angularMath.getIntegerRandomRange(0, 1) == 0) {
              this.shotShipPosition = 0
              if (this.playerBoard[this.isShipShotedPosition - 1].status == 0) {
                this.shotShipPosition = 1
                this.isShipShotedPositionCount.push(1)
                this.computerShot();
              } else {
                if (this.playerBoard[this.isShipShotedPosition - 1].status == 0) {
                  this.shotShipPosition = 1
                  this.isShipShotedPositionCount.push(1)
                  this.computerShot();
                } else {
                  this.checkComputerShot(this.isShipShotedPosition - 1)
                  if (this.playerBoard[this.isShipShotedPosition].status == 0) {
                    this.shotShipPosition = 1
                    this.isShipShotedPosition++
                    this.isShipShotedPositionCount.push(1)
                  }
                }
              }
            } else {
              this.shotShipPosition = 1
              if (this.playerBoard[this.isShipShotedPosition + 1].status == 0) {
                this.shotShipPosition = 0
                this.isShipShotedPositionCount.push(1)
                this.computerShot();
              } else {
                if (this.playerBoard[this.isShipShotedPosition + 1].status == 0) {
                  this.isShipShotedPositionCount.push(1)
                  this.computerShot();
                } else {
                  this.checkComputerShot(this.isShipShotedPosition + 1)
                  if (this.playerBoard[this.isShipShotedPosition].status == 0) {
                    this.shotShipPosition = 0
                    this.isShipShotedPosition--
                    this.isShipShotedPositionCount.push(1)
                  }
                }
              }
            }
          }
        } else {
          this.shotShipDirection = shipDirection.VERTICAL;
          if (this.isShipShotedPosition - 10 < 0) {
            if (this.playerBoard[this.isShipShotedPosition + 10].status == 0) {
              this.isShipShotedPositionCount.push(1)
              this.computerShot();

            } else {
              this.checkComputerShot(this.isShipShotedPosition + 10)
              this.shotShipPosition = 1;
            }
          } else if (this.isShipShotedPosition + 10 > 100) {
            if (this.playerBoard[this.isShipShotedPosition - 10].status == 0) {
              this.isShipShotedPositionCount.push(1)
              this.computerShot();
            } else {
              this.checkComputerShot((this.isShipShotedPosition - 10))
              this.shotShipPosition = 0;
            }
          } else {
            if (angularMath.getIntegerRandomRange(0, 1) == 0) {
              this.shotShipPosition = 0
              if (this.playerBoard[this.isShipShotedPosition - 10].status == 0) {
                this.shotShipPosition = 1
                this.isShipShotedPositionCount.push(1)
                this.computerShot();
              } else {
                if (this.playerBoard[this.isShipShotedPosition - 10].status == 0) {
                  this.shotShipPosition = 1
                  this.isShipShotedPositionCount.push(1)
                  this.computerShot();
                } else {
                  this.checkComputerShot(this.isShipShotedPosition - 10)
                  if (this.playerBoard[this.isShipShotedPosition].status == 0) {
                    this.shotShipPosition = 1
                    this.isShipShotedPosition = this.isShipShotedPosition + 10
                    this.isShipShotedPositionCount.push(1)
                  }
                }
              }
            } else {
              this.shotShipPosition = 1
              if (this.playerBoard[this.isShipShotedPosition + 10].status == 0) {
                this.shotShipPosition = 0
                this.isShipShotedPositionCount.push(1)
                this.computerShot();
              }
              if (this.playerBoard[this.isShipShotedPosition + 10].status == 0) {
                this.shotShipPosition = 0
                this.isShipShotedPositionCount.push(1)
                this.computerShot();

              } else {
                this.checkComputerShot(this.isShipShotedPosition + 10)
                if (this.playerBoard[this.isShipShotedPosition].status == 0) {
                  this.shotShipPosition = 0
                  this.isShipShotedPosition = this.isShipShotedPosition - 10
                  this.isShipShotedPositionCount.push(1)
                }
              }
            }
          }
        }
      }
    } else {
      var shot = this.getRandomNumber();
      if (this.playerBoard[shot].status == 2) {
        this.checkComputerShot(shot);
      } else {
        this.computerShot();
      }
    }
  }
  private checkComputerShot(shot) {
    var hitAndSink = 0;
    if (this.playerBoard[shot].status === shipStatus.NO_ACTION) {
      if (this.playerBoard[shot].isShip) {
        this.playerBoard[shot].status = shipStatus.HIT;
        if (this.playerBoard[shot].positionOnBoard.length == 1) {
          this.computerHitStatus = "TRAFIONY ZATOPIONY"
          this.shipsShotedByComputer = this.shipsShotedByComputer + 1;
          this.isShipShoted = false;
        } else {
          for (var i = 0; i < this.playerBoard[shot].positionOnBoard.length; i++) {
            if (this.playerBoard[this.playerBoard[shot].positionOnBoard[i][i]].status == 1) {
              hitAndSink = hitAndSink + 1;
            }
          }
          if (hitAndSink == this.playerBoard[shot].positionOnBoard.length) {
            this.computerHitStatus = "TRAFIONY ZATOPIONY"
            this.shipsShotedByComputer = this.shipsShotedByComputer + 1;
            this.isShipShoted = false;
            this.isShipShotedPositionCount = [];
            this.shotShipArray = [];
            this.shotShipDirection = shipDirection.NOT_SET
          } else {
            this.computerHitStatus = "TRAFIONY"
            this.isShipShoted = true;
            this.isShipShotedPosition = shot;
            this.shotShipArray.push(this.isShipShotedPosition)
          }
        }
      } else {
        this.playerBoard[shot].status = shipStatus.MISS;
        this.computerHitStatus = "PUDŁO"
      }

    }

    if (this.shipsShotedByComputer == this.shipsInBoard.length) {
      this.delay(500).then(any => {
        alert("BOT zwyciężył, zagraj jeszcze raz!");
        this.gameIsPending = false;
        this.resetGame();

      });
    }
  }

  private getRandomNumber(): number {
    return angularMath.getIntegerRandomRange(0, 99);
  }
  private resetGame() {
    window.location.reload();
  }

  ngOnInit(): void {
    if (localStorage.getItem('user') !== null) {
      this.isLoggedIn = true;
      this.user = JSON.parse(localStorage.getItem("user"));
    }
    else {
      this.isLoggedIn = false;
    }
  }
}
