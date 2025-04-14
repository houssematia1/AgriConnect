export interface produit {
    id?: number;
    nom: string;
    prix: number;
    devise: string;
    taxe?: number;
    dateExpiration: string;
    fournisseur: string;
    fournisseurId?: number;
    image?: string;
    stock: number;
    seuilMin: number;
    autoReapprovisionnement: boolean;
    quantiteReapprovisionnement: number;
    categorie: string;
  }
  