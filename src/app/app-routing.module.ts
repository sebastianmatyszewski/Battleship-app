import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegistrationComponent } from './auth/registration/registration.component';
import { HomeComponent } from './home/home.component';
import { MultiplayerComponent } from './multiplayer/multiplayer.component';
import { SingleplayerComponent } from './singleplayer/singleplayer.component';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from "@angular/cdk/drag-drop";

const routes: Routes = [
{
  path: 'login',
  component: LoginComponent
},
{
  path: 'register',
  component: RegistrationComponent 
},
{
  path: 'home',
  component: HomeComponent
},
{
  path: 'singleplayer',
  component: SingleplayerComponent
},
{
  path: 'multiplayer',
  component: MultiplayerComponent
},
{
  path: '',
  redirectTo: '/home',
  pathMatch: 'full'
},

];

@NgModule({
  imports: [RouterModule.forRoot(routes), FormsModule, DragDropModule],
  exports: [RouterModule, DragDropModule]
})
export class AppRoutingModule { }
export const routingComponents = [LoginComponent, RegistrationComponent, HomeComponent, SingleplayerComponent, MultiplayerComponent]
