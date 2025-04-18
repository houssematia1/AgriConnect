import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { InscriptionComponent } from './inscription/inscription.component';
import { LoginComponent } from './login/login.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { AdminGuard } from './guards/admin.guard';
import { NotificationComponent } from './notification/notification.component';
import { produitComponent } from './produit/produit.component';

const routes: Routes = [
  { path: '', component: HomeComponent }, // Default route: should load HomeComponent
  { path: 'inscription', component: InscriptionComponent },
  { path: 'login', component: LoginComponent },
  { path: 'users', component: UserListComponent, canActivate: [AdminGuard] },
  { path: 'users/edit/:id', component: UserEditComponent, canActivate: [AdminGuard] },
  { path: 'produits', component: produitComponent },
  { path: 'notifications', component: NotificationComponent },
  { path: '**', redirectTo: '' } // Wildcard route: redirects to default route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }