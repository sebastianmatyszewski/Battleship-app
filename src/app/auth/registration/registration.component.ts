import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  public authError: any;
  public isLoggedIn = false;
  constructor(private auth: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    this.auth.authError$.subscribe(data =>{
      this.authError = data;
    })
    if(localStorage.getItem('user')!== null){
      this.isLoggedIn = true;
      this.router.navigate(['/home'])
    }
    
    else{
      this.isLoggedIn = false;
    }
    
  }
  
  async signup(frm){
    await this.auth.signup(frm.value)
    if(this.auth.isLoggedIn){
      this.isLoggedIn = true;
    }
  }
}
