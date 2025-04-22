import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Client } from '../models/client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private mockClients: Client[] = [
    {
      id: '1',
      name: 'John Smith',
      company: 'XYZ Corporation',
      email: 'john.smith@example.com',
      phone: '(555) 123-4567',
      address: '123 Corporate Ave, New York, NY 10001',
      notes: 'Prefers communication via email. Has been a client for 3 years.',
      events: ['1', '4'],
      createdAt: new Date(2022, 5, 10),
      updatedAt: new Date(2024, 2, 15)
    },
    {
      id: '2',
      name: 'Emily Johnson',
      email: 'emily.johnson@example.com',
      phone: '(555) 987-6543',
      address: '456 Wedding Ln, Los Angeles, CA 90001',
      notes: 'Wedding planner has direct contact.',
      events: ['2'],
      createdAt: new Date(2023, 8, 15),
      updatedAt: new Date(2024, 1, 20)
    },
    {
      id: '3',
      name: 'Michael Chen',
      company: 'Tech Innovations LLC',
      email: 'michael.chen@example.com',
      phone: '(555) 456-7890',
      address: '789 Technology Pkwy, San Francisco, CA 94105',
      events: ['3'],
      createdAt: new Date(2023, 10, 5),
      updatedAt: new Date(2024, 3, 10)
    },
    {
      id: '4',
      name: 'Sarah Williams',
      company: 'Media Inc.',
      email: 'sarah.williams@example.com',
      phone: '(555) 234-5678',
      address: '101 Media Blvd, Chicago, IL 60601',
      notes: 'Has specific AV requirements for all events.',
      events: ['4'],
      createdAt: new Date(2023, 4, 22),
      updatedAt: new Date(2024, 2, 8)
    },
    {
      id: '5',
      name: 'Robert Davis',
      company: 'Global Finance Group',
      email: 'robert.davis@example.com',
      phone: '(555) 345-6789',
      address: '202 Finance St, Boston, MA 02110',
      notes: 'Requires confidentiality agreements for all events.',
      events: ['5'],
      createdAt: new Date(2022, 11, 10),
      updatedAt: new Date(2024, 0, 15)
    }
  ];

  constructor() { }

  getClients(): Observable<Client[]> {
    return of(this.mockClients).pipe(delay(500));
  }

  getClientById(id: string): Observable<Client | undefined> {
    const client = this.mockClients.find(c => c.id === id);
    return of(client).pipe(delay(300));
  }

  createClient(client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Observable<Client> {
    const newClient: Client = {
      ...client,
      id: (this.mockClients.length + 1).toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.mockClients.push(newClient);
    return of(newClient).pipe(delay(500));
  }

  updateClient(client: Client): Observable<Client> {
    const index = this.mockClients.findIndex(c => c.id === client.id);
    if (index !== -1) {
      this.mockClients[index] = {
        ...client,
        updatedAt: new Date()
      };
      return of(this.mockClients[index]).pipe(delay(500));
    }
    throw new Error('Client not found');
  }

  deleteClient(id: string): Observable<boolean> {
    const index = this.mockClients.findIndex(c => c.id === id);
    if (index !== -1) {
      this.mockClients.splice(index, 1);
      return of(true).pipe(delay(500));
    }
    return of(false).pipe(delay(500));
  }

  searchClients(term: string): Observable<Client[]> {
    if (!term.trim()) {
      return of([]);
    }
    
    term = term.toLowerCase();
    const filteredClients = this.mockClients.filter(client => 
      client.name.toLowerCase().includes(term) ||
      (client.company && client.company.toLowerCase().includes(term)) ||
      client.email.toLowerCase().includes(term)
    );
    
    return of(filteredClients).pipe(delay(300));
  }

  getTotalClients(): Observable<number> {
    return of(this.mockClients.length).pipe(delay(300));
  }

  getRecentClients(limit: number = 5): Observable<Client[]> {
    const sortedClients = [...this.mockClients].sort(
      (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
    ).slice(0, limit);
    
    return of(sortedClients).pipe(delay(500));
  }
}