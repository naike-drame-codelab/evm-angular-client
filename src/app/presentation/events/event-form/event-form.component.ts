import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
// export class EventFormComponent {
//   eventForm!: FormGroup; // Use the definite assignment assertion (!)
//   isSubmitting = false;
//   errorMessage: string | null = null;
//   // Define available event types and statuses (adjust as needed)
//   eventTypes: string[] = ['conference', 'workshop', 'meeting', 'webinar', 'social'];
//   eventStatuses = Object.values(EventStatus); // Get values from enum

//   constructor(
//     private fb: FormBuilder,
//     private eventService: EventService,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     this.initializeForm();
//   }

//   initializeForm(): void {
//     this.eventForm = this.fb.group({
//       title: ['', [Validators.required, Validators.minLength(3)]],
//       description: ['', [Validators.required, Validators.maxLength(500)]],
//       startDate: ['', Validators.required], // Consider separate date/time inputs or a datetime-local input
//       startTime: ['', Validators.required],
//       endDate: ['', Validators.required],
//       endTime: ['', Validators.required],
//       type: [this.eventTypes[0], Validators.required], // Default to the first type
//       location: [''], // Optional field
//       attendees: [0, [Validators.required, Validators.min(0)]],
//       status: [EventStatus.PENDING, Validators.required] // Default status
//     }, { validators: this.dateValidator }); // Add custom validator for dates if needed
//   }

//   // Custom validator example (optional): Ensure end date/time is after start date/time
//   dateValidator(group: FormGroup): { [key: string]: boolean } | null {
//     const startDate = group.get('startDate')?.value;
//     const startTime = group.get('startTime')?.value;
//     const endDate = group.get('endDate')?.value;
//     const endTime = group.get('endTime')?.value;

//     if (startDate && startTime && endDate && endTime) {
//       const startDateTime = new Date(`${startDate}T${startTime}`);
//       const endDateTime = new Date(`${endDate}T${endTime}`);
//       if (endDateTime <= startDateTime) {
//         return { 'endDateBeforeStartDate': true };
//       }
//     }
//     return null;
//   }


//   // Helper getters for easier template access
//   get title() { return this.eventForm.get('title'); }
//   get description() { return this.eventForm.get('description'); }
//   get startDate() { return this.eventForm.get('startDate'); }
//   get startTime() { return this.eventForm.get('startTime'); }
//   get endDate() { return this.eventForm.get('endDate'); }
//   get endTime() { return this.eventForm.get('endTime'); }
//   get type() { return this.eventForm.get('type'); }
//   get attendees() { return this.eventForm.get('attendees'); }
//   get status() { return this.eventForm.get('status'); }


    export class EventFormComponent  {
      eventForm = inject(FormBuilder);
      eventService = inject(EventService);
      router = inject(Router);
    
      rooms: any[] = [];
      materials: any[] = [];
      caterings: any[] = [];
      selectedMaterials: number[] = [];
      selectedCaterings: number[] = [];
    
      constructor(){
      this.loadRooms();
        this.loadMaterials();
        this.loadCaterings();
      }
    
     
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
        }, { validators: this.dateValidator });
    
        
      
    
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
   
  `,
})


*/