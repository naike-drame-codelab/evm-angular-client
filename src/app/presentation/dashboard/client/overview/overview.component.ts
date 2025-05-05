import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EventService } from '../../../../core/services/event.service';
// import { RoomService } from '../../../../core/services/room.service';
import { ClientService } from '../../../../core/services/client.service';
import { AnalyticsService, VenueMetrics } from '../../../../core/services/analytics.service';
import { Event } from '../../../../core/models/event.model';
import { Client } from '../../../../core/models/client.model';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  upcomingEvents: Event[] = [];
  recentClients: Client[] = [];
  metrics: VenueMetrics | null = null;
  loading = {
    events: true,
    clients: true,
    metrics: true
  };
  currentDate = new Date();

  constructor(
    private eventService: EventService,
    private clientService: ClientService,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit(): void {
    this.loadUpcomingEvents();
    this.loadRecentClients();
    this.loadMetrics();
  }

  loadUpcomingEvents(): void {
    this.loading.events = true;
    this.eventService.getUpcomingEvents(5).subscribe({
      next: (events) => {
        this.upcomingEvents = events;
        this.loading.events = false;
      },
      error: (error) => {
        console.error('Error loading upcoming events', error);
        this.loading.events = false;
      }
    });
  }

  loadRecentClients(): void {
    this.loading.clients = true;
    this.clientService.getRecentClients(5).subscribe({
      next: (clients) => {
        this.recentClients = clients;
        this.loading.clients = false;
      },
      error: (error) => {
        console.error('Error loading recent clients', error);
        this.loading.clients = false;
      }
    });
  }

  loadMetrics(): void {
    // this.loading.metrics = true;
    // this.analyticsService.getVenueMetrics().subscribe({
    //   next: (metrics) => {
    //     this.metrics = metrics;
    //     this.loading.metrics = false;
    //   },
    //   error: (error) => {
    //     console.error('Error loading metrics', error);
    //     this.loading.metrics = false;
    //   }
    //});
  }

  getEventStatusClass(status: string): string {
    switch (status) {
      case 'confirmed': return 'badge badge-success';
      case 'pending': return 'badge badge-warning';
      case 'cancelled': return 'badge badge-error';
      case 'completed': return 'badge badge-primary';
      default: return 'badge';
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  }

  formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }
}