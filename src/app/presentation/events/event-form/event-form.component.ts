import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray, AbstractControl, ValidationErrors } from '@angular/forms'; // Import validation types
import { Router, RouterModule } from '@angular/router'; // Remove EventType from here
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
import { Client } from '../../../core/models/client.model'; // Define these models
import { EventCreateDTO, CateringOptionCreateDTO, MaterialOptionCreateDTO } from '../../../core/models/event-create.model'; // Import DTOs
import { EventStatus, EventType } from '../../../core/models/event.model'; // Import EventType
import { Room } from '../../../core/models/room.model';
import { Catering } from '../../../core/models/catering.model'; // Import Catering model
import { Material } from '../../../core/models/material.model'; // Import Material model
import { ClientService } from '../../../core/services/client.service';
import { EventService } from '../../../core/services/event.service';
// import { RoomService } from '../../../core/services/room.service';


@Component({
    selector: 'app-event-form',
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
    templateUrl: './event-form.component.html',
    styleUrls: ['./event-form.component.scss']
})
export class EventFormComponent implements OnInit {
    private fb = inject(FormBuilder);
    private eventService = inject(EventService);
    private clientService = inject(ClientService); // Inject other services
    // private roomService = inject(RoomService);     // Inject other services
    private router = inject(Router);
    private snackBar = inject(MatSnackBar);

    eventForm!: FormGroup;
    isSubmitting = false;
    loadingData = true;

    // Data for dropdowns
    eventTypes = Object.values(EventType);
    eventStatuses = Object.values(EventStatus);
    clients: Client[] = [];
    rooms: Room[] = [];
    caterings: Catering[] = []; // Use specific type
    materials: Material[] = []; // Use specific type
    // materials: Material[] = []; // Load if needed
    // caterings: Catering[] = []; // Load if needed

    ngOnInit(): void {
        this.buildForm();
        this.loadDropdownData();
    }

    buildForm(): void {
        this.eventForm = this.fb.group({
            name: ['', [Validators.required, Validators.maxLength(100)]],
            description: ['', Validators.required],
            startDate: [null, Validators.required], // Date only
            startTime: ['', Validators.required], // Time only HH:mm
            endDate: [null, Validators.required],   // Date only
            endTime: ['', Validators.required],   // Time only HH:mm
            type: [null, Validators.required],
            status: [EventStatus.Upcoming, Validators.required], // Default status
            clientId: [null, Validators.required],
            roomReservations: [[], [Validators.required, Validators.minLength(1)]], // Array of room IDs
            cateringOptions: this.fb.array([]), // Initialize FormArray for catering
            materialOptions: this.fb.array([]),
            ticketPrice: [0, [Validators.required, Validators.min(0)]],
            ticketQuantity: [0, [Validators.required, Validators.min(1)]],
            imageUrl: [''],
        }, { validators: dateTimeValidator }); // Add custom validator for date/time logic
    }

    loadDropdownData(): void {
        this.loadingData = true;
        // TODO: Consider using forkJoin for concurrent loading and better loading state management
        this.clientService.getClients().subscribe(data => {
            this.clients = data;
            // TODO: Add error handling
        });
        this.eventService.getRooms().subscribe(data => {
            this.rooms = data;
            this.loadingData = false;
        });
        this.eventService.getCaterings().subscribe(data => {
            this.caterings = data;
            // TODO: Add error handling
        });
        // Load materials and caterings if needed
        this.eventService.getMaterials().subscribe(data => {
            this.materials = data;
        });
    }

    // --- FormArray Helpers for Catering ---
    get cateringOptions(): FormArray {
        return this.eventForm.get('cateringOptions') as FormArray;
    }

    get materialOptions(): FormArray {
        return this.eventForm.get('materialOptions') as FormArray;
    }

    newCateringOption(): FormGroup {
        return this.fb.group({
            cateringId: [null, Validators.required], // Use null for number type
            numberOfPeople: [1, [Validators.required, Validators.min(1)]]
        });
    }

    addCateringOption(): void {
        this.cateringOptions.push(this.newCateringOption());
    }

    removeCateringOption(index: number): void {
        this.cateringOptions.removeAt(index);
    }

    newMaterialOption(): FormGroup {
        return this.fb.group({
            materialId: [null, Validators.required], // Use null for number/string ID type
            quantity: [1, [Validators.required, Validators.min(1)]] // Changed to quantity
        });
    }

    addMaterialOption(): void {
        this.materialOptions.push(this.newMaterialOption()); // Corrected method call
    }

    removeMaterialOption(index: number): void {
        this.materialOptions.removeAt(index);
    }

    onSubmit(): void {
        if (this.eventForm.invalid) {
            this.snackBar.open('Please fill all required fields correctly.', 'Close', { duration: 3000 });
            this.eventForm.markAllAsTouched(); // Highlight errors
            return;
        }

        this.isSubmitting = true;

        const formValue = this.eventForm.value;

        // Combine Date and Time
        const startDateTime = combineDateAndTime(formValue.startDate, formValue.startTime);
        const endDateTime = combineDateAndTime(formValue.endDate, formValue.endTime);

        if (!startDateTime || !endDateTime) {
            this.snackBar.open('Invalid date or time format.', 'Close', { duration: 3000 });
            this.isSubmitting = false;
            return;
        }

        // Ensure dates are in a suitable format (e.g., ISO string) if needed by API
        const dto: EventCreateDTO = {
            ...formValue,
            // Use combined values
            startDate: startDateTime.toISOString(),
            endDate: endDateTime.toISOString(),
            // Map material/catering options if using FormArrays
        };

        this.eventService.createEvent(dto).subscribe({
            next: (createdEvent) => {
                this.snackBar.open(`Event "${createdEvent.name}" created successfully!`, 'Close', { duration: 3000 });
                this.router.navigate(['/events', createdEvent.id]); // Navigate to details page
            },
            error: (err) => {
                console.error('Error creating event:', err);
                this.snackBar.open(`Error creating event: ${err.message || 'Unknown error'}`, 'Close', { duration: 5000 });
                this.isSubmitting = false;
            },
            complete: () => {
                this.isSubmitting = false;
            }
        });
    }

    // Helper methods for FormArrays if used (e.g., addMaterialOption, removeMaterialOption)
}

// --- Helper Functions ---

/**
 * Combines a Date object (date part) and a time string (HH:mm) into a new Date object.
 * @param date The date object.
 * @param timeString The time string in HH:mm format.
 * @returns A new Date object with combined date and time, or null if inputs are invalid.
 */
function combineDateAndTime(date: Date | null, timeString: string | null): Date | null {
    if (!date || !timeString) return null;

    const timeParts = timeString.match(/^(\d{2}):(\d{2})$/);
    if (!timeParts) return null; // Invalid time format

    const hours = parseInt(timeParts[1], 10);
    const minutes = parseInt(timeParts[2], 10);

    if (isNaN(hours) || hours < 0 || hours > 23 || isNaN(minutes) || minutes < 0 || minutes > 59) {
        return null; // Invalid time values
    }

    const newDate = new Date(date);
    newDate.setHours(hours, minutes, 0, 0); // Set hours and minutes, reset seconds/ms
    return newDate;
}

/**
 * Custom validator to check if end date/time is after start date/time.
 */
export const dateTimeValidator: Validators = (control: AbstractControl): ValidationErrors | null => {
    const startDate = control.get('startDate')?.value;
    const startTime = control.get('startTime')?.value;
    const endDate = control.get('endDate')?.value;
    const endTime = control.get('endTime')?.value;

    const startDateTime = combineDateAndTime(startDate, startTime);
    const endDateTime = combineDateAndTime(endDate, endTime);

    return startDateTime && endDateTime && endDateTime <= startDateTime
        ? { dateTimeInvalid: true } // Return error if end is not after start
        : null; // Return null if valid or not enough info yet
};
