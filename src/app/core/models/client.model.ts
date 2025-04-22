export interface Client {
    id: string;
    name: string;
    company?: string;
    email: string;
    phone: string;
    address?: string;
    notes?: string;
    events: string[]; // Array of event IDs
    createdAt: Date;
    updatedAt: Date;
  }