export interface Catering {
    id: number; // Changed from string to number to match backend int Id
    name: string;
    pricePerPerson: number; // Matches backend decimal
  }