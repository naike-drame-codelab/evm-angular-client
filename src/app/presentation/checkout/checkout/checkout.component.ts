import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms'; // Import Reactive Forms modules
import { CommonModule } from '@angular/common'; // Import CommonModule for directives like *ngIf
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; // Optional: for icons

// Define an interface for the item structure (good practice)
interface CheckoutItem {
  id: string; // Assuming items have a unique ID
  name: string;
  price: number;
  quantity: number;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule, // Needed for built-in directives if not using @for
    ReactiveFormsModule, // Import ReactiveFormsModule
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule // Optional
  ],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'] // Link the SCSS file
})
export class CheckoutComponent {
  private fb = inject(FormBuilder);

  checkoutForm!: FormGroup;

  // Sample initial data (replace with your actual data source)
  initialItems: CheckoutItem[] = [
    { id: 'item1', name: 'Sample Ticket A', price: 50, quantity: 1 },
    { id: 'item2', name: 'Sample Ticket B', price: 75, quantity: 2 },
  ];

  constructor() {
    this.checkoutForm = this.fb.group({
      // You can add other top-level form controls here if needed (e.g., customer info)
      items: this.fb.array([]) // Initialize items as an empty FormArray
    });

    // Populate the FormArray with initial data
    this.populateItems(this.initialItems);
  }

  // Getter for easy access to the items FormArray in the template
  get items(): FormArray {
    return this.checkoutForm.get('items') as FormArray;
  }

  // Creates a FormGroup for a single item
  createItemFormGroup(item: CheckoutItem): FormGroup {
    return this.fb.group({
      id: [item.id], // Store ID, maybe disable it in the form
      name: [item.name, Validators.required], // Add validators as needed
      price: [item.price, [Validators.required, Validators.min(0.01)]],
      quantity: [item.quantity, [Validators.required, Validators.min(1)]]
    });
  }

  // Populates the FormArray
  populateItems(itemsData: CheckoutItem[]): void {
    itemsData.forEach(item => {
      this.items.push(this.createItemFormGroup(item));
    });
  }

  // Optional: Method to add a new empty item
  addItem(): void {
    const newItem: CheckoutItem = { id: `new${Date.now()}`, name: '', price: 0, quantity: 1 };
    this.items.push(this.createItemFormGroup(newItem));
  }

  // Optional: Method to remove an item
  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  // Updated checkout logic
  createCheckoutSession(): void {
    if (this.checkoutForm.invalid) {
      console.error('Form is invalid');
      this.checkoutForm.markAllAsTouched(); // Mark fields to show errors
      return;
    }

    console.log('Checkout Form Value:', this.checkoutForm.value);
    const checkoutData = this.checkoutForm.value;
    // TODO: Implement actual Stripe checkout session creation logic here
    // using checkoutData.items
    alert('Proceeding to checkout simulation with data: ' + JSON.stringify(checkoutData));
  }
}
