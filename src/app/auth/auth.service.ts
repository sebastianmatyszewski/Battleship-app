import { EventEmitter, Injectable, Injector, Output } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  @Output() private fireIsLoggedIn: EventEmitter<any> = new EventEmitter<any>(); 
  private authError = new BehaviorSubject<string>("");
  authError$ = this.authError.asObservable();
  isLoggedIn = false;

  constructor(private afAuth: AngularFireAuth,
              private db: AngularFirestore,
              private router: Router) { }

  async signin(email: string, password: string){
    await this.afAuth.signInWithEmailAndPassword(email, password)
    .then(res=>{
      this.isLoggedIn = true
      localStorage.setItem('user', JSON.stringify(res.user))
      this.afAuth.setPersistence(firebase.auth.Auth.Persistence.SESSION)
      this.fireIsLoggedIn.emit(this.isLoggedIn)
      this.router.navigate(['/home'])
    })
    .catch(error =>{
      this.authError.next(error)
    })
  }

  async signup(user){
    await this.afAuth.createUserWithEmailAndPassword(user.email, user.password)
    .then(res=>{
      this.isLoggedIn = true
      localStorage.setItem('user', JSON.stringify(res.user))
      this.afAuth.setPersistence(firebase.auth.Auth.Persistence.SESSION)
      this.fireIsLoggedIn.emit(this.isLoggedIn)
      this.router.navigate(['/home'])
    })
    .catch(error =>{
      this.authError.next(error)
    })
  }
  async logout(){
    await this.afAuth.signOut()
    .then(res=>{
      this.isLoggedIn = false
      localStorage.removeItem('user')
      this.router.navigate(['/login'])
      console.log('Wyloguj z systemu')
      this.fireIsLoggedIn.emit(this.isLoggedIn)
    })
    .catch(error =>{
      this.authError.next(error)
    })
  }
  getEmitter(){
    return this.fireIsLoggedIn; 
  }
}