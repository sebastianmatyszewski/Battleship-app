import { Router } from '@angular/router';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  private user: any;
  public isLoggedIn: any;

  constructor(
              private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.authService.getEmitter().subscribe((isLogged) => { 
      if(localStorage.getItem('user')!== null){
        this.isLoggedIn = true;
        this.user = JSON.parse(localStorage.getItem("user"));
      }
      else{
        this.isLoggedIn = false;
      }
    }); 
    if(localStorage.getItem('user')!== null){
      this.isLoggedIn = true;
      this.user = JSON.parse(localStorage.getItem("user"));
    }
    else{
      this.isLoggedIn = false;
    }
  }
    private ngOnChanges() {
      this.authService.getEmitter().subscribe((isLogged) => { 
        if(localStorage.getItem('user')!== null){
          this.isLoggedIn = true;
          this.user = JSON.parse(localStorage.getItem("user"));
        }
        else{
          this.isLoggedIn = false;
        }
      }); 
  }

  private logout(){
    this.authService.logout();
  }

}
