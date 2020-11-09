import { Router } from '@angular/router';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  user: any;
  isLoggedIn: any;

  constructor(
              private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.authService.getEmitter().subscribe((isLogged) => { 
      console.log('Odpalam navbar')
      console.log("Component is notified of successfull login!"); 
      if(localStorage.getItem('user')!== null){
        this.isLoggedIn = true;
        this.user = JSON.parse(localStorage.getItem("user"));
        console.log(this.user)
      }
      else{
        this.isLoggedIn = false;
      }
    }); 
    if(localStorage.getItem('user')!== null){
      this.isLoggedIn = true;
      this.user = JSON.parse(localStorage.getItem("user"));
      console.log(this.user)
    }
    else{
      this.isLoggedIn = false;
    }
  }
    ngOnChanges() {
      this.authService.getEmitter().subscribe((isLogged) => { 
        console.log('Odpalam navbar')
        console.log("Component is notified of successfull login!"); 
        if(localStorage.getItem('user')!== null){
          this.isLoggedIn = true;
          this.user = JSON.parse(localStorage.getItem("user"));
          console.log(this.user)
        }
        else{
          this.isLoggedIn = false;
        }
      }); 
    
    
    
    // var user = firebase.auth().currentUser;
    // console.log(user)
    // firebase.auth().onAuthStateChanged(function(user) {
    //   if (user) {
    //     console.log(user)
    //   } else {
    //     console.log("niezalogowany")
    //   }
    // });
    // this.auth.



//     this.authService.getUserState().then(
//       this.user = this.authService.user,
// )


        // if (this.authService.user) {
        //   console.log("zalogowany")
        //     console.log(this.authService.user)
        //   } else {
        //     console.log("niezalogowany")
        //   }
    
      // .subscribe(user =>{
        
      // })
      
  }


  logout(){
    this.authService.logout();
    console.log('wyloguj')
  }

}
