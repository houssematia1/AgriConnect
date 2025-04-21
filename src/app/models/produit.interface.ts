export interface Produit {
    id: number;
    description: string;
    nom: string;
    prix: number;
    devise: 'TND'; // Enforce Tunisian Dinar
    taxe: number;
    dateExpiration: string;
    fournisseur: string;
    fournisseurId: number;
    image: string;
    stock: number;
    seuilMin: number;
    autoReapprovisionnement: boolean;
    quantiteReapprovisionnement: number;
    salesCount: number;
    categorie: 'fruit' | 'légumes' | 'légumineuse' | 'céréale'; // Enforce specific categories
    
  }