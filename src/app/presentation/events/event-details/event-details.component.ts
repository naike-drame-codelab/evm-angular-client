import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EventService } from '../../../core/services/event.service';
import { Event } from '../../../core/models/event.model';
import { Room } from '../../../core/models/room.model'; // Import Room model
import { Client } from '../../../core/models/client.model'; // Import Client model
import { FormatDatePipe } from '../../../shared/pipes/format-date.pipe';
import { FormatTimePipe } from '../../../shared/pipes/format-time.pipe';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; // For icons
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // For loading
import { MatTabsModule } from '@angular/material/tabs'; // Import Tabs module
import { MatProgressBarModule } from '@angular/material/progress-bar'; // Import Progress Bar
import { switchMap, catchError, tap, map } from 'rxjs/operators'; // Import operators
import { forkJoin, of, Observable } from 'rxjs'; // Import forkJoin and Observable
import { PaymentService } from '../../../core/services/payment.service';
import { NavbarComponent } from "../../../shared/components/navbar/navbar.component";
import { FooterComponent } from "../../../shared/components/footer/footer.component";
// import { RoomService } from '../../../core/services/room.service'; // Import RoomService
import { ClientService } from '../../../core/services/client.service'; // Import ClientService
import { CurrencyPipe } from '@angular/common'; // Import CurrencyPipe

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule, // Needed for routerLink
    FormatDatePipe,
    FormatTimePipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTabsModule, // Add Tabs module
    MatProgressBarModule, // Add Progress Bar module
    CurrencyPipe, // Add CurrencyPipe
    NavbarComponent,
    FooterComponent
],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.scss'
})

  export class EventDetailsComponent implements OnInit {
  paymentService = inject(PaymentService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private eventService = inject(EventService);
  // private roomService = inject(RoomService); // Inject RoomService
  private clientService = inject(ClientService); // Inject ClientService

  event: Event | null | undefined = undefined; // undefined: loading, null: not found, Event: found
  room: Room | null | undefined = undefined;
  client: Client | null | undefined = undefined;
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (!id) {
          this.error = 'Event ID not found in route.';
          this.loading = false;
          return of(null); // Stop if no ID
        }
        this.loading = true;
        this.error = null;
        // Fetch event first
        return this.eventService.getEventById(id).pipe(
          switchMap(eventData => {
            if (!eventData) {
              return of({ event: null, room: null, client: null }); // Event not found
            }
            // // Fetch related data if event exists
            // const roomObs = eventData.roomReservations?.length > 0
            //   ? this.roomService.getRoomById(eventData.roomReservations[0].roomId).pipe(catchError(() => of(null))) // Handle room fetch error
            //   : of(null); // No room reservation

            const clientObs = eventData.clientId
              ? this.clientService.getClientById(eventData.clientId.toString()).pipe(catchError(() => of(null))) // Handle client fetch error
              : of(null); // No client ID

            return forkJoin({ event: of(eventData)
              // room: roomObs, client: clientObs }
              , room: of(null), client: clientObs }).pipe(
              map(data => {
                return { event: data.event, room: data.room, client: data.client };
              })
            );
          }),
          catchError(err => {
            console.error('Error loading event details:', err);
            this.error = `Error loading event: ${err.message || 'Unknown error'}`;
            return of(null); // Return null on error
          })
        );
      })
    ).subscribe({
      next: (data) => {
        this.event = data?.event ?? null;
        this.room = data?.room ?? null;
        this.client = data?.client ?? null;
        this.loading = false;
      },
      error: (err) => {
        // Error is handled in the catchError pipe, but log just in case
        console.error('Subscription error:', err);
        this.error = 'An unexpected error occurred.';
        this.loading = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/public-events']); // Navigate back to the list of events
  }

  payForTickets() {
    if (!this.event) return;
    console.log(this.event); // Debugging line to check event data

    const items = [
      { name: `${this.event.name} Ticket`, price: 25, quantity: 1 } // Use actual event data
    ];
    this.paymentService.createCheckoutSession(items);
  }
}
