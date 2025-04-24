export interface User {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    dateOfBirth?: string;
    numeroDeTelephone?: string;
    role?: string;
  }