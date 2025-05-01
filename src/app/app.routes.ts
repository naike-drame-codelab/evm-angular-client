import { Routes } from '@angular/router';
import { HomeComponent } from './presentation/home/home.component';
import { OverviewComponent } from './presentation/dashboard/client/overview/overview.component';
import { EventListComponent } from './presentation/events/event-list/event-list.component';
import { RoomGridComponent } from './presentation/rooms/room-grid/room-grid.component';
import { AuthComponent } from './presentation/auth/auth/auth.component';
import { NotFoundComponent } from './presentation/not-found/not-found/not-found.component';
import { SuccessPaymentComponent } from './presentation/checkout/success-payment/success-payment.component';
import { LayoutComponent } from './presentation/dashboard/client/layout/layout.component';
import { EventFormComponent } from './presentation/events/event-form/event-form.component';
import { EventDetailsComponent } from './presentation/events/event-details/event-details.component';
import { CancelPaymentComponent } from './presentation/checkout/cancel-payment/cancel-payment.component';
import { CheckoutComponent } from './presentation/checkout/checkout/checkout.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {path: 'home', component: HomeComponent},
  {path: 'auth', component: AuthComponent}, 
  {path: 'not-found', component: NotFoundComponent}, // Page 404
  { path: 'events/:id/details', component: EventDetailsComponent }, 
  {path: 'events/:id/checkout', component: CheckoutComponent}, // Détails de l'événement
  {path: 'success', component: SuccessPaymentComponent}, // Page de succès de paiement
  {path: 'cancel', component: CancelPaymentComponent}, // Page d'annulation de paiement

  // Autres routes
  {
    path: 'client',
    component: LayoutComponent,
    children: [
      { path: 'overview', component: OverviewComponent },
      { path: 'events', component: EventListComponent },
      { path: 'events/new', component: EventFormComponent},
      { path: 'rooms', component: RoomGridComponent },
    ],
  },
  {
    path: 'admin',
    component: LayoutComponent,
    children: [
      { path: 'overview', component: OverviewComponent },
      { path: 'events', component: EventListComponent },
      { path: 'rooms', component: RoomGridComponent },
    ],
  },
  { path: '**', redirectTo: '/not-found'}, // Fallback route
]
