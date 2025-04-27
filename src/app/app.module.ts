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
import { ProduitDetailsClientComponent } from './produit-details-client/produit-details-client.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { ProduitExpirationListComponent } from './produit-expiration-list/produit-expiration-list.component';
import { PromotionAddComponent } from './promotion-add/promotion-add.component';
import { PromotionAnalyticsComponent } from './promotion-analytics/promotion-analytics.component';
import { PromotionFormComponent } from './promotion-form/promotion-form.component';
import { PromotionMenuComponent } from './promotion-menu/promotion-menu.component';
import { PromotionListComponent } from './promotion-list/promotion-list.component';
import { PromotionsRoutingModule } from './promotion-routing.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgChartsModule } from 'ng2-charts';
import { StockPurchaseDashboardComponent } from './stock-purchase-dashboard/stock-purchase-dashboard.component';
import { ProductPromotionViewComponent } from './product-promotion-view/product-promotion-view.component';
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
    ProduitDetailsClientComponent,
    
    ConfirmDialogComponent,
    ProduitExpirationListComponent,
    PromotionAddComponent,
    PromotionAnalyticsComponent,
    PromotionFormComponent,
    PromotionListComponent,
    PromotionMenuComponent,
   
    StockPurchaseDashboardComponent,
        ProductPromotionViewComponent,

   
   
    
   
   
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
    PromotionsRoutingModule,
    MatDialogModule,
    MatTooltipModule,
    MatIconModule,
    MatProgressSpinnerModule,
    NgChartsModule,

    
    
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
