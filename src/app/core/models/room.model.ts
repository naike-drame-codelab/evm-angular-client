export interface Room {
    id: string;
    name: string;
    capacity: number;
    hourlyRate: number;
    description: string;
    images: string[];
    amenities: string[];
    availability: TimeSlot[];
    floor: number;
    roomType: RoomType;
    isActive: boolean;
  }
  
  export interface TimeSlot {
    date: Date;
    startTime: Date;
    endTime: Date;
    isBooked: boolean;
    eventId?: string;
  }
  
  export enum RoomType {
    BALLROOM = 'ballroom',
    CONFERENCE = 'conference',
    MEETING = 'meeting',
    BANQUET = 'banquet',
    THEATER = 'theater',
    OUTDOOR = 'outdoor'
  }