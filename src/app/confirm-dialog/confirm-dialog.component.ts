// confirm-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <h2 class="text-xl font-bold mb-4">Confirmation</h2>
    <p class="mb-6">Êtes-vous sûr de vouloir supprimer "{{ data.promotionName }}" ?</p>
    <div class="flex justify-end space-x-4">
      <button 
        class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        (click)="onCancel()">
        Annuler
      </button>
      <button 
        class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        (click)="onConfirm()">
        Confirmer
      </button>
    </div>
  `
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { promotionName: string }
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}