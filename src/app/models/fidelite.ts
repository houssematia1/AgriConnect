export interface Fidelite {
    id?: number;
    user: User | null; // Explicitly allow null
    points: number;
    niveau: string;
    lastUpdated: Date;
  }
  
  export interface User {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    dateOfBirth?: string;
    numeroDeTelephone?: string;
    role?: string;
  }