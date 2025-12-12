import { Trip, Party, Broker, Payment, Owner, Labour, ProductReceive } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Trips
  async getTrips(): Promise<Trip[]> {
    return this.request('/trips');
  }

  async createTrip(trip: Omit<Trip, 'id' | 'serialNumber'>): Promise<Trip> {
    return this.request('/trips', {
      method: 'POST',
      body: JSON.stringify(trip),
    });
  }

  async updateTrip(id: string, trip: Trip): Promise<Trip> {
    return this.request(`/trips/${id}`, {
      method: 'PUT',
      body: JSON.stringify(trip),
    });
  }

  async deleteTrip(id: string): Promise<void> {
    return this.request(`/trips/${id}`, {
      method: 'DELETE',
    });
  }

  // Parties
  async getParties(): Promise<Party[]> {
    return this.request('/parties');
  }

  async createParty(party: Omit<Party, 'id'>): Promise<Party> {
    return this.request('/parties', {
      method: 'POST',
      body: JSON.stringify(party),
    });
  }

  async updateParty(id: string, party: Party): Promise<Party> {
    return this.request(`/parties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(party),
    });
  }

  async deleteParty(id: string): Promise<void> {
    return this.request(`/parties/${id}`, {
      method: 'DELETE',
    });
  }

  // Brokers
  async getBrokers(): Promise<Broker[]> {
    return this.request('/brokers');
  }

  async createBroker(broker: Omit<Broker, 'id'>): Promise<Broker> {
    return this.request('/brokers', {
      method: 'POST',
      body: JSON.stringify(broker),
    });
  }

  async updateBroker(id: string, broker: Broker): Promise<Broker> {
    return this.request(`/brokers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(broker),
    });
  }

  async deleteBroker(id: string): Promise<void> {
    return this.request(`/brokers/${id}`, {
      method: 'DELETE',
    });
  }

  // Payments
  async getPayments(): Promise<Payment[]> {
    return this.request('/payments');
  }

  async createPayment(payment: Omit<Payment, 'id'>): Promise<Payment> {
    return this.request('/payments', {
      method: 'POST',
      body: JSON.stringify(payment),
    });
  }

  async deletePayment(id: string): Promise<void> {
    return this.request(`/payments/${id}`, {
      method: 'DELETE',
    });
  }

  // Owners
  async getOwners(): Promise<Owner[]> {
    return this.request('/owners');
  }

  async createOwner(owner: Omit<Owner, 'id'>): Promise<Owner> {
    return this.request('/owners', {
      method: 'POST',
      body: JSON.stringify(owner),
    });
  }

  async updateOwner(id: string, owner: Owner): Promise<Owner> {
    return this.request(`/owners/${id}`, {
      method: 'PUT',
      body: JSON.stringify(owner),
    });
  }

  async deleteOwner(id: string): Promise<void> {
    return this.request(`/owners/${id}`, {
      method: 'DELETE',
    });
  }

  // Labours
  async getLabours(): Promise<Labour[]> {
    return this.request('/labours');
  }

  async createLabour(labour: Omit<Labour, 'id'>): Promise<Labour> {
    return this.request('/labours', {
      method: 'POST',
      body: JSON.stringify(labour),
    });
  }

  async updateLabour(id: string, labour: Labour): Promise<Labour> {
    return this.request(`/labours/${id}`, {
      method: 'PUT',
      body: JSON.stringify(labour),
    });
  }

  async deleteLabour(id: string): Promise<void> {
    return this.request(`/labours/${id}`, {
      method: 'DELETE',
    });
  }

  // Product Receives
  async getProductReceives(): Promise<ProductReceive[]> {
    return this.request('/productReceives');
  }

  async createProductReceive(productReceive: Omit<ProductReceive, 'id'>): Promise<ProductReceive> {
    return this.request('/productReceives', {
      method: 'POST',
      body: JSON.stringify(productReceive),
    });
  }

  async updateProductReceive(id: string, productReceive: ProductReceive): Promise<ProductReceive> {
    return this.request(`/productReceives/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productReceive),
    });
  }

  async deleteProductReceive(id: string): Promise<void> {
    return this.request(`/productReceives/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();