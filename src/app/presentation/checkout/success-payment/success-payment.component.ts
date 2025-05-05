import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';

@Component({
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatDividerModule],
  templateUrl: './success-payment.component.html',
  styleUrl: './success-payment.component.scss'
})
export class SuccessPaymentComponent {
   private router = inject(Router);
  goBack() {
    this.router.navigate(['/public-events']); // Navigate back to the list of events
  }
}
