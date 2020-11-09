import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  user: any;
  auth: any;
  isLoggedIn = false;

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
    
    // this.auth.isLoading=true;
    // this.authService.getUserState().then(

    //   this.user = this.authService.user,
      
    // // console.log(this.user)
    // // console.log(this.auth.user),
    // )
      // .subscribe(user =>{
    
    
      // })
  }

  klik(){
    // this.user = this.authService.user;
    // console.log(this.user)
    // console.log(this.authService.user)
  }


  login(){
    this.router.navigate(['/login']);
  }
  register(){
    this.router.navigate(['/register']);
  }
  singleplayer(){
    this.router.navigate(['/singleplayer']);
  }
  multiplayer(){
    this.router.navigate(['/multiplayer']);
  }
  logout(){
    this.authService.logout();
  }

}
