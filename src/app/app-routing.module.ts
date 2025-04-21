import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { InscriptionComponent } from './inscription/inscription.component';
import { LoginComponent } from './login/login.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { AdminGuard } from './guards/admin.guard';
import { PromotionListComponent } from './promotion-list/promotion-list.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'inscription', component: InscriptionComponent },
  { path: 'login', component: LoginComponent },
  { path: 'users', component: UserListComponent, canActivate: [AdminGuard] },
  { path: 'users/edit/:id', component: UserEditComponent, canActivate: [AdminGuard] },
  { path: 'promotions', component: PromotionListComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }