import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../../core/services/event.service';
import { Room } from '../../../core/models/room.model';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
@Component({
  selector: 'app-room-grid',
  standalone: true,
  imports: [CommonModule,
    RouterModule, // Add RouterModule
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    CurrencyPipe // Add CurrencyPipe
    ,],
  templateUrl: './room-grid.component.html',
  styleUrls: ['./room-grid.component.scss']
})
export class RoomGridComponent implements OnInit {
    private eventService = inject(EventService);

    rooms: Room[] = [];
    loading = true;
    error: string | null = null;
  
    // Mapping des IDs de salle aux URLs d'images
    roomImageMap: { [key: number]: string } = {
      1: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200&auto=format&fit=crop', // Grand Ballroom
      2: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1200&auto=format&fit=crop', // Conference Room A
      3: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1200&auto=format&fit=crop', // Meeting Room 1
      4: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=1200&auto=format&fit=crop', // Executive Suite (Nouvelle image)
      5: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=1200&auto=format&fit=crop'  // Training Room B
    };
    defaultRoomImage = 'assets/images/placeholder-room.jpg'; // Image par défaut
  
    ngOnInit(): void {
      this.loadRooms();
    }
  
    loadRooms(): void {
      this.loading = true;
      this.error = null;
      this.eventService.getRooms().subscribe({
        next: (data) => {
          this.rooms = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading rooms:', err);
          this.error = 'Failed to load rooms. Please try again later.';
          this.loading = false;
        }
      });
    }
  
    // Optional: Add a retry method
    retryLoadRooms(): void {
      this.loadRooms();
    }
  
    // Méthode pour obtenir l'URL de l'image
    getRoomImageUrl(roomId: number): string {
      return this.roomImageMap[roomId] || this.defaultRoomImage;
    }
  }