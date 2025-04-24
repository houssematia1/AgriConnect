import { User } from './user';

export interface PointsTransaction {
  id?: number; // Optional, as it will be assigned by the backend
  user: User | null;
  points: number;
  description: string;
  transactionDate: Date; // Renamed to transactionDate for clarity
}