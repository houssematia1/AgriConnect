import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { InscriptionComponent } from './inscription/inscription.component';
import { LoginComponent } from './login/login.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UserFormComponent } from './user-form/user-form.component';
import { VerifyAccountComponent } from './verify-account/verify-account.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminGuard } from './guards/admin.guard';
import { FaceAuthComponent } from './face-auth/face-auth.component';
import { MyAccountComponent } from './my-account/my-account.component';
import { PhotoUploadTestComponent } from './photo-upload-test/photo-upload-test.component'; // ✅ à ajouter

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'inscription', component: InscriptionComponent },
  { path: 'login', component: LoginComponent },
  { path: 'verify', component: VerifyAccountComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'stats', component: DashboardComponent, canActivate: [AdminGuard] },
  { path: 'users', component: UserListComponent, canActivate: [AdminGuard] },
  { path: 'users/add', component: UserFormComponent, canActivate: [AdminGuard] },
  { path: 'users/edit/:id', component: UserEditComponent, canActivate: [AdminGuard] },
  { path: 'face-auth', component: FaceAuthComponent },
  { path: 'my-account', component: MyAccountComponent },
  { path: 'test-upload', component: PhotoUploadTestComponent }, // ✅ nouvelle route

  // redirection par défaut
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
