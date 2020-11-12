import { BrowserModule } from '@angular/platform-browser';
import { CommonModule} from '@angular/common';
import { NgModule } from '@angular/core';

import { AppRoutingModule} from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { RouterModule } from '@angular/router';

import { environment } from 'src/environments/environment';
import { DragDropModule } from "@angular/cdk/drag-drop";
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from './navbar/navbar.component';
import { AuthService } from './auth/auth.service';
import { SingleplayerComponent } from './singleplayer/singleplayer.component';
import { LoginComponent } from './auth/login/login.component';
import { MultiplayerComponent } from './multiplayer/multiplayer.component';
import { RegistrationComponent } from './auth/registration/registration.component';
import { HomeComponent } from './home/home.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SingleplayerComponent,
    MultiplayerComponent,
    NavbarComponent,
    RegistrationComponent,
    LoginComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    RouterModule,
    DragDropModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent],
  exports: [AppComponent,
          ]

})
export class AppModule { }
