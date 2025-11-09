
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Trip, Party, Broker, Payment, PartyType, UserRole } from '../types';

interface DataContextProps {
    trips: Trip[];
    parties: Party[];
    brokers: Broker[];
    payments: Payment[];
    userRole: UserRole;
    addTrip: (trip: Omit<Trip, 'id' | 'serialNumber'>) => void;
    updateTrip: (trip: Trip) => void;
    deleteTrip: (id: string) => void;
    addParty: (party: Omit<Party, 'id'>) => void;
    updateParty: (party: Party) => void;
    deleteParty: (id: string) => void;
    addBroker: (broker: Omit<Broker, 'id'>) => void;
    updateBroker: (broker: Broker) => void;
    deleteBroker: (id: string) => void;
    addPayment: (payment: Omit<Payment, 'id'>) => void;
    deletePayment: (id: string) => void;
    setUserRole: (role: UserRole) => void;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

const initialParties: Party[] = [
    { id: 'p1', name: 'Global Exports Inc.', type: PartyType.REGULAR, contact: '555-1234', address: '123 Export Lane', outstandingBalance: 150000 },
    { id: 'p2', name: 'Local Goods Co.', type: PartyType.REGULAR, contact: '555-5678', address: '456 Market St', outstandingBalance: 75000 },
    { id: 'p3', name: 'One-Time Shipment', type: PartyType.ONETIME, contact: '555-8765', address: '789 Warehouse Ave', outstandingBalance: 0 },
];

const initialBrokers: Broker[] = [
    { id: 'b1', name: 'Al-Fatah Goods Carrier', commission: 5, contact: '0300-1234567', station: 'North Hub' },
    { id: 'b2', name: 'Madina Cargo Services', commission: 4.5, contact: '0321-7654321', station: 'South Terminal' },
];

const initialPayments: Payment[] = [
    { id: 'p1', date: '2023-10-28', type: 'paid', entityType: 'broker', entityName: 'Al-Fatah Goods Carrier', amount: 2500, description: 'Partial payment for commission', reference: 'Trip #1001' },
    { id: 'p2', date: '2023-10-29', type: 'received', entityType: 'party', entityName: 'Global Exports Inc.', amount: 50000, description: 'Partial payment for freight', reference: 'Trip #1001' },
];

const initialTrips: Trip[] = [
    { id: 't1', serialNumber: 1001, driverNumber: 'D-456', date: '2023-10-26', vehicleNumber: 'TR-12345', vehicleSize: '40ft', weight: 25, freight: 120000, officeFare: 5000, vehicleReceivedBilty: 110000, vehicleFare: 100000, laborCharges: 2000, exciseCharges: 1500, bonus: 1000, miscExpenses: 500, dailyWages: 800, extraWeight: 2, partyBalance: 10000, partyReceived: 110000, brokerageCommission: 5500, vehicleBalance: 5000, vehicleAccount: 'AC-V1', additionalDetails: 'Handle with care', station: 'North Hub', brokerName: 'Al-Fatah Goods Carrier', partyName: 'Global Exports Inc.', mt: 25 },
    { id: 't2', serialNumber: 1002, driverNumber: 'D-789', date: '2023-10-27', vehicleNumber: 'TR-67890', vehicleSize: '20ft', weight: 15, freight: 80000, officeFare: 3000, vehicleReceivedBilty: 75000, vehicleFare: 70000, laborCharges: 1500, exciseCharges: 1000, bonus: 500, miscExpenses: 300, dailyWages: 800, extraWeight: 1, partyBalance: 5000, partyReceived: 75000, brokerageCommission: 3375, vehicleBalance: 2000, vehicleAccount: 'AC-V2', additionalDetails: 'Urgent delivery', station: 'South Terminal', brokerName: 'Madina Cargo Services', partyName: 'Local Goods Co.', mt: 15 },
];


export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [trips, setTrips] = useState<Trip[]>(initialTrips);
    const [parties, setParties] = useState<Party[]>(initialParties);
    const [brokers, setBrokers] = useState<Broker[]>(initialBrokers);
    const [payments, setPayments] = useState<Payment[]>(initialPayments);
    const [userRole, setUserRole] = useState<UserRole>('Admin');

    const addTrip = (trip: Omit<Trip, 'id' | 'serialNumber'>) => {
        const newTrip: Trip = {
            ...trip,
            id: `t${Date.now()}`,
            serialNumber: (trips.length > 0 ? Math.max(...trips.map(t => t.serialNumber)) : 1000) + 1,
        };
        setTrips(prev => [newTrip, ...prev]);
    };

    const updateTrip = (updatedTrip: Trip) => {
        setTrips(prev => prev.map(trip => trip.id === updatedTrip.id ? updatedTrip : trip));
    };

    const deleteTrip = (id: string) => {
        setTrips(prev => prev.filter(trip => trip.id !== id));
    };
    
    // Party Management
    const addParty = (party: Omit<Party, 'id'>) => {
        const newParty: Party = { ...party, id: `p${Date.now()}`};
        setParties(prev => [newParty, ...prev]);
    };

    const updateParty = (updatedParty: Party) => {
        setParties(prev => prev.map(party => party.id === updatedParty.id ? updatedParty : party));
    };

    const deleteParty = (id: string) => {
        setParties(prev => prev.filter(party => party.id !== id));
    };

    // Broker Management
    const addBroker = (broker: Omit<Broker, 'id'>) => {
        const newBroker: Broker = { ...broker, id: `b${Date.now()}`};
        setBrokers(prev => [newBroker, ...prev]);
    };

    const updateBroker = (updatedBroker: Broker) => {
        setBrokers(prev => prev.map(broker => broker.id === updatedBroker.id ? updatedBroker : broker));
    };

    const deleteBroker = (id: string) => {
        setBrokers(prev => prev.filter(broker => broker.id !== id));
    };

    // Payment Management
    const addPayment = (payment: Omit<Payment, 'id'>) => {
        const newPayment: Payment = { ...payment, id: `pay${Date.now()}`};
        setPayments(prev => [newPayment, ...prev]);
    };

    const deletePayment = (id: string) => {
        setPayments(prev => prev.filter(payment => payment.id !== id));
    };


    return (
        <DataContext.Provider value={{
            trips, parties, brokers, payments, userRole,
            addTrip, updateTrip, deleteTrip,
            addParty, updateParty, deleteParty,
            addBroker, updateBroker, deleteBroker,
            addPayment, deletePayment,
            setUserRole
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = (): DataContextProps => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
