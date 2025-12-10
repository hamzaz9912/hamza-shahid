
export interface Trip {
   id?: string;
   _id?: string;
  serialNumber: number;
  driverNumber: string;
  date: string;
  vehicleNumber: string;
  vehicleSize: string;
  weight: number;
  freight: number;
  officeFare: number;
  vehicleReceivedBilty: number;
  vehicleFare: number;
  laborCharges: number;
  exciseCharges: number;
  bonus: number;
  miscExpenses: number;
  dailyWages: number;
  extraWeight: number;
  partyBalance: number;
  partyReceived: number;
  brokerageCommission: number;
  vehicleBalance: number;
  vehicleAccount: string;
  additionalDetails: string;
  station: string;
  brokerName: string;
  partyName: string;
  productName: string;
  productQuantity: number;
  productUnit: string;
  productType: string;
  truckDimensions: string;
}

export enum PartyType {
    REGULAR = 'Regular',
    ONETIME = 'One-time'
}

export interface Party {
     id?: string;
     _id?: string;
    name: string;
    type: PartyType;
    contact: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    businessType: string;
    gstNumber: string;
    panNumber: string;
    debit: number;
    credit: number;
    outstandingBalance: number;
}

export interface Broker {
     id?: string;
     _id?: string;
    name: string;
    commission: number; // Percentage
    contact: string;
    station: string;
    debit: number;
    credit: number;
}

export interface Payment {
     id?: string;
     _id?: string;
    date: string;
    type: 'received' | 'paid';
    entityType: 'party' | 'broker';
    entityName: string;
    amount: number;
    description: string;
    reference?: string; // trip serial number or invoice number
}

export interface Owner {
     id?: string;
     _id?: string;
    name: string;
    trucks: {
        vehicleNumber: string;
        vehicleSize: string;
        dimensions: {
            length: number;
            width: number;
            height: number;
        };
        capacity: number;
        registrationDate: string;
        insuranceExpiry: string;
        fitnessExpiry: string;
        status: 'active' | 'inactive' | 'maintenance';
    }[];
    // Financial tracking
    debit: number; // Amount I owe to this owner
    credit: number; // Amount this owner owes me
    outstandingBalance: number; // Net balance (credit - debit)
    totalTrips: number; // Total number of trips completed
    totalEarnings: number; // Total amount earned from this owner
    totalPayments: number; // Total amount paid to this owner
}

export interface Labour {
     id?: string;
     _id?: string;
    cost: number;
    source: 'party' | 'self';
    selfName?: 'hamza' | 'shahid';
    partyName?: string;
    date: string;
    description: string;
}

export interface ProductReceive {
     id?: string;
     _id?: string;
    productName: string;
    quantity: number;
    unit: string;
    receivedFrom: string;
    date: string;
    productType: string;
    truckDimensions: string;
    description: string;
}

export type UserRole = 'Admin' | 'Staff';
