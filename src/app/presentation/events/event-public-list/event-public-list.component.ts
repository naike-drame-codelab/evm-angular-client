import { Component, OnInit, inject } from '@angular/core'; // Import OnInit
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EventService } from '../../../core/services/event.service';
import { Event } from '../../../core/models/event.model';
import { FormatDatePipe } from '../../../shared/pipes/format-date.pipe';
import { FormatTimePipe } from '../../../shared/pipes/format-time.pipe';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NavbarComponent } from "../../../shared/components/navbar/navbar.component"; // For loading indicator

@Component({
  selector: 'app-event-public-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormatDatePipe,
    FormatTimePipe,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    NavbarComponent
],
  templateUrl: './event-public-list.component.html',
  styleUrls: ['./event-public-list.component.scss']
})
export class EventPublicListComponent implements OnInit { // Implement OnInit
  private eventService = inject(EventService);

  events: Event[] = [];
  loading = true;

  constructor() { } // Keep constructor clean

  ngOnInit(): void { // Fetch data in ngOnInit
    this.eventService.getEvents().subscribe({
      next: (data) => {
        //this.events = data.filter(event => new Date(event.startDate) > new Date()); // Optionally show only upcoming events
        this.events = data; // Data should now match the updated Event model
        this.loading = false;
      },
      error: (err) => { console.error('Error loading events:', err); this.loading = false; }
    });
  }
}