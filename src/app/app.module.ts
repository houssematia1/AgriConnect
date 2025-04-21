import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
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
import { GoogleMapsModule } from '@angular/google-maps';
import { MapsComponent } from './maps/maps.component';


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
    MapsComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    GoogleMapsModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }



