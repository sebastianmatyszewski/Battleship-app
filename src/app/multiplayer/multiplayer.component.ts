import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-multiplayer',
  templateUrl: './multiplayer.component.html',
  styleUrls: ['./multiplayer.component.css']
})
export class MultiplayerComponent implements OnInit {

  constructor() { }
  gameStarted = false;
  ngOnInit(): void {
  }

  startgame(){
    this.gameStarted = true
  }

}
