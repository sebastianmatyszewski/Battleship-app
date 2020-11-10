export interface shipArrayInterface{
    index: number;
    shipIndex: number;
    isShip: boolean;
    isBlock: boolean;
    status: shipStatus;
    positionOnBoard: Array<number>;
    
}

export enum shipStatus {
    HIT,
    MISS,
    NO_ACTION
  }