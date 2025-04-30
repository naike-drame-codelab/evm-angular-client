export interface Event {
    id: string;
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    roomId: string;
    clientId: string;
    status: EventStatus;
    attendees: number;
    type: EventType;
    amenities: string[];
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export enum EventStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    CANCELLED = 'cancelled',
    COMPLETED = 'completed'
  }
  
  export enum EventType {
    WEDDING = 'wedding',
    CORPORATE = 'corporate',
    CONFERENCE = 'conference',
    PARTY = 'party',
    MEETING = 'meeting',
    OTHER = 'other'
  }

  // src/app/core/models/event.model.ts

export interface EventDto {
  id: number;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
  organizerId: string; // Assuming GUID stored as string
  organizerName: string;
  venueId: number;
  venueName: string;
  capacity: number;
  ticketsSold: number;
  ticketPrice: number;
  status: string; // Consider using an enum if you have defined statuses
}

export interface CreateEventDto {
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
  venueId: number;
  capacity: number;
  ticketPrice: number;
  status: string;
  // organizerId is likely set on the backend based on the authenticated user
}

export interface UpdateEventDto {
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
  venueId: number;
  capacity: number;
  ticketPrice: number;
  status: string;
}
