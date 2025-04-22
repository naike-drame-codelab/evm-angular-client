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