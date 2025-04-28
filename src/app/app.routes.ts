import { Routes } from '@angular/router';
import { HomeComponent } from './presentation/home/home.component';
import { OverviewComponent } from './presentation/dashboard/client/overview/overview.component';
import { EventListComponent } from './presentation/events/event-list/event-list.component';
import { RoomGridComponent } from './presentation/rooms/room-grid/room-grid.component';
import { AuthComponent } from './presentation/auth/auth/auth.component';
import { NotFoundComponent } from './presentation/not-found/not-found/not-found.component';
import { LayoutComponent } from './presentation/dashboard/client/layout/layout.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {path: 'home', component: HomeComponent},
  {path: 'auth', component: AuthComponent}, 
  {path: 'not-found', component: NotFoundComponent}, // Page 404
  // Autres routes
  {
    path: 'client',
    component: LayoutComponent, // Assuming your layout component is named LayoutComponent
    children: [
      { path: 'overview', component: OverviewComponent },
      { path: 'events', component: EventListComponent },
      { path: 'rooms', component: RoomGridComponent },
    ],
  },
  {
    path: 'admin',
    component: LayoutComponent, // Assuming your layout component is named LayoutComponent
    children: [
      { path: 'overview', component: OverviewComponent },
      { path: 'events', component: EventListComponent },
      { path: 'rooms', component: RoomGridComponent },
    ],
  },
  { path: '**', redirectTo: '/not-found'}, // Fallback route
]
