import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule, Routes } from '@angular/router';
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
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


const routes: Routes = [
  { path: '', redirectTo: '/promotions', pathMatch: 'full' }, // Redirection par défaut vers les promotions
  { path: 'inscription', component: InscriptionComponent },
  { path: 'login', component: LoginComponent },
  { path: 'users', component: UserListComponent },
  { path: '**', redirectTo: '/promotions' }
];

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
    UserEditComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgChartsModule,
    MatDialogModule,
    MatTooltipModule,
    RouterModule.forRoot(routes),
    PromotionsRoutingModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}