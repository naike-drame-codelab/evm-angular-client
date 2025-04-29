import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Event, EventStatus } from '../../../core/models/event.model';
import { EventService } from '../../../core/services/event.service';

@Component({
  selector: 'app-event-form',
  imports: [
    CommonModule,
    ReactiveFormsModule, // Add ReactiveFormsModule here
    RouterModule
  ],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.scss'
})
export class EventFormComponent {
  eventForm!: FormGroup; // Use the definite assignment assertion (!)
  isSubmitting = false;
  errorMessage: string | null = null;
  // Define available event types and statuses (adjust as needed)
  eventTypes: string[] = ['conference', 'workshop', 'meeting', 'webinar', 'social'];
  eventStatuses = Object.values(EventStatus); // Get values from enum

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.eventForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      startDate: ['', Validators.required], // Consider separate date/time inputs or a datetime-local input
      startTime: ['', Validators.required],
      endDate: ['', Validators.required],
      endTime: ['', Validators.required],
      type: [this.eventTypes[0], Validators.required], // Default to the first type
      location: [''], // Optional field
      attendees: [0, [Validators.required, Validators.min(0)]],
      status: [EventStatus.PENDING, Validators.required] // Default status
    }, { validators: this.dateValidator }); // Add custom validator for dates if needed
  }

  // Custom validator example (optional): Ensure end date/time is after start date/time
  dateValidator(group: FormGroup): { [key: string]: boolean } | null {
    const startDate = group.get('startDate')?.value;
    const startTime = group.get('startTime')?.value;
    const endDate = group.get('endDate')?.value;
    const endTime = group.get('endTime')?.value;

    if (startDate && startTime && endDate && endTime) {
      const startDateTime = new Date(`${startDate}T${startTime}`);
      const endDateTime = new Date(`${endDate}T${endTime}`);
      if (endDateTime <= startDateTime) {
        return { 'endDateBeforeStartDate': true };
      }
    }
    return null;
  }


  // Helper getters for easier template access
  get title() { return this.eventForm.get('title'); }
  get description() { return this.eventForm.get('description'); }
  get startDate() { return this.eventForm.get('startDate'); }
  get startTime() { return this.eventForm.get('startTime'); }
  get endDate() { return this.eventForm.get('endDate'); }
  get endTime() { return this.eventForm.get('endTime'); }
  get type() { return this.eventForm.get('type'); }
  get attendees() { return this.eventForm.get('attendees'); }
  get status() { return this.eventForm.get('status'); }


  onSubmit(): void {
    // if (this.eventForm.invalid) {
    //   this.eventForm.markAllAsTouched(); // Mark fields to show validation errors
    //   this.errorMessage = "Please correct the errors in the form.";
    //   return;
    // }

    // this.isSubmitting = true;
    // this.errorMessage = null;

    // // Combine date and time fields before sending
    // const formValue = this.eventForm.value;
    // const eventPayload: Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'organizerId'> = {
    //   title: formValue.title,
    //   description: formValue.description,
    //   startDate: new Date(`${formValue.startDate}T${formValue.startTime}`),
    //   endDate: new Date(`${formValue.endDate}T${formValue.endTime}`),
    //   type: formValue.type,
    //   //location: formValue.location || '', // Ensure location is at least an empty string if optional
    //   attendees: Number(formValue.attendees), // Ensure attendees is a number
    //   status: formValue.status,
    //   // Add any other required properties from your Event model here,
      
    //   // initializing them appropriately (e.g., organizerId: null if applicable)
    // };


    // this.eventService.createEvent(eventPayload).subscribe({ // Ensure eventData matches the expected type
    //   next: (newEvent) => {
    //     console.log('Event created successfully:', newEvent);
    //     this.isSubmitting = false;
    //     // Navigate to the event list or the new event's detail page
    //     this.router.navigate(['/events']); // Or ['/events', newEvent.id] if ID is returned
    //   },
    //   error: (error) => {
    //     console.error('Error creating event:', error);
    //     this.errorMessage = 'Failed to create event. Please try again.'; // Provide user-friendly error
    //     this.isSubmitting = false;
    //   }
    // });
  }

  onCancel(): void {
    this.router.navigate(['/events']); // Navigate back to the list
  }
}
