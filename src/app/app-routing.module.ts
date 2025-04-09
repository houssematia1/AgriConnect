import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { InscriptionComponent } from './inscription/inscription.component';
import { LoginComponent } from './login/login.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { AdminGuard } from './guards/admin.guard';
import {LivraisonComponent} from "./livraison/livraison.component";
import {ProfileComponent} from "./profile/profile.component";

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'inscription', component: InscriptionComponent },
  { path: 'login', component: LoginComponent },
  { path: 'users', component: UserListComponent, canActivate: [AdminGuard] },
  { path: 'users/edit/:id', component: UserEditComponent, canActivate: [AdminGuard] },
  { path: 'livraison/:userId', component: LivraisonComponent },
  { path: 'profile/:userId', component: ProfileComponent },


  { path: '**', redirectTo: '' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
