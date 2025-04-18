export interface Produit {
  id?: number;
  nom: string;
  description?: string;
  prix: number;
  devise?: string;
  taxe?: number;
  dateExpiration?: string;
  fournisseur?: string;
  fournisseurId?: number;
  image?: string; // Includes 'image'
  stock?: number;
  seuilMin?: number;
  autoReapprovisionnement?: boolean;
  quantiteReapprovisionnement?: number;
}