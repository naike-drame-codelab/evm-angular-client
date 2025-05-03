import { Component } from '@angular/core';

@Component({
  selector: 'app-event-edit',
  imports: [],
  templateUrl: './event-edit.component.html',
  styleUrl: './event-edit.component.scss'
})
export class EventEditComponent {

}

/*
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from './event.service';
import { EventDetailsDTO, Room, Material, Catering } from './models';

@Component({
  selector: 'app-edit-event',
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
            [checked]="selectedRooms.includes(room.id)"
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
            [checked]="selectedMaterials.includes(material.id)"
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
            [checked]="selectedCaterings.includes(catering.id)"
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

      <button type="submit" [disabled]="eventForm.invalid">Update Event</button>
    </form>
  `,
})
export class EditEventComponent implements OnInit {
  eventForm!: FormGroup;
  eventId!: string;
  rooms: Room[] = [];
  materials: Material[] = [];
  caterings: Catering[] = [];
  selectedRooms: number[] = [];
  selectedMaterials: number[] = [];
  selectedCaterings: number[] = [];

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('id')!;
    this.initializeForm();
    this.loadEventDetails();
    this.loadRooms();
    this.loadMaterials();
    this.loadCaterings();
  }

  initializeForm(): void {
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
  }

  loadEventDetails(): void {
    this.eventService.getEventDetails(this.eventId).subscribe((event: EventDetailsDTO) => {
      this.eventForm.patchValue({
        name: event.name,
        clientId: event.clientId,
        startDate: event.startDate,
        endDate: event.endDate,
        type: event.type,
        status: event.status,
        description: event.description,
        imageUrl: event.imageUrl,
      });

      // Populate room reservations
      this.selectedRooms = event.roomReservations.map((r) => r.roomId);
      const roomReservations = this.eventForm.get('roomReservations') as FormArray;
      this.selectedRooms.forEach((roomId) => roomReservations.push(this.fb.control(roomId)));

      // Populate material options
      this.selectedMaterials = event.materialOptions?.map((m) => m.materialId) || [];
      const materialOptions = this.eventForm.get('materialOptions') as FormArray;
      event.materialOptions?.forEach((m) =>
        materialOptions.push(
          this.fb.group({
            materialId: [m.materialId],
            quantity: [m.quantity, Validators.required],
          })
        )
      );

      // Populate catering options
      this.selectedCaterings = event.cateringOptions?.map((c) => c.cateringId) || [];
      const cateringOptions = this.eventForm.get('cateringOptions') as FormArray;
      event.cateringOptions?.forEach((c) =>
        cateringOptions.push(
          this.fb.group({
            cateringId: [c.cateringId],
            numberOfPeople: [c.numberOfPeople, Validators.required],
          })
        )
      );
    });
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
      const index = roomReservations.controls.findIndex((x) => x.value === event.target.value);
      roomReservations.removeAt(index);
    }
  }

  onMaterialSelectionChange(event: any, material: Material): void {
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
      this.selectedMaterials = this.selectedMaterials.filter((id) => id !== material.id);
      const index = materialOptions.controls.findIndex((x) => x.get('materialId')?.value === material.id);
      materialOptions.removeAt(index);
    }
  }

  onMaterialQuantityChange(materialId: number, quantity: number): void {
    const materialOptions = this.eventForm.get('materialOptions') as FormArray;
    const material = materialOptions.controls.find((x) => x.get('materialId')?.value === materialId);
    if (material) {
      material.get('quantity')?.setValue(quantity);
    }
  }

  onCateringSelectionChange(event: any, catering: Catering): void {
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
      this.selectedCaterings = this.selectedCaterings.filter((id) => id !== catering.id);
      const index = cateringOptions.controls.findIndex((x) => x.get('cateringId')?.value === catering.id);
      cateringOptions.removeAt(index);
    }
  }

  onCateringPeopleChange(cateringId: number, numberOfPeople: number): void {
    const cateringOptions = this.eventForm.get('cateringOptions') as FormArray;
    const catering = cateringOptions.controls.find((x) => x.get('cateringId')?.value === cateringId);
    if (catering) {
      catering.get('numberOfPeople')?.setValue(numberOfPeople);
    }
  }

  onSubmit(): void {
    if (this.eventForm.valid) {
      this.eventService.updateEvent(this.eventId, this.eventForm.value).subscribe(() => {
        this.router.navigate(['/events']);
      });
    }
  }
}
*/