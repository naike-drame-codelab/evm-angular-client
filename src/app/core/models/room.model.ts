export interface Room {
    id: number; // Changed from string to number to match C# int Id
    name: string;
    capacity: number;
    pricePerHour: number; // Renamed from hourlyRate to match C# PricePerHour (decimal maps to number)
    description: string;
    isAvailable: boolean; // Renamed from isActive to match C# IsAvailable
  }
