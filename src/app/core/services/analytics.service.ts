import { Injectable } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { EventService } from './event.service';
import { ClientService } from './client.service';
import { EventType, EventStatus } from '../models/event.model';

export interface VenueMetrics {
  totalEvents: number;
  totalClients: number;
  totalRevenue: number;
  upcomingEvents: number;
  roomUtilization: number;
  popularEventType: { type: EventType; count: number };
}

export interface EventsByMonth {
  month: string;
  count: number;
}

export interface RevenueByRoom {
  roomName: string;
  revenue: number;
}

export interface EventStatusDistribution {
  status: EventStatus;
  count: number;
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  // constructor(
  //   private eventService: EventService,
  //   private roomService: RoomService,
  //   private clientService: ClientService
  // ) { }

  // getVenueMetrics(): Observable<VenueMetrics> {
  //   return forkJoin({
  //     events: this.eventService.getEvents(),
  //     rooms: this.roomService.getRooms(),
  //     clientCount: this.clientService.getTotalClients()
  //   }).pipe(
  //     map(({ events, rooms, clientCount }) => {
  //       // Calculate total revenue
  //       const totalRevenue = events.reduce((sum, event) => {
  //         const room = rooms.find(r => r.id === event.roomId);
  //         if (!room) return sum;
          
  //         // Calculate hours for the event
  //         const startDate = new Date(event.startDate);
  //         const endDate = new Date(event.endDate);
  //         const hours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
          
  //         return sum + (hours * room.hourlyRate);
  //       }, 0);
        
  //       // Calculate upcoming events
  //       const now = new Date();
  //       const upcomingEvents = events.filter(event => new Date(event.startDate) > now).length;
        
  //       // Calculate room utilization
  //       const totalSlots = rooms.reduce((sum, room) => sum + room.availability.length, 0);
  //       const bookedSlots = rooms.reduce((sum, room) => {
  //         return sum + room.availability.filter(slot => slot.isBooked).length;
  //       }, 0);
  //       const roomUtilization = totalSlots > 0 ? (bookedSlots / totalSlots) * 100 : 0;
        
  //       // Find most popular event type
  //       const eventTypeCounts = events.reduce((acc, event) => {
  //         acc[event.type] = (acc[event.type] || 0) + 1;
  //         return acc;
  //       }, {} as Record<EventType, number>);
        
  //       let popularType = EventType.OTHER;
  //       let maxCount = 0;
        
  //       Object.entries(eventTypeCounts).forEach(([type, count]) => {
  //         if (count > maxCount) {
  //           popularType = type as EventType;
  //           maxCount = count;
  //         }
  //       });
        
  //       return {
  //         totalEvents: events.length,
  //         totalClients: clientCount,
  //         totalRevenue,
  //         upcomingEvents,
  //         roomUtilization,
  //         popularEventType: { type: popularType, count: maxCount }
  //       };
  //     }),
  //     delay(800)
  //   );
  // }
  
  // getEventsByMonth(year: number = new Date().getFullYear()): Observable<EventsByMonth[]> {
  //   return this.eventService.getEvents().pipe(
  //     map(events => {
  //       const months = [
  //         'January', 'February', 'March', 'April', 'May', 'June',
  //         'July', 'August', 'September', 'October', 'November', 'December'
  //       ];
        
  //       const eventsByMonth = months.map((month, index) => {
  //         const count = events.filter(event => {
  //           const eventDate = new Date(event.startDate);
  //           return eventDate.getFullYear() === year && eventDate.getMonth() === index;
  //         }).length;
          
  //         return { month, count };
  //       });
        
  //       return eventsByMonth;
  //     }),
  //     delay(600)
  //   );
  // }
  
  // getRevenueByRoom(): Observable<RevenueByRoom[]> {
  //   return forkJoin({
  //     events: this.eventService.getEvents(),
  //     rooms: this.roomService.getRooms()
  //   }).pipe(
  //     map(({ events, rooms }) => {
  //       // Initialize revenue data structure
  //       const revenueByRoom: RevenueByRoom[] = rooms.map(room => ({
  //         roomName: room.name,
  //         revenue: 0
  //       }));
        
  //       // Calculate revenue for each room
  //       events.forEach(event => {
  //         const room = rooms.find(r => r.id === event.roomId);
  //         if (!room) return;
          
  //         const roomIndex = revenueByRoom.findIndex(r => r.roomName === room.name);
  //         if (roomIndex === -1) return;
          
  //         // Calculate hours for the event
  //         const startDate = new Date(event.startDate);
  //         const endDate = new Date(event.endDate);
  //         const hours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
          
  //         // Add to the room's revenue
  //         revenueByRoom[roomIndex].revenue += hours * room.hourlyRate;
  //       });
        
  //       return revenueByRoom.sort((a, b) => b.revenue - a.revenue);
  //     }),
  //     delay(700)
  //   );
  // }
  
  // getEventStatusDistribution(): Observable<EventStatusDistribution[]> {
  //   return this.eventService.getEvents().pipe(
  //     map(events => {
  //       const statusCounts = events.reduce((acc, event) => {
  //         acc[event.status] = (acc[event.status] || 0) + 1;
  //         return acc;
  //       }, {} as Record<EventStatus, number>);
        
  //       return Object.entries(statusCounts).map(([status, count]) => ({
  //         status: status as EventStatus,
  //         count
  //       }));
  //     }),
  //     delay(500)
  //   );
  // }
}