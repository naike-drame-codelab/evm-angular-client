import { Component, inject } from '@angular/core';
import { PaymentService } from '../../../core/services/payment.service';

@Component({
  selector: 'app-event-details',
  imports: [],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.scss'
})
export class EventDetailsComponent {
  paymentService = inject(PaymentService);

  payForTickets() {
    const items = [
      { name: 'Event Ticket', price: 50, quantity: 1 } // Example ticket details
    ];
    this.paymentService.createCheckoutSession(items);
  }
}
