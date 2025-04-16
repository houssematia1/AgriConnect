import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { InscriptionComponent } from './inscription/inscription.component';
import { LoginComponent } from './login/login.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UserFormComponent } from './user-form/user-form.component';
import { VerifyAccountComponent } from './verify-account/verify-account.component'; // 👈 à ajouter
import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'inscription', component: InscriptionComponent },
  { path: 'login', component: LoginComponent },
  { path: 'verify', component: VerifyAccountComponent }, // ✅ ajout de la route de vérification
  { path: 'users', component: UserListComponent, canActivate: [AdminGuard] },
  { path: 'users/add', component: UserFormComponent, canActivate: [AdminGuard] },
  { path: 'users/edit/:id', component: UserEditComponent, canActivate: [AdminGuard] },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
