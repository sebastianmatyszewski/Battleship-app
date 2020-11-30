export interface shipArrayInterface{
    index: number;
    shipIndex: number;
    isShip: boolean;
    isBlock: boolean;
    status: shipStatus;
    tooltip: String;
    positionOnBoard: Array<number>;
    
}
export enum shipDirection {
    NOT_SET,
    HORIZONTAL,
    VERTICAL
  }
export enum shipStatus {
    MISS,
    HIT,
    NO_ACTION
  }