import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PromotionMenuComponent } from './promotion-menu/promotion-menu.component';
import { PromotionAddComponent } from './promotion-add/promotion-add.component';
import { PromotionListComponent } from './promotion-list/promotion-list.component';
import { PromotionAnalyticsComponent } from './promotion-analytics/promotion-analytics.component';
import { ProduitExpirationListComponent } from './produit-expiration-list/produit-expiration-list.component';



const routes: Routes = [
  {
    path: 'promotions',
    children: [
      { path: '', component: PromotionMenuComponent }, // Menu principal
      { path: 'add', component: PromotionAddComponent },
      { path: 'list', component: PromotionListComponent },
      { path: 'produits-proches-expiration', component: ProduitExpirationListComponent },
      { path: 'analytics', component: PromotionAnalyticsComponent },
      { path: '**', redirectTo: '' } // Redirection par défaut vers le menu
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PromotionsRoutingModule {}