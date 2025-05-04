import { EventType, EventStatus } from "./event.model";

export interface MaterialOptionCreateDTO {
    materialId: number; // Assuming Guid maps to string
    quantity: number;
  }
  
  export interface CateringOptionCreateDTO {
    cateringId: number; // Assuming Guid maps to string
    numberOfPeople: number;
  }
  
  export interface EventCreateDTO {
    name: string;
    startDate: string | Date; // Use ISO string format for API
    endDate: string | Date;   // Use ISO string format for API
    type: EventType;
    status: EventStatus;
    description: string;
    imageUrl?: string;
    clientId: number; // Assuming int based on backend check
    roomReservations: number[]; // List of Room IDs
    materialOptions?: MaterialOptionCreateDTO[];
    cateringOptions?: CateringOptionCreateDTO[];
    ticketPrice: number;
    ticketQuantity: number;
  }