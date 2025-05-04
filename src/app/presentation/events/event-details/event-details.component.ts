import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EventService } from '../../../core/services/event.service';
import { Event } from '../../../core/models/event.model';
import { FormatDatePipe } from '../../../shared/pipes/format-date.pipe';
import { FormatTimePipe } from '../../../shared/pipes/format-time.pipe';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; // For icons
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // For loading
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { PaymentService } from '../../../core/services/payment.service';
import { NavbarComponent } from "../../../shared/components/navbar/navbar.component";
import { FooterComponent } from "../../../shared/components/footer/footer.component";

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

  event: Event | null | undefined = undefined; // undefined: loading, null: not found, Event: found
  loading = true;

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        return id ? this.eventService.getEventById(id) : of(null); // Handle case where id might be missing
      })
    ).subscribe({
      next: (data) => {
        this.event = data ?? null; // Set to null if data is undefined (not found)
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading event details:', err);
        this.event = null; // Treat error as not found
        this.loading = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/public-events']); // Navigate back to the list of events
  }

  payForTickets() {
    const items = [
      { name: 'Event Ticket', price: 50, quantity: 1 } // Example ticket details
    ];
    this.paymentService.createCheckoutSession(items);
  }
}
