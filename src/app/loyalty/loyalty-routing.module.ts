import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FidelitiesListComponent } from './fidelities-list/fidelities-list.component';
import { AddFideliteComponent } from './add-fidelite/add-fidelite.component';
import { EditFidelityComponent } from './edit-fidelity/edit-fidelity.component';
import { TransactionHistoryComponent } from './transaction-history/transaction-history.component';

const routes: Routes = [
  { path: 'fidelities', component: FidelitiesListComponent },
  { path: 'fidelities/edit/:id', component: EditFidelityComponent },
  { path: 'fidelities/history/:userId', component: TransactionHistoryComponent },
  { path: 'fidelities/history', redirectTo: 'fidelities' },
  { path: 'fidelities/add', component: AddFideliteComponent },
  { path: '', redirectTo: 'fidelities', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoyaltyRoutingModule {}