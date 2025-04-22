import { Routes } from '@angular/router';
import { HomeComponent } from './presentation/home/home.component';
import { OverviewComponent } from './presentation/dashboard/overview.component';
import { EventListComponent } from './presentation/events/event-list/event-list.component';
import { RoomGridComponent } from './presentation/rooms/room-grid/room-grid.component';

export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: OverviewComponent },
    { path: 'events', component: EventListComponent },
    { path: 'rooms', component: RoomGridComponent },
    // Add other routes as they get implemented
    { path: '**', redirectTo: '/dashboard' } // Fallback route
  ];
