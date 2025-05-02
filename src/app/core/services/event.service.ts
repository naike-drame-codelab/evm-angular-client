import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Event, EventStatus, EventType } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private mockEvents: Event[] = [
    {
      id: '1',
      title: 'Annual Corporate Gala',
      description: 'Annual celebration for XYZ Corporation',
      startDate: new Date(2025, 0, 15, 18, 0), // Jan 15, 2025, 6:00 PM
      endDate: new Date(2025, 0, 15, 23, 0), // Jan 15, 2025, 11:00 PM
      roomId: '1',
      clientId: '1',
      status: EventStatus.CONFIRMED,
      attendees: 150,
      type: EventType.CORPORATE,
      amenities: ['Catering', 'AV Equipment', 'Bar Service'],
      notes: 'Client requested vegetarian options',
      createdAt: new Date(2024, 9, 10), // Oct 10, 2024
      updatedAt: new Date(2024, 9, 10)
    },
    {
      id: '2',
      title: 'Smith-Johnson Wedding',
      description: 'Wedding ceremony and reception',
      startDate: new Date(2025, 1, 14, 16, 0), // Feb 14, 2025, 4:00 PM
      endDate: new Date(2025, 1, 14, 23, 0), // Feb 14, 2025, 11:00 PM
      roomId: '2',
      clientId: '2',
      status: EventStatus.CONFIRMED,
      attendees: 200,
      type: EventType.WEDDING,
      amenities: ['Catering', 'DJ Booth', 'Decoration Package', 'Bar Service'],
      notes: 'Bride allergic to lilies',
      createdAt: new Date(2024, 8, 5), // Sep 5, 2024
      updatedAt: new Date(2024, 9, 1) // Oct 1, 2024
    },
    {
      id: '3',
      title: 'Tech Conference 2025',
      description: 'Annual technology conference with keynote speakers',
      startDate: new Date(2025, 2, 10, 9, 0), // Mar 10, 2025, 9:00 AM
      endDate: new Date(2025, 2, 12, 17, 0), // Mar 12, 2025, 5:00 PM
      roomId: '3',
      clientId: '3',
      status: EventStatus.PENDING,
      attendees: 300,
      type: EventType.CONFERENCE,
      amenities: ['Catering', 'AV Equipment', 'Wi-Fi', 'Registration Desk'],
      createdAt: new Date(2024, 9, 5), // Oct 5, 2024
      updatedAt: new Date(2024, 9, 5)
    },
    {
      id: '4',
      title: 'Product Launch',
      description: 'New product line launch for Media Inc.',
      startDate: new Date(2025, 0, 20, 10, 0), // Jan 20, 2025, 10:00 AM
      endDate: new Date(2025, 0, 20, 14, 0), // Jan 20, 2025, 2:00 PM
      roomId: '4',
      clientId: '4',
      status: EventStatus.CONFIRMED,
      attendees: 75,
      type: EventType.CORPORATE,
      amenities: ['Catering', 'AV Equipment', 'Product Display Area'],
      createdAt: new Date(2024, 9, 8), // Oct 8, 2024
      updatedAt: new Date(2024, 9, 8)
    },
    {
      id: '5',
      title: 'Quarterly Board Meeting',
      description: 'Q1 2025 Board Meeting for Global Finance',
      startDate: new Date(2025, 0, 5, 9, 0), // Jan 5, 2025, 9:00 AM
      endDate: new Date(2025, 0, 5, 12, 0), // Jan 5, 2025, 12:00 PM
      roomId: '5',
      clientId: '5',
      status: EventStatus.CONFIRMED,
      attendees: 12,
      type: EventType.MEETING,
      amenities: ['Catering', 'AV Equipment', 'Whiteboard'],
      createdAt: new Date(2024, 8, 15), // Sep 15, 2024
      updatedAt: new Date(2024, 8, 15)
    }
  ];

  constructor() { }

  getEvents(): Observable<Event[]> {
    return of(this.mockEvents).pipe(delay(500));
  }

  getEventById(id: string): Observable<Event | undefined> {
    const event = this.mockEvents.find(e => e.id === id);
    return of(event).pipe(delay(300));
  }

  getUpcomingEvents(limit: number = 5): Observable<Event[]> {
    const now = new Date();
    const upcoming = this.mockEvents
      .filter(event => event.startDate > now)
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
      .slice(0, limit);
    
    return of(upcoming).pipe(delay(500));
  }

  createEvent(event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Observable<Event> {
    const newEvent: Event = {
      ...event,
      id: (this.mockEvents.length + 1).toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.mockEvents.push(newEvent);
    return of(newEvent).pipe(delay(500));
  }

  updateEvent(event: Event): Observable<Event> {
    const index = this.mockEvents.findIndex(e => e.id === event.id);
    if (index !== -1) {
      this.mockEvents[index] = {
        ...event,
        updatedAt: new Date()
      };
      return of(this.mockEvents[index]).pipe(delay(500));
    }
    throw new Error('Event not found');
  }

  deleteEvent(id: string): Observable<boolean> {
    const index = this.mockEvents.findIndex(e => e.id === id);
    if (index !== -1) {
      this.mockEvents.splice(index, 1);
      return of(true).pipe(delay(500));
    }
    return of(false).pipe(delay(500));
  }

  getEventsByRoom(roomId: string): Observable<Event[]> {
    const events = this.mockEvents.filter(event => event.roomId === roomId);
    return of(events).pipe(delay(500));
  }

  getEventsByClient(clientId: string): Observable<Event[]> {
    const events = this.mockEvents.filter(event => event.clientId === clientId);
    return of(events).pipe(delay(500));
  }

  getEventsByDateRange(startDate: Date, endDate: Date): Observable<Event[]> {
    const events = this.mockEvents.filter(event => 
      (event.startDate >= startDate && event.startDate <= endDate) || 
      (event.endDate >= startDate && event.endDate <= endDate)
    );
    return of(events).pipe(delay(500));
  }

  getEventsByStatus(status: EventStatus): Observable<Event[]> {
    const events = this.mockEvents.filter(event => event.status === status);
    return of(events).pipe(delay(500));
  }
}

// src/app/core/services/event.service.ts

// import { Injectable, inject } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable, catchError, throwError } from 'rxjs';
// import { environment } from '../../../environments/environment'; // Adjust path if needed
// import { EventDto, CreateEventDto, UpdateEventDto } from '../models/event.model'; // Adjust path if needed

// @Injectable({
//   providedIn: 'root'
// })
// export class EventService {
//   private http = inject(HttpClient);
//   // Get API URL from environment variables
//   private apiUrl = `${environment.apiUrl}/api/events`;

//   /**
//    * Retrieves the authentication token.
//    * Replace this with your actual token retrieval logic (e.g., from AuthService).
//    */
//   private getToken(): string | null {
//     // Example: return localStorage.getItem('authToken');
//     // Example: return inject(AuthService).getToken();
//     return localStorage.getItem('authToken'); // Placeholder
//   }

//   /**
//    * Creates HttpHeaders with the Authorization token.
//    */
//   private getAuthHeaders(): HttpHeaders {
//     const token = this.getToken();
//     let headers = new HttpHeaders({
//       'Content-Type': 'application/json'
//     });
//     if (token) {
//       headers = headers.set('Authorization', `Bearer ${token}`);
//     }
//     return headers;
//   }

//   /**
//    * Handles HTTP errors.
//    */
//   private handleError(error: any): Observable<never> {
//     console.error('API Error:', error);
//     // Enhance error handling based on your needs (e.g., user-friendly messages)
//     return throwError(() => new Error('An error occurred. Please try again later.'));
//   }

//   /**
//    * Récupère tous les événements.
//    */
//   getEvents(): Observable<EventDto[]> {
//     return this.http.get<EventDto[]>(this.apiUrl, { headers: this.getAuthHeaders() })
//       .pipe(catchError(this.handleError));
//   }

//   /**
//    * Récupère un événement par son ID.
//    * @param id L'ID de l'événement.
//    */
//   getEventById(id: number): Observable<EventDto> {
//     return this.http.get<EventDto>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() })
//       .pipe(catchError(this.handleError));
//   }

//   /**
//    * Crée un nouvel événement.
//    * L'organizerId est généralement défini côté backend à partir de l'utilisateur authentifié.
//    * @param eventData Les données du nouvel événement.
//    */
//   createEvent(eventData: CreateEventDto): Observable<EventDto> {
//     return this.http.post<EventDto>(this.apiUrl, eventData, { headers: this.getAuthHeaders() })
//       .pipe(catchError(this.handleError));
//   }

//   /**
//    * Met à jour un événement existant.
//    * @param id L'ID de l'événement à mettre à jour.
//    * @param eventData Les nouvelles données de l'événement.
//    */
//   updateEvent(id: number, eventData: UpdateEventDto): Observable<void> {
//     // PUT requests often return NoContent (204), hence Observable<void>
//     return this.http.put<void>(`${this.apiUrl}/${id}`, eventData, { headers: this.getAuthHeaders() })
//       .pipe(catchError(this.handleError));
//   }

//   /**
//    * Supprime un événement.
//    * @param id L'ID de l'événement à supprimer.
//    */
//   deleteEvent(id: number): Observable<void> {
//     // DELETE requests often return NoContent (204), hence Observable<void>
//     return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() })
//       .pipe(catchError(this.handleError));
//   }

// getRooms(): Observable<any[]> {
//   return this.http.get<any[]>(`${environment.apiUrl}/rooms`);
// }

// getMaterials(): Observable<any[]> {
//   return this.http.get<any[]>(`${environment.apiUrl}/materials`);
// }

// getCaterings(): Observable<any[]> {
//   return this.http.get<any[]>(`${environment.apiUrl}/caterings`);
// }
// }
