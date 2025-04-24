import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { InscriptionComponent } from './inscription/inscription.component';
import { LoginComponent } from './login/login.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { AdminGuard } from './guards/admin.guard';
import { PromotionMenuComponent } from './promotion-menu/promotion-menu.component';

const routes: Routes = [
  { path: '', redirectTo: '/promotions', pathMatch: 'full' }, // Redirect to promotions by default
  { path: 'home', component: HomeComponent }, // Explicit route for HomeComponent
  { path: 'inscription', component: InscriptionComponent },
  { path: 'login', component: LoginComponent },
  { path: 'users', component: UserListComponent, canActivate: [AdminGuard] },
  { path: 'users/edit/:id', component: UserEditComponent, canActivate: [AdminGuard] },
  { path: 'promotions', component: PromotionMenuComponent }, // Use PromotionMenuComponent as the parent
  { path: 'loyalty', loadChildren: () => import('./loyalty/loyalty.module').then(m => m.LoyaltyModule) },
  { path: '**', redirectTo: '/promotions' } // Wildcard redirects to promotions
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }