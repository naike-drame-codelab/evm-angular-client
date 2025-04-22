import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RoomService } from '../../../core/services/room.service';
import { Room, RoomType } from '../../../core/models/room.model';

@Component({
  selector: 'app-room-grid',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './room-grid.component.html',
  styleUrls: ['./room-grid.component.scss']
})
export class RoomGridComponent implements OnInit {
  rooms: Room[] = [];
  filteredRooms: Room[] = [];
  loading = true;
  searchTerm = '';
  typeFilter: RoomType | 'all' = 'all';
  capacityMin = 0;
  sortBy: 'name' | 'capacity' | 'rate' = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private roomService: RoomService) {}

  ngOnInit(): void {
    this.loadRooms();
  }

  loadRooms(): void {
    this.loading = true;
    this.roomService.getRooms().subscribe({
      next: (rooms) => {
        this.rooms = rooms;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading rooms', error);
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    let result = [...this.rooms];
    
    // Apply search filter
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(room => 
        room.name.toLowerCase().includes(term) || 
        room.description.toLowerCase().includes(term) ||
        room.amenities.some(amenity => amenity.toLowerCase().includes(term))
      );
    }
    
    // Apply type filter
    if (this.typeFilter !== 'all') {
      result = result.filter(room => room.roomType === this.typeFilter);
    }
    
    // Apply capacity filter
    if (this.capacityMin > 0) {
      result = result.filter(room => room.capacity >= this.capacityMin);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      
      if (this.sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (this.sortBy === 'capacity') {
        comparison = a.capacity - b.capacity;
      } else if (this.sortBy === 'rate') {
        comparison = a.hourlyRate - b.hourlyRate;
      }
      
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
    
    this.filteredRooms = result;
  }

  onSearch(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  onSortChange(): void {
    this.applyFilters();
  }

  toggleSortDirection(): void {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.applyFilters();
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  getRoomTypeIcon(type: RoomType): string {
    switch (type) {
      case RoomType.BALLROOM: return 'stars';
      case RoomType.CONFERENCE: return 'groups';
      case RoomType.MEETING: return 'business';
      case RoomType.BANQUET: return 'restaurant';
      case RoomType.THEATER: return 'theaters';
      case RoomType.OUTDOOR: return 'park';
      default: return 'room';
    }
  }
}