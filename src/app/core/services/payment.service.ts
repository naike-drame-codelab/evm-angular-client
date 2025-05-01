import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loadStripe } from '@stripe/stripe-js';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private stripePromise = loadStripe(`${environment.stripeKey}`);

  constructor(private http: HttpClient) {}

  async createCheckoutSession(items: any[]) {
    const stripe = await this.stripePromise;
    if (!stripe) throw new Error('Stripe.js failed to load.');

    const session = await this.http
      .post<{ sessionId: string }>(`${environment.stripeApiUrl}`, items)
      .toPromise();

    if (session) {
      stripe.redirectToCheckout({ sessionId: session.sessionId });
    }
  }
}