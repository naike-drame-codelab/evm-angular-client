import { Routes } from '@angular/router';
import { HomeComponent } from './presentation/home/home.component';
import { OverviewComponent } from './presentation/dashboard/overview.component';
import { EventListComponent } from './presentation/events/event-list/event-list.component';
import { RoomGridComponent } from './presentation/rooms/room-grid/room-grid.component';
import { AuthComponent } from './presentation/auth/auth/auth.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {path: 'home', component: HomeComponent},
  {path: 'admin', component: OverviewComponent},
  {path: 'client', component: OverviewComponent},
  {path: 'auth', component: AuthComponent}, 
  { path: 'events', component: EventListComponent },
  { path: 'rooms', component: RoomGridComponent },
  // Autres routes

  { path: '**', redirectTo: '/not-found' }, // Fallback route
];
