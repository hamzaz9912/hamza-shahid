
export interface Trip {
  id: string;
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
  mt: number;
}

export enum PartyType {
    REGULAR = 'Regular',
    ONETIME = 'One-time'
}

export interface Party {
    id: string;
    name: string;
    type: PartyType;
    contact: string;
    address: string;
    outstandingBalance: number;
}

export interface Broker {
    id: string;
    name: string;
    commission: number; // Percentage
    contact: string;
    station: string;
}

export interface Payment {
    id: string;
    date: string;
    type: 'received' | 'paid';
    entityType: 'party' | 'broker';
    entityName: string;
    amount: number;
    description: string;
    reference?: string; // trip serial number or invoice number
}

export type UserRole = 'Admin' | 'Staff';
