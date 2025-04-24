import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { InscriptionComponent } from './inscription/inscription.component';
import { HomeComponent } from './home/home.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UserFormComponent } from './user-form/user-form.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { VerifyAccountComponent } from './verify-account/verify-account.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { MyAccountComponent } from './my-account/my-account.component';
import { UserService } from './user.service';
import { AdminGuard } from './admin.guard';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    InscriptionComponent,
    HomeComponent,
    UserListComponent,
    UserEditComponent,
    UserFormComponent,
    UserProfileComponent,
    VerifyAccountComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    MyAccountComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [UserService, AdminGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
