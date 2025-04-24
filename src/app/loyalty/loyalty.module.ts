import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionHistoryComponent } from './transaction-history/transaction-history.component';
import { FidelitiesListComponent } from './fidelities-list/fidelities-list.component';
import { AddFideliteComponent } from './add-fidelite/add-fidelite.component';
import { EditFidelityComponent } from './edit-fidelity/edit-fidelity.component';
import { LoyaltyRoutingModule } from './loyalty-routing.module';

@NgModule({
  declarations: [
    TransactionHistoryComponent,
    FidelitiesListComponent,
    AddFideliteComponent,
    EditFidelityComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    LoyaltyRoutingModule
  ],
  exports: [
    TransactionHistoryComponent,
    FidelitiesListComponent,
    AddFideliteComponent,
    EditFidelityComponent
  ]
})
export class LoyaltyModule {}