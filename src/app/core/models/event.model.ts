// Define nested DTO interfaces first
export interface RoomReservationDTO {
  roomId: string; // Assuming RoomId is a string/Guid in your backend DTO
  roomName?: string; // Optional: Add other relevant fields if needed
  // Add other properties from your backend RoomReservationDTO
}

export interface MaterialOptionDTO {
  materialId: string; // Assuming MaterialId is a string/Guid
  materialName?: string; // Optional
  quantity: number;
  // Add other properties from your backend MaterialOptionDTO
}

export interface CateringOptionDTO {
  cateringId: string; // Assuming CateringId is a string/Guid
  cateringName?: string; // Optional
  numberOfPeople: number;
  // Add other properties from your backend CateringOptionDTO
}

// Define EventType and EventStatus enums (if not already defined elsewhere)
// Ensure these match the values used in your backend
export enum EventStatus {
  Upcoming = 'Upcoming',
  Ongoing = 'Ongoing',
  Completed = 'Completed',
  Cancelled = 'Cancelled'
}

export enum EventType {
  Concert = 'Concert',
  Conference = 'Conference',
  Corporate = 'Corporate',
  Exhibition = 'Exhibition',
  Tournament = 'Tournament',
  Other = 'Other'
}

export interface Event {
  id: string; // Changed from Guid to string for frontend consistency
  name: string; // Changed from title
  startDate: Date | string; // Keep as Date or string, handle conversion
  endDate: Date | string;
  type: EventType;
  status: EventStatus;
  description: string;
  imageUrl?: string;
  roomReservations: RoomReservationDTO[];
  materialOptions?: MaterialOptionDTO[];
  cateringOptions?: CateringOptionDTO[];
  ticketPrice: number;
  ticketQuantity: number;
  clientId: number; // Assuming int based on backend check
}