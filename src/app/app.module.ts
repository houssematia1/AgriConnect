import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';      // ⬅️ C'est ça qui manque
import { MatListModule } from '@angular/material/list';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { EvenementListComponent } from './components/evenement/list/list.component';
import { EvenementFormComponent } from './components/evenement/form/form.component';
import { EvenementDetailComponent } from './components/evenement/detail/detail.component';
import { FormCategorieComponent } from './components/categorie/form/form.component';
import { CategorieListComponent } from './components/categorie/list/list.component';

@NgModule({
  
  declarations: [
    AppComponent,
    EvenementListComponent,
    EvenementFormComponent,
    EvenementDetailComponent,
    FormCategorieComponent,
    CategorieListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    BrowserAnimationsModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
