import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProduitService } from '../services/produit.service';

@Component({
  selector: 'app-produit-create',
  templateUrl: './produit-create.component.html',
  styleUrls: ['./produit-create.component.css']
})
export class ProduitCreateComponent {
  produit = {
    nom: '',
    description: '',
    prix: 0,
    devise: 'XAF',
    taxe: 0,
    dateExpiration: '',
    stock: 0,
    seuilMin: 0,
    fournisseur: '',
    fournisseurId: null as number | null,
    autoReapprovisionnement: false,
    quantiteReapprovisionnement: 0,
    category: '',
    imageUrl: ''
  };

  categories = ['FRUITS', 'LEGUMES', 'CEREALES', 'AUTRE'];
  selectedFile: File | null = null;

  constructor(
    private produitService: ProduitService,
    private router: Router
  ) {}

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit() {
    if (!this.produit.nom || !this.produit.prix || !this.produit.category) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    if (!this.selectedFile) {
      alert('Veuillez sélectionner une image.');
      return;
    }

    const formData = new FormData();
    formData.append('nom', this.produit.nom);
    formData.append('description', this.produit.description || '');
    formData.append('prix', this.produit.prix.toString());
    formData.append('devise', this.produit.devise || 'XAF');
    formData.append('taxe', this.produit.taxe.toString());
    formData.append('category', this.produit.category);
    formData.append('stock', this.produit.stock.toString());
    if (this.produit.dateExpiration) {
      formData.append('dateExpiration', this.produit.dateExpiration);
    }
    formData.append('seuilMin', this.produit.seuilMin.toString());
    formData.append('fournisseur', this.produit.fournisseur || '');
    if (this.produit.fournisseurId) {
      formData.append('fournisseurId', this.produit.fournisseurId.toString());
    }
    formData.append('autoReapprovisionnement', this.produit.autoReapprovisionnement.toString());
    formData.append('quantiteReapprovisionnement', this.produit.quantiteReapprovisionnement.toString());
    formData.append('imageFile', this.selectedFile);

    this.produitService.createWithImage(formData).subscribe({
      next: () => {
        alert('✅ Produit créé avec succès !');
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Erreur lors de la création :', err);
        alert('❌ Erreur: ' + (err.error?.message || err.message));
      }
    });
  }
}
