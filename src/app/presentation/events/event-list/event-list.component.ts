import { Component, OnInit, inject, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; // Import DatePipe
import { Router, RouterModule } from '@angular/router'; // Import Router
import { EventService } from '../../../core/services/event.service';
import { Event, EventStatus } from '../../../core/models/event.model';
import { MatTableDataSource, MatTableModule } from '@angular/material/table'; // Import Table modules
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator'; // Import Paginator
import { MatSort, MatSortModule } from '@angular/material/sort'; // Import Sort
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon'; // Import Icon module
import { MatButtonModule } from '@angular/material/button'; // Import Button module
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // For loading indicator
import { MatSnackBar } from '@angular/material/snack-bar'; // For feedback

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DatePipe, // Add DatePipe
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
  export class EventListComponent implements OnInit, AfterViewInit {
  events: Event[] = [];
  private eventService = inject(EventService);
  private router = inject(Router); // Inject Router
  private snackBar = inject(MatSnackBar); // Inject SnackBar

  loading = true;

  constructor() {}
  displayedColumns: string[] = ['name', 'startDate', 'status', 'actions']; // Define table columns
  dataSource: MatTableDataSource<Event> = new MatTableDataSource<Event>(); // Initialize data source

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.loadEvents();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // Custom sorting for date
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'startDate': return new Date(item.startDate).getTime();
        default: return (item as any)[property];
      }
    };
  }

  loadEvents(): void {
    this.loading = true;
    this.eventService.getEvents(true).subscribe({ // Fetch events (consider if details are needed here)
      next: (data) => {
        this.events = data;
        this.dataSource.data = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading events:', err);
        this.snackBar.open(`Error loading events: ${err.message || 'Unknown error'}`, 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  applyFilter(event: KeyboardEvent): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editEvent(eventId: string): void {
    this.router.navigate(['/admin/events', eventId, 'edit']); // Navigate to edit route
  }

  deleteEvent(eventId: string, eventName: string): void {
    // Simple confirmation dialog (consider using MatDialog for better UX)
    if (confirm(`Are you sure you want to delete the event "${eventName}"?`)) {
      this.eventService.deleteEvent(eventId).subscribe({
        next: () => {
          this.snackBar.open(`Event "${eventName}" deleted successfully.`, 'Close', { duration: 3000 });
          // Refresh the list after deletion
          this.dataSource.data = this.dataSource.data.filter(event => event.id !== eventId);
        },
        error: (err) => {
          console.error('Error deleting event:', err);
          this.snackBar.open(`Error deleting event: ${err.message || 'Unknown error'}`, 'Close', { duration: 3000 });
        }
      });
    }
  }

  // Helper for status badge class (copied from OverviewComponent - consider moving to a shared utility/pipe)
  getEventStatusClass(status: EventStatus): string {
    switch (status?.toLowerCase()) { // Use lowercase for comparison
      case 'upcoming': return 'badge badge-info'; // Example class
      case 'ongoing': return 'badge badge-success';
      case 'completed': return 'badge badge-primary';
      case 'cancelled': return 'badge badge-error';
      default: return 'badge';
    }
  }
}