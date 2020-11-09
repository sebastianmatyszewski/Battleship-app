


import { EventEmitter, Injectable, Injector, Output } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { BehaviorSubject } from 'rxjs';



interface IUser {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
  emailVerified: boolean;
}


@Injectable({
  providedIn: 'root'
})



export class AuthService {
  @Output() fireIsLoggedIn: EventEmitter<any> = new EventEmitter<any>(); 
  firebaseErrors = {
    'auth/user-not-found': 'Nie znaleziono takiego uzytkownika',
    'auth/email-already-in-use': 'Istnieje już konto z takim adresem email',
    'auth/wrong-password': 'Zły login lub hasło',
    'auth/too-many-requests': 'Zbyt dużo prób logowania',
    'auth/invalid-email': 'Wpisz poprawny email',
    'auth/weak-password': 'Hasło powinno składać się z conajmniej 6 znaków'
  };


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
  }
  getEmitter(){
    return this.fireIsLoggedIn; 
  }
}
    

  // async getUserState(){
  //   this.isLoading = true;
  //   await this.afAuth.authState.subscribe(user => {
  //     // console.log('getUser: ' + user)
  //     this.user=user;
  //     console.log('getUser: ' + this.user)
  //     this.isLoading = false;
  //     console.log('isLoading: ' + this.isLoading)
  //   });
  // }

  // getUserLogged(){
  //   var user = firebase.auth().currentUser;


  //     console.log(user)

  // }


  //https://medium.com/@zrolson/firebase-authentication-login-c756b4ea334d
//   async getCurrentUser(){
//     // get the local storage information by key
//     const localUser = JSON.parse(localStorage.getItem('user'));
//     if (localUser === null) {
//         // information not stored in local storage; 
//         // so get the authentication state from AngularFireAuth
//         await this.afAuth.authState.subscribe(user => {
//             if (user) {
//                 // user was authenitcated, set values
//                 this.user = {
//                     'uid': user.uid,
//                     'email': user.email,
//                     'photoURL': user.photoURL,
//                     'displayName': user.displayName,
//                     'emailVerified': user.emailVerified
//                 };
//                 // store information locally
//                 localStorage.setItem('user', JSON.stringify(this.user));
//                 // hide the progress spinner
//                 this.isLoading = false;
//             } else {
//                 // user not authenticated, so NULL the value
//                 this.user = null;
//                 // store null information locally
//                 localStorage.setItem('user', JSON.stringify(this.user));
//                 // hide the progress spinner
//                 this.isLoading = false;
//             }
//         });
//     } else {
//         // information already stored locally, 
//         // so set to user variable
//         this.user = localUser;
//         // hide the progress spinner
//         this.isLoading = false;
//     }
//   }

//   async updateUserData({ 
//     uid, 
//     email, 
//     displayName, 
//     photoURL, 
//     emailVerified }: IUser, 
//     registrationName?: string
// ) {
//     const userRef: AngularFirestoreDocument<IUser> = this.db.doc(`users/${uid}`);
//     const data: IUser = {
//       uid,
//       email,
//       displayName: (registrationName) ? registrationName : displayName,
//       photoURL,
//       emailVerified: emailVerified
//     }
//     return await userRef.set(data, { merge: true });
// }

//   async verifyUserRedirect(): Promise<void> {
//     // show the progress spinner
//     this.isLoading = true;
//     await firebase.auth().getRedirectResult().then(auth => {
//         // user property exists; this was a redirect
//         if (auth.user) {
//             this.updateUserData(auth.user).then(() => {
//                 this.getCurrentUser();
//             }, error => {
//                 // hide the progress spinner
//                 this.isLoading = false;
//                 // user our notifier to show any errors
//                 // this.notifier.showError(error.message);
//             });
//         } else {
//             // this was not a redirect; 
//             // use our method to check for user
//             // in local storage
//             this.getCurrentUser();
//         }
//     }, (error) => {
//         // hide the progress spinner
//         this.isLoading = false;
//         // user our notifier to show any errors
//         // this.notifier.showError(error.message);
//     });
// }



//   login(email: string, password: string){
//     this.afAuth.signInWithEmailAndPassword(email, password)
//       .catch(error => {
        
//         // throw this.firebaseErrors[error.code] || error.message
//         error.message = this.firebaseErrors[error.code];
//         this.eventAuthError.next(error)
//         console.log(error.code)
//       })
//       .then(userCredential =>{
//         if(userCredential){
//           this.afAuth.setPersistence(firebase.auth.Auth.Persistence.SESSION)
//           this.router.navigate(['/home'])
//         }
//       })
//   }

//   createUser(user){
//     this.afAuth.createUserWithEmailAndPassword(user.email, user.password)
//       .then(userCredential =>{
//         this.newUser = user
//         console.log(userCredential)
//         userCredential.user.updateProfile({
//           displayName: user.firstName
//         });
//         this.insertUserData(userCredential)
//         .then(()=>{
//           this.router.navigate(['/home']);
//         });
//       })
//       .catch( error =>{
//         console.log(error.code)
//         error.message = this.firebaseErrors[error.code];
//         this.eventAuthError.next(error)
//       });
//   }
//   insertUserData(userCredential: firebase.auth.UserCredential){
//     return this.db.doc('Users/${userCredential.user.uid}').set({
//       email: this.newUser.email,
//       nickname: this.newUser.firstName,
//       score: 0
//     })
//   }
//   logout(){
//     return this.afAuth.signOut();
//   }

