import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { InscriptionComponent } from './inscription/inscription.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { LivraisonComponent } from './livraison/livraison.component';
import { ProfileComponent } from './profile/profile.component';
import { HistoriqueComponent } from './historique/historique.component';
import { GoogleMapsComponent } from './google-maps/google-maps.component';
import {AgmCoreModule} from "@agm/core";

@NgModule({
  declarations: [
    AppComponent,
    InscriptionComponent,
    LoginComponent,
    HomeComponent,
    UserListComponent,
    UserEditComponent,
    LivraisonComponent,
    ProfileComponent,
    HistoriqueComponent,
    GoogleMapsComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCH-qIi6RzomB2m3iW1nAZzRYXQG1yxU3Y'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
