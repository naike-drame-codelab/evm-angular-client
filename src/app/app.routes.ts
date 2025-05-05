import { Routes } from '@angular/router';
import { HomeComponent } from './presentation/home/home.component';
import { EventPublicListComponent } from './presentation/events/event-public-list/event-public-list.component';
import { OverviewComponent } from './presentation/dashboard/client/overview/overview.component';
import { EventListComponent } from './presentation/events/event-list/event-list.component';
// import { RoomGridComponent } from './presentation/rooms/room-grid/room-grid.component';
import { AuthComponent } from './presentation/auth/auth/auth.component';
import { NotFoundComponent } from './presentation/not-found/not-found/not-found.component';
import { SuccessPaymentComponent } from './presentation/checkout/success-payment/success-payment.component';
import { LayoutComponent } from './presentation/dashboard/client/layout/layout.component';
import { EventFormComponent } from './presentation/events/event-form/event-form.component';
import { EventDetailsComponent } from './presentation/events/event-details/event-details.component';
import { CancelPaymentComponent } from './presentation/checkout/cancel-payment/cancel-payment.component';
import { CheckoutComponent } from './presentation/checkout/checkout/checkout.component';
import { EventEditComponent } from './presentation/events/event-edit/event-edit.component';
import { RoomListComponent } from './presentation/rooms/room-list/room-list.component';
import { RoomGridComponent } from './presentation/rooms/room-grid/room-grid.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'rooms', component: RoomListComponent }, // Use RoomListComponent here
  { path: 'auth', component: AuthComponent },
  { path: 'events/:id/details', component: EventDetailsComponent },
  { path: 'public-events', component: EventPublicListComponent }, // Détails de l'événement
  { path: 'events/:id/checkout', component: CheckoutComponent }, // Détails de l'événement
  { path: 'success', component: SuccessPaymentComponent }, // Page de succès de paiement
  { path: 'cancel', component: CancelPaymentComponent }, // Page d'annulation de paiement
  { path: 'not-found', component: NotFoundComponent }, // Page 404

  // Autres routes
  {
    path: 'admin',
    component: LayoutComponent,
    children: [
      { path: 'overview', component: OverviewComponent },
      { path: 'events', component: EventListComponent },
      { path: 'events/new', component: EventFormComponent },
      { path: 'events/:id', component: EventDetailsComponent },
      { path: 'events/:id/edit', component: EventEditComponent },
      { path: 'rooms-list', component: RoomGridComponent },
    ],
  },
  {
    path: 'client',
    component: LayoutComponent,
    children: [
      { path: 'overview', component: OverviewComponent },
      { path: 'events', component: EventListComponent },
      { path: 'rooms', component: RoomListComponent },
    ],
  },
  { path: '**', redirectTo: '/not-found' }, // Fallback route
]
