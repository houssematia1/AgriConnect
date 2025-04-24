import { NgModule } from '@angular/core';
   import { BrowserModule } from '@angular/platform-browser';
   import { HttpClientModule } from '@angular/common/http';
   import { FormsModule, ReactiveFormsModule } from '@angular/forms';
   import { NgChartsModule } from 'ng2-charts';
   import { MatDialogModule } from '@angular/material/dialog';
   import { MatTooltipModule } from '@angular/material/tooltip';
   import { MatIconModule } from '@angular/material/icon';
   import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
   import { AppRoutingModule } from './app-routing.module';
   import { PromotionsRoutingModule } from './promotions-routing.module';
   import { AppComponent } from './app.component';
   import { PromotionMenuComponent } from './promotion-menu/promotion-menu.component';
   import { PromotionAddComponent } from './promotion-add/promotion-add.component';
   import { PromotionListComponent } from './promotion-list/promotion-list.component';
   import { PromotionAnalyticsComponent } from './promotion-analytics/promotion-analytics.component';
   import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
   import { InscriptionComponent } from './inscription/inscription.component';
   import { LoginComponent } from './login/login.component';
   import { UserListComponent } from './user-list/user-list.component';
   import { UserEditComponent } from './user-edit/user-edit.component';
   import { ProduitExpirationListComponent } from './produit-expiration-list/produit-expiration-list.component';
   import { LoyaltyModule } from './loyalty/loyalty.module';
import { ToastrModule } from 'ngx-toastr';



   @NgModule({
     declarations: [
       AppComponent,
       PromotionMenuComponent,
       PromotionAddComponent,
       PromotionListComponent,
       PromotionAnalyticsComponent,
       ConfirmDialogComponent,
       InscriptionComponent,
       LoginComponent,
       UserListComponent,
       UserEditComponent,
       ProduitExpirationListComponent
     ],
     imports: [
       BrowserModule,
       HttpClientModule,
       FormsModule,
       ReactiveFormsModule,
       NgChartsModule,
       MatDialogModule,
       MatTooltipModule,
       MatIconModule,
       MatProgressSpinnerModule,
       AppRoutingModule,
       ToastrModule.forRoot(),
       LoyaltyModule,
       PromotionsRoutingModule
     ],
     bootstrap: [AppComponent]
   })
   export class AppModule { }