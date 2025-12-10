
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Trip, Party, Broker, Payment, PartyType, UserRole, Owner, Labour, ProductReceive } from '../types';

interface DataContextProps {
     trips: Trip[];
     parties: Party[];
     brokers: Broker[];
     payments: Payment[];
     owners: Owner[];
     labours: Labour[];
     productReceives: ProductReceive[];
     userRole: UserRole;
     loading: boolean;
     addTrip: (trip: Omit<Trip, 'id' | 'serialNumber'>) => Promise<void>;
     updateTrip: (trip: Trip) => Promise<void>;
     deleteTrip: (id: string) => Promise<void>;
     addParty: (party: Omit<Party, 'id'>) => Promise<void>;
     updateParty: (party: Party) => Promise<void>;
     deleteParty: (id: string) => Promise<void>;
     addBroker: (broker: Omit<Broker, 'id'>) => Promise<void>;
     updateBroker: (broker: Broker) => Promise<void>;
     deleteBroker: (id: string) => Promise<void>;
     addPayment: (payment: Omit<Payment, 'id'>) => Promise<void>;
     deletePayment: (id: string) => Promise<void>;
     addOwner: (owner: Omit<Owner, 'id'>) => Promise<void>;
     updateOwner: (owner: Owner) => Promise<void>;
     deleteOwner: (id: string) => Promise<void>;
     addLabour: (labour: Omit<Labour, 'id'>) => Promise<void>;
     updateLabour: (labour: Labour) => Promise<void>;
     deleteLabour: (id: string) => Promise<void>;
     addProductReceive: (productReceive: Omit<ProductReceive, 'id'>) => Promise<void>;
     updateProductReceive: (productReceive: ProductReceive) => Promise<void>;
     deleteProductReceive: (id: string) => Promise<void>;
     setUserRole: (role: UserRole) => void;
     refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

const API_BASE_URL = 'http://localhost:5000/api';


export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
     const [trips, setTrips] = useState<Trip[]>([]);
     const [parties, setParties] = useState<Party[]>([]);
     const [brokers, setBrokers] = useState<Broker[]>([]);
     const [payments, setPayments] = useState<Payment[]>([]);
     const [owners, setOwners] = useState<Owner[]>([]);
     const [labours, setLabours] = useState<Labour[]>([]);
     const [productReceives, setProductReceives] = useState<ProductReceive[]>([]);
     const [userRole, setUserRole] = useState<UserRole>('Admin');
     const [loading, setLoading] = useState<boolean>(true);

     // API helper functions
     const fetchData = async (endpoint: string) => {
         const response = await fetch(`${API_BASE_URL}${endpoint}`);
         if (!response.ok) throw new Error(`Failed to fetch ${endpoint}`);
         return response.json();
     };

     const postData = async (endpoint: string, data: any) => {
         const response = await fetch(`${API_BASE_URL}${endpoint}`, {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify(data)
         });
         if (!response.ok) throw new Error(`Failed to create ${endpoint}`);
         return response.json();
     };

     const putData = async (endpoint: string, data: any) => {
         const response = await fetch(`${API_BASE_URL}${endpoint}`, {
             method: 'PUT',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify(data)
         });
         if (!response.ok) throw new Error(`Failed to update ${endpoint}`);
         return response.json();
     };

     const deleteData = async (endpoint: string) => {
         const response = await fetch(`${API_BASE_URL}${endpoint}`, {
             method: 'DELETE'
         });
         if (!response.ok) throw new Error(`Failed to delete ${endpoint}`);
         return response.json();
     };

     const refreshData = async () => {
         try {
             setLoading(true);
             const [tripsData, partiesData, brokersData, paymentsData, ownersData, laboursData, productReceivesData] = await Promise.all([
                 fetchData('/trips'),
                 fetchData('/parties'),
                 fetchData('/brokers'),
                 fetchData('/payments'),
                 fetchData('/owners'),
                 fetchData('/labours'),
                 fetchData('/productReceives')
             ]);
             setTrips(tripsData);
             setParties(partiesData);
             setBrokers(brokersData);
             setPayments(paymentsData);
             setOwners(ownersData);
             setLabours(laboursData);
             setProductReceives(productReceivesData);
         } catch (error) {
             console.error('Error loading data:', error);
         } finally {
             setLoading(false);
         }
     };

     useEffect(() => {
         refreshData();
     }, []);

     const addTrip = async (trip: Omit<Trip, 'id' | 'serialNumber'>) => {
         const newTrip = await postData('/trips', trip);
         setTrips(prev => [newTrip, ...prev]);
     };

     const updateTrip = async (updatedTrip: Trip) => {
         const trip = await putData(`/trips/${updatedTrip._id || updatedTrip.id}`, updatedTrip);
         setTrips(prev => prev.map(t => (t._id || t.id) === (updatedTrip._id || updatedTrip.id) ? trip : t));
     };

