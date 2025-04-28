import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EvenementListComponent } from './components/evenement/list/list.component';
import { EvenementFormComponent } from './components/evenement/form/form.component';
import { AppComponent } from './app.component';
import { EvenementDetailComponent } from './components/evenement/detail/detail.component';
import { CategorieListComponent } from './components/categorie/list/list.component';
import { FormCategorieComponent } from './components/categorie/form/form.component';

const routes: Routes = [
  { path: '', redirectTo: 'evenements', pathMatch: 'full' },
  { path: 'home', component: AppComponent },
  { path: 'evenements', component: EvenementListComponent },
  { path: 'evenements/new', component: EvenementFormComponent },
  { path: 'evenements/edit/:id', component: EvenementFormComponent },
  {path: 'evenements/:id', component: EvenementDetailComponent },
  { path: 'categories', component: CategorieListComponent },
  { path: 'categories/new', component: FormCategorieComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
