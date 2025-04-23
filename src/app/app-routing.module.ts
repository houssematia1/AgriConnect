import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { InscriptionComponent } from './inscription/inscription.component';
import { LoginComponent } from './login/login.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { AdminGuard } from './guards/admin.guard';
import { ProduitCreateComponent } from './produit-create/produit-create.component';
import { ProductListComponent } from './product-list/product-list.component';
import { HomeclientComponent } from './homeclient/homeclient.component';
import { ProduitDetailsComponent } from './produit-details/produit-details.component';
import { ProduitParCategorieComponent } from './produit-par-categorie/produit-par-categorie.component';
import { NotificationComponent } from './notification/notification.component';
import { ProductListClientComponent } from './product-list-client/product-list-client.component';
import { ProduitParCategorieClientComponent } from './produit-par-categorie-client/produit-par-categorie-client.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'inscription', component: InscriptionComponent },
  { path: 'login', component: LoginComponent },
  { path: 'users', component: UserListComponent, canActivate: [AdminGuard] },
  { path: 'produit-create', component: ProduitCreateComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'homeclient', component: HomeclientComponent },
  { path: 'produit-create', component: ProduitCreateComponent },
  { path: 'produit-create/:id', component: ProduitCreateComponent },
  { path: 'produit-details/:id', component: ProduitDetailsComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'categorie/:category', component: ProduitParCategorieComponent },
  { path: 'products', component: ProduitParCategorieComponent },
  { path: 'notification', component: NotificationComponent },
  { path: 'productListClient', component: ProductListClientComponent },
  { path: 'produitparCategorieClient', component: ProduitParCategorieClientComponent },

  {
    path: 'produits-par-categorie',
    component: ProduitParCategorieComponent
  },
  
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
