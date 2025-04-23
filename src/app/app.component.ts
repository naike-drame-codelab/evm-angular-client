import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { OverviewComponent } from './presentation/dashboard/overview.component';
import { EventListComponent } from './presentation/events/event-list/event-list.component';
import { RoomGridComponent } from './presentation/rooms/room-grid/room-grid.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    RouterModule,
    // OverviewComponent,
    // EventListComponent,
    // RoomGridComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Event Venue Manager';
  
  isSidebarExpanded = true;
  currentYear = new Date().getFullYear();
  
  toggleSidebar(): void {
    this.isSidebarExpanded = !this.isSidebarExpanded;
  }
}