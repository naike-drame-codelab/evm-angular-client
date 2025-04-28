import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { EventListComponent } from '../../../events/event-list/event-list.component';
import { RoomGridComponent } from '../../../rooms/room-grid/room-grid.component';
import { OverviewComponent } from '../overview/overview.component';

@Component({
  selector: 'app-layout',
  imports: [
    CommonModule, 
    RouterOutlet, 
    RouterModule,
    OverviewComponent,
    EventListComponent,
    RoomGridComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  title = 'Event Venue Manager';
  
  isSidebarExpanded = true;
  currentYear = new Date().getFullYear();
  
  toggleSidebar(): void {
    this.isSidebarExpanded = !this.isSidebarExpanded;
  }
}
