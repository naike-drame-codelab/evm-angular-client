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

//     import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
// import { EventService } from './event.service';

// @Component({
//   selector: 'app-create-event',
//   templateUrl: './create-event.component.html',
// })
// export class CreateEventComponent implements OnInit {
//   eventForm: FormGroup;
//   rooms: any[] = [];
//   materials: any[] = [];
//   caterings: any[] = [];

//   constructor(private fb: FormBuilder, private eventService: EventService) {
//     this.eventForm = this.fb.group({
//       name: ['', Validators.required],
//       startDate: ['', Validators.required],
//       endDate: ['', Validators.required],
//       roomId: ['', Validators.required],
//       materialOptions: this.fb.array([]),
//       cateringOptions: this.fb.array([]),
//     });
//   }

//   ngOnInit(): void {
//     this.loadRooms();
//     this.loadMaterials();
//     this.loadCaterings();
//   }

//   loadRooms(): void {
//     this.eventService.getRooms().subscribe((data) => {
//       this.rooms = data;
//     });
//   }

//   loadMaterials(): void {
//     this.eventService.getMaterials().subscribe((data) => {
//       this.materials = data;
//       this.initializeMaterialOptions();
//     });
//   }

//   loadCaterings(): void {
//     this.eventService.getCaterings().subscribe((data) => {
//       this.caterings = data;
//       this.initializeCateringOptions();
//     });
//   }

//   initializeMaterialOptions(): void {
//     const materialArray = this.eventForm.get('materialOptions') as FormArray;
//     this.materials.forEach(() => materialArray.push(new FormControl(false)));
//   }

//   initializeCateringOptions(): void {
//     const cateringArray = this.eventForm.get('cateringOptions') as FormArray;
//     this.caterings.forEach(() => cateringArray.push(new FormControl(false)));
//   }

//   onSubmit(): void {
//     if (this.eventForm.valid) {
//       const selectedMaterials = this.eventForm.value.materialOptions
//         .map((checked: boolean, i: number) => (checked ? this.materials[i] : null))
//         .filter((v: any) => v !== null);

//       const selectedCaterings = this.eventForm.value.cateringOptions
//         .map((checked: boolean, i: number) => (checked ? this.caterings[i] : null))
//         .filter((v: any) => v !== null);

//       const eventData = {
//         ...this.eventForm.value,
//         materialOptions: selectedMaterials,
//         cateringOptions: selectedCaterings,
//       };

//       console.log('Event Data:', eventData);
//     }
//   }
// }

  }

  onCancel(): void {
    this.router.navigate(['/events']); // Navigate back to the list
  }
}

/*
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { EventService } from './event.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="eventForm" (ngSubmit)="onSubmit()">
      <div>
        <label for="name">Event Name</label>
        <input id="name" formControlName="name" />
      </div>

      <div>
        <label for="clientId">Client ID</label>
        <input id="clientId" formControlName="clientId" type="number" />
      </div>

      <div>
        <label for="startDate">Start Date</label>
        <input id="startDate" formControlName="startDate" type="datetime-local" />
      </div>

      <div>
        <label for="endDate">End Date</label>
        <input id="endDate" formControlName="endDate" type="datetime-local" />
      </div>

      <div>
        <label for="type">Event Type</label>
        <select id="type" formControlName="type">
          <option value="Conference">Conference</option>
          <option value="Corporate">Corporate</option>
          <option value="Wedding">Wedding</option>
        </select>
      </div>

      <div>
        <label for="status">Event Status</label>
        <select id="status" formControlName="status">
          <option value="0">Pending</option>
          <option value="1">Confirmed</option>
          <option value="2">Cancelled</option>
        </select>
      </div>

      <div>
        <label for="description">Description</label>
        <textarea id="description" formControlName="description"></textarea>
      </div>

      <div>
        <label for="imageUrl">Image URL</label>
        <input id="imageUrl" formControlName="imageUrl" />
      </div>

      <div>
        <label>Room Reservations</label>
        <div *ngFor="let room of rooms">
          <input
            type="checkbox"
            [value]="room.id"
            (change)="onRoomSelectionChange($event)"
          />
          {{ room.name }}
        </div>
      </div>

      <div>
        <label>Material Options</label>
        <div *ngFor="let material of materials">
          <input
            type="checkbox"
            [value]="material.id"
            (change)="onMaterialSelectionChange($event, material)"
          />
          {{ material.name }}
          <input
            *ngIf="selectedMaterials.includes(material.id)"
            type="number"
            placeholder="Quantity"
            (input)="onMaterialQuantityChange(material.id, $event.target.value)"
          />
        </div>
      </div>

      <div>
        <label>Catering Options</label>
        <div *ngFor="let catering of caterings">
          <input
            type="checkbox"
            [value]="catering.id"
            (change)="onCateringSelectionChange($event, catering)"
          />
          {{ catering.name }}
          <input
            *ngIf="selectedCaterings.includes(catering.id)"
            type="number"
            placeholder="Number of People"
            (input)="onCateringPeopleChange(catering.id, $event.target.value)"
          />
        </div>
      </div>

      <button type="submit" [disabled]="eventForm.invalid">Create Event</button>
    </form>
  `,
})
export class EventFormComponent implements OnInit {
  eventForm!: FormGroup;
  rooms: any[] = [];
  materials: any[] = [];
  caterings: any[] = [];
  selectedMaterials: number[] = [];
  selectedCaterings: number[] = [];

  constructor(private fb: FormBuilder, private eventService: EventService) {}

  ngOnInit(): void {
    this.eventForm = this.fb.group({
      name: ['', Validators.required],
      clientId: [null, [Validators.required, Validators.min(1)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      type: ['', Validators.required],
      status: [0, Validators.required],
      description: [''],
      imageUrl: [''],
      roomReservations: this.fb.array([], Validators.required),
      materialOptions: this.fb.array([]),
      cateringOptions: this.fb.array([]),
    });

    this.loadRooms();
    this.loadMaterials();
    this.loadCaterings();
  }

  loadRooms(): void {
    this.eventService.getRooms().subscribe((data) => (this.rooms = data));
  }

  loadMaterials(): void {
    this.eventService.getMaterials().subscribe((data) => (this.materials = data));
  }

  loadCaterings(): void {
    this.eventService.getCaterings().subscribe((data) => (this.caterings = data));
  }

  onRoomSelectionChange(event: any): void {
    const roomReservations = this.eventForm.get('roomReservations') as FormArray;
    if (event.target.checked) {
      roomReservations.push(this.fb.control(event.target.value));
    } else {
      const index = roomReservations.controls.findIndex(
        (x) => x.value === event.target.value
      );
      roomReservations.removeAt(index);
    }
  }

  onMaterialSelectionChange(event: any, material: any): void {
    const materialOptions = this.eventForm.get('materialOptions') as FormArray;
    if (event.target.checked) {
      this.selectedMaterials.push(material.id);
      materialOptions.push(
        this.fb.group({
          materialId: [material.id],
          quantity: [1, Validators.required],
        })
      );
    } else {
      this.selectedMaterials = this.selectedMaterials.filter(
        (id) => id !== material.id
      );
      const index = materialOptions.controls.findIndex(
        (x) => x.get('materialId')?.value === material.id
      );
      materialOptions.removeAt(index);
    }
  }

  onMaterialQuantityChange(materialId: number, quantity: number): void {
    const materialOptions = this.eventForm.get('materialOptions') as FormArray;
    const material = materialOptions.controls.find(
      (x) => x.get('materialId')?.value === materialId
    );
    if (material) {
      material.get('quantity')?.setValue(quantity);
    }
  }

  onCateringSelectionChange(event: any, catering: any): void {
    const cateringOptions = this.eventForm.get('cateringOptions') as FormArray;
    if (event.target.checked) {
      this.selectedCaterings.push(catering.id);
      cateringOptions.push(
        this.fb.group({
          cateringId: [catering.id],
          numberOfPeople: [1, Validators.required],
        })
      );
    } else {
      this.selectedCaterings = this.selectedCaterings.filter(
        (id) => id !== catering.id
      );
      const index = cateringOptions.controls.findIndex(
        (x) => x.get('cateringId')?.value === catering.id
      );
      cateringOptions.removeAt(index);
    }
  }

  onCateringPeopleChange(cateringId: number, numberOfPeople: number): void {
    const cateringOptions = this.eventForm.get('cateringOptions') as FormArray;
    const catering = cateringOptions.controls.find(
      (x) => x.get('cateringId')?.value === cateringId
    );
    if (catering) {
      catering.get('numberOfPeople')?.setValue(numberOfPeople);
    }
  }

  onSubmit(): void {
    if (this.eventForm.valid) {
      this.eventService.createEvent(this.eventForm.value).subscribe((response) => {
        console.log('Event created successfully:', response);
      });
    }
  }
}

*/