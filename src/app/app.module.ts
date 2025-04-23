import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';  
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { InscriptionComponent } from './inscription/inscription.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { ProduitCreateComponent } from './produit-create/produit-create.component';
import { ProductListComponent } from './product-list/product-list.component';
import { CommonModule } from '@angular/common';
import { HomeclientComponent } from './homeclient/homeclient.component';
import { ProduitDetailsComponent } from './produit-details/produit-details.component';
import { ProduitParCategorieComponent } from './produit-par-categorie/produit-par-categorie.component';
import { NotificationComponent } from './notification/notification.component';
import { ProductListClientComponent } from './product-list-client/product-list-client.component';
import { ProduitParCategorieClientComponent } from './produit-par-categorie-client/produit-par-categorie-client.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    InscriptionComponent,
    LoginComponent,
    HomeComponent,
    UserListComponent,
    UserEditComponent,
    ProduitCreateComponent,
    ProductListComponent,
    HomeclientComponent,
    ProduitDetailsComponent,
    ProduitParCategorieComponent,
    NotificationComponent,
    ProductListClientComponent,
    ProduitParCategorieClientComponent,
   
   
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,  // IMPORTANT : Pour utiliser [formGroup] dans UserEditComponent
    HttpClientModule,
    AppRoutingModule,
    RouterModule,
    CommonModule,
    BrowserAnimationsModule,
    
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
