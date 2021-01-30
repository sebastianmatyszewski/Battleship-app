import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private user: any;
  private auth: any;
  public isLoggedIn: Boolean = false;

  constructor(private authService: AuthService,
              private router: Router) {
                this.auth = authService;
               }

  ngOnInit(): void {
    console.log('Odpalam home')
    if(localStorage.getItem('user')!== null){
      this.isLoggedIn = true;
      this.user = JSON.parse(localStorage.getItem("user"));
      console.log(this.user)
    }
    
    else{
      this.isLoggedIn = false;
    }

  }

  private login(){
    this.router.navigate(['/login']);
  }
  private register(){
    this.router.navigate(['/register']);
  }
  private singleplayer(){
    this.router.navigate(['/singleplayer']);
  }
  private multiplayer(){
    this.router.navigate(['/multiplayer']);
  }

}
