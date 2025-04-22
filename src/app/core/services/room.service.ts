import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Room, RoomType } from '../models/room.model';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private mockRooms: Room[] = [
    {
      id: '1',
      name: 'Grand Ballroom',
      capacity: 300,
      hourlyRate: 500,
      description: 'Our largest and most prestigious space, perfect for galas and large weddings.',
      images: [
        'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3',
        'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3'
      ],
      amenities: ['Stage', 'Dance Floor', 'Premium Sound System', 'Chandeliers', 'Catering Kitchen Access'],
      availability: [],
      floor: 1,
      roomType: RoomType.BALLROOM,
      isActive: true
    },
    {
      id: '2',
      name: 'Garden Terrace',
      capacity: 150,
      hourlyRate: 350,
      description: 'Beautiful outdoor space with garden views, perfect for ceremonies and cocktail receptions.',
      images: [
        'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?ixlib=rb-4.0.3',
        'https://images.unsplash.com/photo-1587825045351-c6ea48e8054d?ixlib=rb-4.0.3'
      ],
      amenities: ['Garden Access', 'Outdoor Lighting', 'Weather Protection', 'Bar Setup'],
      availability: [],
      floor: 1,
      roomType: RoomType.OUTDOOR,
      isActive: true
    },
    {
      id: '3',
      name: 'Executive Conference Room',
      capacity: 50,
      hourlyRate: 200,
      description: 'Professional meeting space with state-of-the-art technology.',
      images: [
        'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?ixlib=rb-4.0.3',
        'https://images.unsplash.com/photo-1517502884422-41eaead166d4?ixlib=rb-4.0.3'
      ],
      amenities: ['Projector', 'Video Conferencing', 'Whiteboard', 'Ergonomic Seating'],
      availability: [],
      floor: 2,
      roomType: RoomType.CONFERENCE,
      isActive: true
    },
    {
      id: '4',
      name: 'Summit Room',
      capacity: 80,
      hourlyRate: 250,
      description: 'Versatile space with panoramic city views, ideal for presentations and medium-sized gatherings.',
      images: [
        'https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3',
        'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3'
      ],
      amenities: ['Panoramic Views', 'AV Equipment', 'Flexible Seating', 'Dedicated Sound System'],
      availability: [],
      floor: 3,
      roomType: RoomType.MEETING,
      isActive: true
    },
    {
      id: '5',
      name: 'Harmony Banquet Hall',
      capacity: 120,
      hourlyRate: 300,
      description: 'Elegant space for medium-sized receptions and banquets.',
      images: [
        'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3',
        'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6a3?ixlib=rb-4.0.3'
      ],
      amenities: ['Round Tables', 'Dance Floor', 'Dedicated Bar Area', 'Mood Lighting'],
      availability: [],
      floor: 2,
      roomType: RoomType.BANQUET,
      isActive: true
    }
  ];

  constructor() {
    // Generate mock availability data
    this.generateAvailabilityData();
  }

  private generateAvailabilityData(): void {
    const now = new Date();
    const oneYear = new Date();
    oneYear.setFullYear(now.getFullYear() + 1);
    
    this.mockRooms.forEach(room => {
      // Generate availability slots for the next 30 days
      for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        date.setHours(0, 0, 0, 0);
        
        // Create slots for each day (9 AM to 10 PM)
        for (let hour = 9; hour < 22; hour += 3) {
          const startTime = new Date(date);
          startTime.setHours(hour, 0, 0, 0);
          
          const endTime = new Date(date);
          endTime.setHours(hour + 3, 0, 0, 0);
          
          // Random booking status (for demo purposes)
          const isBooked = Math.random() > 0.7;
          
          room.availability.push({
            date: new Date(date),
            startTime,
            endTime,
            isBooked,
            eventId: isBooked ? Math.floor(Math.random() * 5 + 1).toString() : undefined
          });
        }
      }
    });
  }

  getRooms(): Observable<Room[]> {
    return of(this.mockRooms).pipe(delay(500));
  }

  getRoomById(id: string): Observable<Room | undefined> {
    const room = this.mockRooms.find(r => r.id === id);
    return of(room).pipe(delay(300));
  }

  createRoom(room: Omit<Room, 'id'>): Observable<Room> {
    const newRoom: Room = {
      ...room,
      id: (this.mockRooms.length + 1).toString()
    };
    
    this.mockRooms.push(newRoom);
    return of(newRoom).pipe(delay(500));
  }

  updateRoom(room: Room): Observable<Room> {
    const index = this.mockRooms.findIndex(r => r.id === room.id);
    if (index !== -1) {
      this.mockRooms[index] = room;
      return of(this.mockRooms[index]).pipe(delay(500));
    }
    throw new Error('Room not found');
  }

  deleteRoom(id: string): Observable<boolean> {
    const index = this.mockRooms.findIndex(r => r.id === id);
    if (index !== -1) {
      this.mockRooms.splice(index, 1);
      return of(true).pipe(delay(500));
    }
    return of(false).pipe(delay(500));
  }
  
  getRoomsByType(type: RoomType): Observable<Room[]> {
    const rooms = this.mockRooms.filter(room => room.roomType === type);
    return of(rooms).pipe(delay(500));
  }
  
  getAvailableRooms(startDate: Date, endDate: Date, capacity: number): Observable<Room[]> {
    // Find rooms that are available during the specified time period and have sufficient capacity
    const availableRooms = this.mockRooms.filter(room => {
      // Check capacity
      if (room.capacity < capacity) {
        return false;
      }
      
      // Check availability
      const conflicts = room.availability.some(slot => {
        // Check if the slot overlaps with the requested period
        const slotStart = slot.startTime;
        const slotEnd = slot.endTime;
        
        // If the slot is already booked and there's an overlap, it's a conflict
        return slot.isBooked && (
          (startDate >= slotStart && startDate < slotEnd) ||
          (endDate > slotStart && endDate <= slotEnd) ||
          (startDate <= slotStart && endDate >= slotEnd)
        );
      });
      
      return !conflicts;
    });
    
    return of(availableRooms).pipe(delay(800));
  }
}