     const deleteTrip = async (id: string) => {
         await deleteData(`/trips/${id}`);
         setTrips(prev => prev.filter(trip => (trip._id || trip.id) !== id));
     };
    
    // Party Management
    const addParty = async (party: Omit<Party, 'id'>) => {
        const newParty = await postData('/parties', party);
        setParties(prev => [newParty, ...prev]);
    };

    const updateParty = async (updatedParty: Party) => {
        const party = await putData(`/parties/${updatedParty._id || updatedParty.id}`, updatedParty);
        setParties(prev => prev.map(p => (p._id || p.id) === (updatedParty._id || updatedParty.id) ? party : p));
    };

    const deleteParty = async (id: string) => {
        await deleteData(`/parties/${id}`);
        setParties(prev => prev.filter(party => (party._id || party.id) !== id));
    };

    // Broker Management
    const addBroker = async (broker: Omit<Broker, 'id'>) => {
        const newBroker = await postData('/brokers', broker);
        setBrokers(prev => [newBroker, ...prev]);
    };

    const updateBroker = async (updatedBroker: Broker) => {
        const broker = await putData(`/brokers/${updatedBroker._id || updatedBroker.id}`, updatedBroker);
        setBrokers(prev => prev.map(b => (b._id || b.id) === (updatedBroker._id || updatedBroker.id) ? broker : b));
    };

    const deleteBroker = async (id: string) => {
        await deleteData(`/brokers/${id}`);
        setBrokers(prev => prev.filter(broker => (broker._id || broker.id) !== id));
    };

    // Payment Management
    const addPayment = async (payment: Omit<Payment, 'id'>) => {
        const newPayment = await postData('/payments', payment);
        setPayments(prev => [newPayment, ...prev]);
    };

    const deletePayment = async (id: string) => {
        await deleteData(`/payments/${id}`);
        setPayments(prev => prev.filter(payment => (payment._id || payment.id) !== id));
    };

    // Owner Management
    const addOwner = async (owner: Omit<Owner, 'id'>) => {
        const newOwner = await postData('/owners', owner);
        setOwners(prev => [newOwner, ...prev]);
    };

    const updateOwner = async (updatedOwner: Owner) => {
        const owner = await putData(`/owners/${updatedOwner._id || updatedOwner.id}`, updatedOwner);
        setOwners(prev => prev.map(o => (o._id || o.id) === (updatedOwner._id || updatedOwner.id) ? owner : o));
    };

    const deleteOwner = async (id: string) => {
        await deleteData(`/owners/${id}`);
        setOwners(prev => prev.filter(owner => (owner._id || owner.id) !== id));
    };

    // Labour Management
    const addLabour = async (labour: Omit<Labour, 'id'>) => {
        const newLabour = await postData('/labours', labour);
        setLabours(prev => [newLabour, ...prev]);
    };

    const updateLabour = async (updatedLabour: Labour) => {
        const labour = await putData(`/labours/${updatedLabour._id || updatedLabour.id}`, updatedLabour);
        setLabours(prev => prev.map(l => (l._id || l.id) === (updatedLabour._id || updatedLabour.id) ? labour : l));
    };

    const deleteLabour = async (id: string) => {
        await deleteData(`/labours/${id}`);
        setLabours(prev => prev.filter(labour => (labour._id || labour.id) !== id));
    };

    // ProductReceive Management
    const addProductReceive = async (productReceive: Omit<ProductReceive, 'id'>) => {
        const newProductReceive = await postData('/productReceives', productReceive);
        setProductReceives(prev => [newProductReceive, ...prev]);
    };

    const updateProductReceive = async (updatedProductReceive: ProductReceive) => {
        const productReceive = await putData(`/productReceives/${updatedProductReceive._id || updatedProductReceive.id}`, updatedProductReceive);
        setProductReceives(prev => prev.map(pr => (pr._id || pr.id) === (updatedProductReceive._id || updatedProductReceive.id) ? productReceive : pr));
    };

    const deleteProductReceive = async (id: string) => {
        await deleteData(`/productReceives/${id}`);
        setProductReceives(prev => prev.filter(productReceive => (productReceive._id || productReceive.id) !== id));
    };


    return (
        <DataContext.Provider value={{
            trips, parties, brokers, payments, owners, labours, productReceives, userRole, loading,
            addTrip, updateTrip, deleteTrip,
            addParty, updateParty, deleteParty,
            addBroker, updateBroker, deleteBroker,
            addPayment, deletePayment,
            addOwner, updateOwner, deleteOwner,
            addLabour, updateLabour, deleteLabour,
            addProductReceive, updateProductReceive, deleteProductReceive,
            setUserRole, refreshData
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
