import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

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

  async signin(frm){
    await this.auth.signin(frm.value.email, frm.value.password)
    if(this.auth.isLoggedIn){
      this.isLoggedIn = true;
    }
  }

}