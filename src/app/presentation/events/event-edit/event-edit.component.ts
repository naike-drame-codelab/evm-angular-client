import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router'; // Import ActivatedRoute
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { forkJoin, Subscription, switchMap, of } from 'rxjs'; // Import forkJoin, Subscription, switchMap, of

import { Client } from '../../../core/models/client.model';
import { EventCreateDTO } from '../../../core/models/event-create.model'; // Use for structure, maybe create EventUpdateDTO later
import { Event, EventStatus, EventType } from '../../../core/models/event.model'; // Import Event
import { Room } from '../../../core/models/room.model';
import { Catering } from '../../../core/models/catering.model';
import { Material } from '../../../core/models/material.model';
import { ClientService } from '../../../core/services/client.service';
import { EventService } from '../../../core/services/event.service';
// import { RoomService } from '../../../core/services/room.service';

@Component({
  selector: 'app-event-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.scss'] // Link to SCSS
})
export class EventEditComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private eventService = inject(EventService);
  private clientService = inject(ClientService);
  // private roomService = inject(RoomService);
  private router = inject(Router);
  private route = inject(ActivatedRoute); // Inject ActivatedRoute
  private snackBar = inject(MatSnackBar);

  eventForm!: FormGroup;
  isSubmitting = false;
  loadingData = true;
  eventId: string | null = null;
  private dataSub?: Subscription;

  // Data for dropdowns
  eventTypes = Object.values(EventType);
  eventStatuses = Object.values(EventStatus);
  clients: Client[] = [];
  rooms: Room[] = [];
  caterings: Catering[] = [];
  materials: Material[] = [];

  ngOnInit(): void {
    this.buildForm();
    this.loadInitialData();
  }

  ngOnDestroy(): void {
    this.dataSub?.unsubscribe(); // Clean up subscription
  }

  buildForm(): void {
    // Same form structure as EventFormComponent
    this.eventForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.required],
      startDate: [null, Validators.required],
      startTime: ['', Validators.required],
      endDate: [null, Validators.required],
      endTime: ['', Validators.required],
      type: [null, Validators.required],
      status: [null, Validators.required], // Don't default status on edit
      clientId: [null, Validators.required],
      roomReservations: [[], [Validators.required, Validators.minLength(1)]],
      cateringOptions: this.fb.array([]),
      materialOptions: this.fb.array([]),
      ticketPrice: [0, [Validators.required, Validators.min(0)]],
      ticketQuantity: [0, [Validators.required, Validators.min(1)]],
      imageUrl: [''],
    }, { validators: dateTimeValidator });
  }

  loadInitialData(): void {
    this.loadingData = true;
    this.dataSub = this.route.paramMap.pipe(
      switchMap(params => {
        this.eventId = params.get('id');
        if (!this.eventId) {
          this.snackBar.open('Event ID not found in route.', 'Close', { duration: 3000 });
          this.router.navigate(['/client/events']); // Or appropriate error route
          return of(null); // Stop further processing
        }
        // Fetch dropdown data and event data concurrently
        return forkJoin({
          clients: this.clientService.getClients(),
          rooms: this.eventService.getRooms(),
          materials: this.eventService.getMaterials(),
          caterings: this.eventService.getCaterings(),
          event: this.eventService.getEventById(this.eventId) // Fetch the specific event
        });
      })
    ).subscribe({
      next: (data) => {
        if (!data) return; // Exit if eventId was missing

        this.clients = data.clients;
        this.rooms = data.rooms;
        this.materials = data.materials;
        this.caterings = data.caterings;

        if (data.event) {
          this.populateForm(data.event);
        } else {
          this.snackBar.open(`Event with ID ${this.eventId} not found.`, 'Close', { duration: 3000 });
          this.router.navigate(['/client/events']); // Redirect if event not found
        }
        this.loadingData = false;
      },
      error: (err) => {
        console.error('Error loading initial data:', err);
        this.snackBar.open(`Error loading data: ${err.message || 'Unknown error'}`, 'Close', { duration: 5000 });
        this.loadingData = false;
        this.router.navigate(['/client/events']); // Redirect on error
      }
    });
  }

  populateForm(event: Event): void {
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);

    this.eventForm.patchValue({
      name: event.name,
      description: event.description,
      startDate: startDate,
      startTime: `${startDate.getHours().toString().padStart(2, '0')}:${startDate.getMinutes().toString().padStart(2, '0')}`,
      endDate: endDate,
      endTime: `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`,
      type: event.type,
      status: event.status,
      clientId: event.roomReservations[0]?.roomId, // Assuming clientId is linked via room or needs separate fetching
      roomReservations: event.roomReservations.map(rr => rr.roomId), // Assuming DTO has roomId
      ticketPrice: event.ticketPrice, // Adjust based on actual Event model
      ticketQuantity: event.ticketQuantity, // Adjust based on actual Event model
      imageUrl: event.imageUrl,
    });

    // Populate FormArrays
    event.cateringOptions?.forEach(co => this.cateringOptions.push(this.fb.group({
      cateringId: [co.cateringId, Validators.required],
      numberOfPeople: [co.numberOfPeople, [Validators.required, Validators.min(1)]]
    })));

    event.materialOptions?.forEach(mo => this.materialOptions.push(this.fb.group({
      materialId: [mo.materialId, Validators.required],
      quantity: [mo.quantity, [Validators.required, Validators.min(1)]]
    })));
  }

  // --- FormArray Helpers (Copy from EventFormComponent) ---
  get cateringOptions(): FormArray { return this.eventForm.get('cateringOptions') as FormArray; }
  get materialOptions(): FormArray { return this.eventForm.get('materialOptions') as FormArray; }
  newCateringOption(): FormGroup { return this.fb.group({ cateringId: [null, Validators.required], numberOfPeople: [1, [Validators.required, Validators.min(1)]] }); }
  addCateringOption(): void { this.cateringOptions.push(this.newCateringOption()); }
  removeCateringOption(index: number): void { this.cateringOptions.removeAt(index); }
  newMaterialOption(): FormGroup { return this.fb.group({ materialId: [null, Validators.required], quantity: [1, [Validators.required, Validators.min(1)]] }); }
  addMaterialOption(): void { this.materialOptions.push(this.newMaterialOption()); }
  removeMaterialOption(index: number): void { this.materialOptions.removeAt(index); }
  // --- End FormArray Helpers ---

  onSubmit(): void {
    if (this.eventForm.invalid || !this.eventId) {
      this.snackBar.open('Please fill all required fields correctly.', 'Close', { duration: 3000 });
      this.eventForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formValue = this.eventForm.value;
    const startDateTime = combineDateAndTime(formValue.startDate, formValue.startTime);
    const endDateTime = combineDateAndTime(formValue.endDate, formValue.endTime);

    if (!startDateTime || !endDateTime) {
      this.snackBar.open('Invalid date or time format.', 'Close', { duration: 3000 });
      this.isSubmitting = false;
      return;
    }

    // Create the update DTO (might need a specific EventUpdateDTO later)
    // Using Partial<Event> for now, adjust based on your API needs
    const updateData: Partial<Event> = {
      name: formValue.name,
      description: formValue.description,
      startDate: startDateTime.toISOString(),
      endDate: endDateTime.toISOString(),
      type: formValue.type,
      status: formValue.status,
      // clientId: formValue.clientId, // Handle how client is updated if necessary
      roomReservations: formValue.roomReservations.map((roomId: string) => ({ roomId })), // Map back to DTO structure if needed
      cateringOptions: formValue.cateringOptions,
      materialOptions: formValue.materialOptions,
      // tickets: [{...}] // Handle ticket updates if necessary
      imageUrl: formValue.imageUrl,
    };

    this.eventService.updateEvent(this.eventId, updateData).subscribe({
      next: (updatedEvent) => {
        this.snackBar.open(`Event "${updatedEvent.name}" updated successfully!`, 'Close', { duration: 3000 });
        this.router.navigate(['/admin/events']); // Navigate to details page
      },
      error: (err) => {
        console.error('Error updating event:', err);
        this.snackBar.open(`Error updating event: ${err.message || 'Unknown error'}`, 'Close', { duration: 5000 });
        this.isSubmitting = false;
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }
}

// --- Helper Functions (Copy from EventFormComponent or move to shared utils) ---
// Removed duplicate implementation of combineDateAndTime
// Removed duplicate declaration of dateTimeValidator

// --- Paste the full implementation of combineDateAndTime and dateTimeValidator here ---
function combineDateAndTime(date: Date | null, timeString: string | null): Date | null {
    if (!date || !timeString) return null;
    const timeParts = timeString.match(/^(\d{2}):(\d{2})$/);
    if (!timeParts) return null;
    const hours = parseInt(timeParts[1], 10);
    const minutes = parseInt(timeParts[2], 10);
    if (isNaN(hours) || hours < 0 || hours > 23 || isNaN(minutes) || minutes < 0 || minutes > 59) return null;
    const newDate = new Date(date);
    newDate.setHours(hours, minutes, 0, 0);
    return newDate;
}
export const dateTimeValidator: Validators = (control: AbstractControl): ValidationErrors | null => {
    const startDate = control.get('startDate')?.value;
    const startTime = control.get('startTime')?.value;
    const endDate = control.get('endDate')?.value;
    const endTime = control.get('endTime')?.value;
    const startDateTime = combineDateAndTime(startDate, startTime);
    const endDateTime = combineDateAndTime(endDate, endTime);
    return startDateTime && endDateTime && endDateTime <= startDateTime ? { dateTimeInvalid: true } : null;
};