import { inject, Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, delay } from 'rxjs/operators'; import { Event, EventStatus, EventType, RoomReservationDTO, MaterialOptionDTO, CateringOptionDTO } from '../models/event.model'; // Import new types
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EventCreateDTO } from '../models/event-create.model';
import { Material } from '../models/material.model';
import { Catering } from '../models/catering.model';


@Injectable({
  providedIn: 'root'
})
export class EventService {

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error.message);
    return throwError(() => new Error('Something went wrong. Please try again later.'));
  }
  // Mock data can be removed or updated to match the new Event structure if needed for testing
  // private mockEvents: Event[] = [ ... ];

  httpClient = inject(HttpClient);
  constructor() { }

  /**
   * Fetches events from the API.
   * @param includeDetails Optional flag to include detailed information (e.g., room reservations).
   *                       Defaults to false.
   */
  getEvents(includeDetails: boolean = false): Observable<Event[]> {
    // If using mock data: return of(this.mockEvents).pipe(delay(500));
    const url = includeDetails
      ? `${environment.apiUrl}/event?includeDetails=true`
      : `${environment.apiUrl}/event`;
    return this.httpClient.get<Event[]>(url).pipe(
      catchError(this.handleError) // Add error handling
    );
  }

  getEventById(id: string): Observable<Event | undefined> { // Use Event type
    // const event = this.mockEvents.find(e => e.id === id);
    // return of(event).pipe(delay(300));
    return this.httpClient.get<Event>(`${environment.apiUrl}/event/${id}`).pipe( // Use Event type
      catchError(this.handleError) // Add error handling
    );
  }

  getUpcomingEvents(limit: number = 5): Observable<Event[]> { // Use Event[] type
    // const now = new Date();
    // const upcoming = this.mockEvents
    //   .filter(event => event.startDate > now)
    //   .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
    //   .slice(0, limit);

    // return of(upcoming).pipe(delay(500));
    return this.getEvents().pipe(
      map(events => events
        .filter(event => new Date(event.startDate) > new Date()) // Filter by startDate
        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
        .slice(0, limit)
      ),
      catchError(this.handleError)
    );
  }

  // Update create/update/delete if needed, using the correct API URL and types
  // Example:
  createEvent(eventData: EventCreateDTO): Observable<Event> { // Use EventCreateDTO and expect Event back
    return this.httpClient.post<Event>(`${environment.apiUrl}/event`, eventData).pipe( // POST to /api/event
      catchError(this.handleError)
    );
  }

  updateEvent(id: string, eventData: Partial<Event>): Observable<Event> { // Use Partial for updates
    return this.httpClient.put<Event>(`${environment.apiUrl}/${id}`, eventData).pipe(
      catchError(this.handleError)
    );
  }

  deleteEvent(id: string): Observable<void> { // Often returns no content on success
    return this.httpClient.delete<void>(`${environment.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  getRooms(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${environment.apiUrl}/room`).pipe(
      catchError(this.handleError));
  }

  getMaterials(): Observable<Material[]> {
    return this.httpClient.get<Material[]>(`${environment.apiUrl}/material`).pipe(
      catchError(this.handleError));
  }

  getCaterings(): Observable<Catering[]> {
    return this.httpClient.get<Catering[]>(`${environment.apiUrl}/catering`).pipe(
      catchError(this.handleError));
  }

  // These methods might need adjustment or removal if using API filtering
  // getEventsByRoom(roomId: string): Observable<Event[]> {
  //   // API call or client-side filter based on roomReservations
  //   return this.getEvents().pipe(
  //     map(events => events.filter(event => event.roomReservations.some(rr => rr.roomId === roomId))),
  //     delay(500) // Keep delay if desired
  //   );
  // }

  // getEventsByClient(clientId: string): Observable<Event[]> {
  //   // This might require a specific API endpoint or fetching client details separately
  //   // const events = this.mockEvents.filter(event => event.clientId === clientId); // Old mock logic
  //   return of([]).pipe(delay(500)); // Placeholder
  // }

  getEventsByDateRange(startDate: Date, endDate: Date): Observable<Event[]> {
    // Consider adding API parameters for date range filtering for efficiency
    return this.getEvents().pipe(
      map(events => events.filter(event => {
        const eventStart = new Date(event.startDate);
        const eventEnd = new Date(event.endDate);
        // Basic overlap check
        return eventStart < endDate && eventEnd > startDate;
      })),
      delay(500) // Keep delay if desired
    );
  }

  // getEventsByStatus(status: EventStatus): Observable<Event[]> {
  //   const events = this.mockEvents.filter(event => event.status === status);
  //   return of(events).pipe(delay(500));
  // }
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

/*
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private baseUrl = 'api'; // Adjust the base URL as needed

  constructor(private http: HttpClient) {}


}


*/