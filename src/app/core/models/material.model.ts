export interface Material {
    id: string; // Assuming Material ID is Guid/string in backend
    name: string;
    pricePerUnit: number; // Assuming backend has PricePerUnit as decimal/number
  }