
import React, { useState, useEffect } from 'react';
import { Trip, PartyType } from '../types';
import { useData } from '../context/DataContext';
import PartyForm from './PartyForm';
import BrokerForm from './BrokerForm';

interface TripFormProps {
    trip: Trip | null;
    onClose: () => void;
}

const TripForm: React.FC<TripFormProps> = ({ trip, onClose }) => {
    const { addTrip, updateTrip, parties, brokers, owners, trips, addParty, addBroker, addOwner, updateOwner } = useData();
    const [showPartyModal, setShowPartyModal] = useState(false);
    const [showBrokerModal, setShowBrokerModal] = useState(false);
    const [showPartyInput, setShowPartyInput] = useState(false);
    const [showBrokerInput, setShowBrokerInput] = useState(false);
    const [newPartyName, setNewPartyName] = useState('');
    const [newBrokerName, setNewBrokerName] = useState('');
    const [newBrokerCommission, setNewBrokerCommission] = useState('');
    const [formData, setFormData] = useState<Omit<Trip, 'id' | 'serialNumber'>>({
        driverNumber: '',
        date: new Date().toISOString().split('T')[0],
        vehicleNumber: '',
        vehicleSize: '',
        weight: 0,
        freight: 0,
        officeFare: 0,
        vehicleReceivedBilty: 0,
        vehicleFare: 0,
        laborCharges: 0,
        exciseCharges: 0,
        bonus: 0,
        miscExpenses: 0,
        dailyWages: 0,
        extraWeight: 0,
        partyBalance: 0,
        partyReceived: 0,
        brokerageCommission: 0,
        vehicleBalance: 0,
        vehicleAccount: '',
        additionalDetails: '',
        station: '',
        brokerName: '',
        partyName: '',
        productName: '',
        productQuantity: 0,
        productUnit: '',
        productType: '',
        truckDimensions: '',
    });

    useEffect(() => {
        if (trip) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { id, serialNumber, ...editableData } = trip;
            setFormData(editableData);
        }
    }, [trip]);

    // Auto-calculate broker commission when broker or freight changes
    useEffect(() => {
        if (formData.brokerName && formData.freight > 0) {
            const selectedBroker = brokers.find(b => b.name === formData.brokerName);
            if (selectedBroker) {
                const calculatedCommission = Math.round((formData.freight * selectedBroker.commission) / 100);
                setFormData(prev => ({
                    ...prev,
                    brokerageCommission: calculatedCommission
                }));
            }
        }
    }, [formData.brokerName, formData.freight, brokers]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name.match(/weight|freight|fare|charges|bonus|expenses|wages|balance|received|commission/i) ? parseFloat(value) || 0 : value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            let ownerToUpdate = null;
            const isNewTrip = !trip;

            // Check if owner exists, if not create it
            if (formData.vehicleAccount && formData.vehicleNumber && formData.vehicleSize) {
                const existingOwner = owners.find(o => o.name === formData.vehicleAccount);
                if (!existingOwner) {
                    // Create new owner with the truck
                    const newOwner = await addOwner({
                        name: formData.vehicleAccount,
                        trucks: [{
                            vehicleNumber: formData.vehicleNumber,
                            vehicleSize: formData.vehicleSize,
                            dimensions: { length: 0, width: 0, height: 0 },
                            capacity: 0,
                            registrationDate: '',
                            insuranceExpiry: '',
                            fitnessExpiry: '',
                            status: 'active'
                        }],
                        debit: 0,
                        credit: 0,
                        outstandingBalance: 0,
                        totalTrips: 0,
                        totalEarnings: 0,
                        totalPayments: 0
                    });
                    ownerToUpdate = newOwner;
                } else {
                    ownerToUpdate = existingOwner;
                    // Check if truck already exists for this owner
                    const truckExists = existingOwner.trucks.some(t => t.vehicleNumber === formData.vehicleNumber);
                    if (!truckExists) {
                        // Add truck to existing owner
                        await updateOwner({
                            ...existingOwner,
                            trucks: [...existingOwner.trucks, {
                                vehicleNumber: formData.vehicleNumber,
                                vehicleSize: formData.vehicleSize,
                                dimensions: { length: 0, width: 0, height: 0 },
                                capacity: 0,
                                registrationDate: '',
                                insuranceExpiry: '',
                                fitnessExpiry: '',
                                status: 'active'
                            }]
                        });
                        ownerToUpdate = { ...existingOwner, trucks: [...existingOwner.trucks, {
                            vehicleNumber: formData.vehicleNumber,
                            vehicleSize: formData.vehicleSize,
                            dimensions: { length: 0, width: 0, height: 0 },
                            capacity: 0,
                            registrationDate: '',
                            insuranceExpiry: '',
                            fitnessExpiry: '',
                            status: 'active'
                        }] };
                    }
                }
            }

            // Save the trip first
            let savedTrip;
            if (trip) {
                savedTrip = await updateTrip({ ...formData, id: trip.id || trip._id, serialNumber: trip.serialNumber });
            } else {
                savedTrip = await addTrip(formData);
            }

            // Update owner financial records if owner is associated
            if (ownerToUpdate && savedTrip) {
                // Calculate net amount for this trip (freight - all expenses)
                const tripExpenses = formData.officeFare + formData.vehicleFare + formData.laborCharges +
                                   formData.exciseCharges + formData.miscExpenses + formData.dailyWages + formData.brokerageCommission;
                const netAmount = formData.freight - tripExpenses;

                // For vehicle balance: if positive, owner owes us money (add to credit)
                // if negative, we owe owner money (add to debit)
                const vehicleBalanceChange = formData.vehicleBalance;

                let updatedDebit = ownerToUpdate.debit || 0;
                let updatedCredit = ownerToUpdate.credit || 0;
                let updatedTotalTrips = (ownerToUpdate.totalTrips || 0);
                let updatedTotalEarnings = (ownerToUpdate.totalEarnings || 0);
                let updatedTotalPayments = (ownerToUpdate.totalPayments || 0);

                if (isNewTrip) {
                    // New trip - add to totals
                    updatedTotalTrips += 1;
                    if (vehicleBalanceChange > 0) {
                        updatedCredit += vehicleBalanceChange;
                        updatedTotalEarnings += vehicleBalanceChange;
                    } else if (vehicleBalanceChange < 0) {
                        updatedDebit += Math.abs(vehicleBalanceChange);
                        updatedTotalPayments += Math.abs(vehicleBalanceChange);
                    }
                } else {
                    // Update existing trip - calculate difference
                    const oldTrip = trips.find(t => t.id === trip?.id);
                    if (oldTrip) {
                        const oldVehicleBalance = oldTrip.vehicleBalance;
                        const balanceDifference = vehicleBalanceChange - oldVehicleBalance;

                        if (balanceDifference > 0) {
                            updatedCredit += balanceDifference;
                            updatedTotalEarnings += balanceDifference;
                        } else if (balanceDifference < 0) {
                            updatedDebit += Math.abs(balanceDifference);
                            updatedTotalPayments += Math.abs(balanceDifference);
                        }
                    }
                }

                const updatedOutstandingBalance = updatedCredit - updatedDebit;

                await updateOwner({
                    ...ownerToUpdate,
                    debit: updatedDebit,
                    credit: updatedCredit,
                    outstandingBalance: updatedOutstandingBalance,
                    totalTrips: updatedTotalTrips,
                    totalEarnings: updatedTotalEarnings,
                    totalPayments: updatedTotalPayments
                });
            }

            onClose();
        } catch (error) {
            console.error('Error saving trip:', error);
        }
    };

    const handleClone = async () => {
        if (!trip) return;

        const clonedTripData: Omit<Trip, 'id' | 'serialNumber'> = {
            ...formData,
            date: new Date().toISOString().split('T')[0],
            additionalDetails: `(Cloned from S.No: ${trip.serialNumber}) ${formData.additionalDetails}`.trim(),
        };

        try {
            await addTrip(clonedTripData);
            onClose();
        } catch (error) {
            console.error('Error cloning trip:', error);
        }
    };

    const handleCancel = () => {
        // Reset form to initial state
        setFormData({
            driverNumber: '',
            date: new Date().toISOString().split('T')[0],
            vehicleNumber: '',
            vehicleSize: '',
            weight: 0,
            freight: 0,
            officeFare: 0,
            vehicleReceivedBilty: 0,
            vehicleFare: 0,
            laborCharges: 0,
            exciseCharges: 0,
            bonus: 0,
            miscExpenses: 0,
            dailyWages: 0,
            extraWeight: 0,
            partyBalance: 0,
            partyReceived: 0,
            brokerageCommission: 0,
            vehicleBalance: 0,
            vehicleAccount: '',
            additionalDetails: '',
            station: '',
            brokerName: '',
            partyName: '',
            productName: '',
            productQuantity: 0,
            productUnit: '',
            productType: '',
            truckDimensions: '',
        });
        setShowPartyInput(false);
        setShowBrokerInput(false);
        setNewPartyName('');
        setNewBrokerName('');
        setNewBrokerCommission('');
        onClose();
    };

    const handleAddParty = async () => {
        if (newPartyName.trim()) {
            try {
                await addParty({
                    name: newPartyName.trim(),
                    type: PartyType.REGULAR,
                    contact: '',
                    phone: '',
                    email: '',
                    address: '',
                    city: '',
                    businessType: '',
                    gstNumber: '',
                    panNumber: '',
                    debit: 0,
                    credit: 0,
                    outstandingBalance: 0
                });
                setFormData(prev => ({ ...prev, partyName: newPartyName.trim() }));
                setNewPartyName('');
                setShowPartyInput(false);
            } catch (error) {
                console.error('Error adding party:', error);
            }
        }
    };

    const handleAddBroker = async () => {
        if (newBrokerName.trim() && newBrokerCommission) {
            try {
                await addBroker({
                    name: newBrokerName.trim(),
                    commission: parseFloat(newBrokerCommission) || 0,
                    contact: '',
                    station: '',
                    debit: 0,
                    credit: 0
                });
                setFormData(prev => ({ ...prev, brokerName: newBrokerName.trim() }));
                setNewBrokerName('');
                setNewBrokerCommission('');
                setShowBrokerInput(false);
            } catch (error) {
                console.error('Error adding broker:', error);
            }
        }
    };


    const renderInput = (label: string, name: keyof typeof formData, type: string = 'text', required: boolean = false) => {
        const isNumberInput = type === 'number';
        const value = formData[name];
    
        return (
            <div>
                <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}{required && <span className="text-red-500">*</span>}</label>
                <input 
                    type={type} 
                    name={name} 
                    id={name} 
                    value={isNumberInput && value === 0 ? '' : String(value ?? '')}
                    placeholder={isNumberInput ? '0' : undefined}
                    onChange={handleChange} 
                    required={required} 
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
            </div>
        );
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b flex justify-between items-center flex-shrink-0">
                    <h2 className="text-xl font-bold text-gray-900">{trip ? 'Edit Trip' : 'Add New Trip'}</h2>
                     <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="p-6 overflow-y-auto flex-1">
                    <fieldset className="mb-6">
                         <legend className="text-lg font-semibold text-primary mb-4 pb-2 border-b w-full">Core Information</legend>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                            {renderInput('Date', 'date', 'date', true)}
                            {renderInput('Vehicle Number', 'vehicleNumber', 'text', true)}
                            {renderInput('Driver Number', 'driverNumber')}
                            {renderInput('Vehicle Size', 'vehicleSize')}
                        </div>
                    </fieldset>
                    
                     <fieldset className="mb-6">
                         <legend className="text-lg font-semibold text-primary mb-4 pb-2 border-b w-full">Party & Broker Details</legend>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            <div>
                                <label htmlFor="partyName" className="block text-sm font-medium text-gray-700">Party Name<span className="text-red-500">*</span></label>
                                <div className="space-y-2">
                                    <div className="flex space-x-2">
                                        <select id="partyName" name="partyName" value={formData.partyName} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                                            <option value="">Select Party</option>
                                            {parties.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                                        </select>
                                        <button
                                            type="button"
                                            onClick={() => setShowPartyInput(!showPartyInput)}
                                            className="mt-1 px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                                            title="Add New Party"
                                        >
                                            +
                                        </button>
                                    </div>
                                    {showPartyInput && (
                                        <div className="flex space-x-2">
                                            <input
                                                type="text"
                                                value={newPartyName}
                                                onChange={(e) => setNewPartyName(e.target.value)}
                                                placeholder="Enter party name"
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleAddParty}
                                                className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                                            >
                                                Add
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowPartyInput(false);
                                                    setNewPartyName('');
                                                }}
                                                className="px-4 py-2 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label htmlFor="brokerName" className="block text-sm font-medium text-gray-700">Broker Name<span className="text-red-500">*</span></label>
                                <div className="space-y-2">
                                    <div className="flex space-x-2">
                                        <select id="brokerName" name="brokerName" value={formData.brokerName} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                                            <option value="">Select Broker</option>
                                            {brokers.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                                        </select>
                                        <button
                                            type="button"
                                            onClick={() => setShowBrokerInput(!showBrokerInput)}
                                            className="mt-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            title="Add New Broker"
                                        >
                                            +
                                        </button>
                                    </div>
                                    {showBrokerInput && (
                                        <div className="flex space-x-2">
                                            <input
                                                type="text"
                                                value={newBrokerName}
                                                onChange={(e) => setNewBrokerName(e.target.value)}
                                                placeholder="Broker name"
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                            />

                                             {/* change commission to contact number  */}
                                            <input
                                                type="number"
                                                value={newBrokerCommission}
                                                onChange={(e) => setNewBrokerCommission(e.target.value)}
                                                placeholder="contact number "
                                                step="0.1"
                                                className="w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleAddBroker}
                                                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                Add
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowBrokerInput(false);
                                                    setNewBrokerName('');
                                                    setNewBrokerCommission('');
                                                }}
                                                className="px-4 py-2 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {renderInput('Station', 'station')}
                        </div>
                    </fieldset>

                    {/* Detailed Party Section */}
                    <fieldset className="mb-6">
                        <legend className="text-lg font-semibold text-green-600 mb-4 pb-2 border-b w-full flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Party Information
                        </legend>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                            {formData.partyName ? (
                                (() => {
                                    const selectedParty = parties.find(p => p.name === formData.partyName);
                                    return selectedParty ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            <div className="bg-white p-4 rounded-lg border border-green-200">
                                                <div className="text-sm text-green-600 font-medium">Party Name</div>
                                                <div className="text-lg font-bold text-green-800">{selectedParty.name}</div>
                                            </div>
                                            <div className="bg-white p-4 rounded-lg border border-green-200">
                                                <div className="text-sm text-green-600 font-medium">Contact</div>
                                                <div className="text-lg font-bold text-green-800">{selectedParty.contact || 'N/A'}</div>
                                            </div>
                                            <div className="bg-white p-4 rounded-lg border border-green-200">
                                                <div className="text-sm text-green-600 font-medium">Type</div>
                                                <div className="text-lg font-bold text-green-800">{selectedParty.type}</div>
                                            </div>
                                            <div className="bg-white p-4 rounded-lg border border-green-200 md:col-span-2 lg:col-span-3">
                                                <div className="text-sm text-green-600 font-medium">Address</div>
                                                <div className="text-lg font-bold text-green-800">{selectedParty.address || 'N/A'}</div>
                                            </div>
                                            <div className="bg-white p-4 rounded-lg border border-red-200">
                                                <div className="text-sm text-red-600 font-medium">Outstanding Balance</div>
                                                <div className="text-xl font-bold text-red-800">PKR {selectedParty.outstandingBalance.toLocaleString()}</div>
                                            </div>
                                            <div className="bg-white p-4 rounded-lg border border-blue-200">
                                                <div className="text-sm text-blue-600 font-medium">Total Trips</div>
                                                <div className="text-xl font-bold text-blue-800">
                                                    {trips.filter(t => t.partyName === selectedParty.name).length}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-green-600">
                                            <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            <p className="text-lg font-medium">No party selected</p>
                                            <p className="text-sm opacity-75">Select a party above to view details</p>
                                        </div>
                                    );
                                })()
                            ) : (
                                <div className="text-center py-8 text-green-600">
                                    <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <p className="text-lg font-medium">No party selected</p>
                                    <p className="text-sm opacity-75">Select a party above to view details</p>
                                </div>
                            )}
                        </div>
                    </fieldset>

                    {/* Detailed Broker Section */}
                    <fieldset className="mb-6">
                        <legend className="text-lg font-semibold text-blue-600 mb-4 pb-2 border-b w-full flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Broker Information
                        </legend>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                            {formData.brokerName ? (
                                (() => {
                                    const selectedBroker = brokers.find(b => b.name === formData.brokerName);
                                    return selectedBroker ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            <div className="bg-white p-4 rounded-lg border border-blue-200">
                                                <div className="text-sm text-blue-600 font-medium">Broker Name</div>
                                                <div className="text-lg font-bold text-blue-800">{selectedBroker.name}</div>
                                            </div>
                                            <div className="bg-white p-4 rounded-lg border border-blue-200">
                                                <div className="text-sm text-blue-600 font-medium">Contact Number</div>
                                                <div className="text-lg font-bold text-blue-800">{selectedBroker.contact || 'N/A'}</div>
                                            </div>
                                            <div className="bg-white p-4 rounded-lg border border-blue-200">
                                                <div className="text-sm text-blue-600 font-medium">Commission Rate</div>
                                                <div className="text-lg font-bold text-blue-800">{selectedBroker.commission}%</div>
                                            </div>
                                            <div className="bg-white p-4 rounded-lg border border-blue-200 md:col-span-2 lg:col-span-3">
                                                <div className="text-sm text-blue-600 font-medium">Station/Location</div>
                                                <div className="text-lg font-bold text-blue-800">{selectedBroker.station || 'N/A'}</div>
                                            </div>
                                            <div className="bg-white p-4 rounded-lg border border-purple-200">
                                                <div className="text-sm text-purple-600 font-medium">Total Trips</div>
                                                <div className="text-xl font-bold text-purple-800">
                                                    {trips.filter(t => t.brokerName === selectedBroker.name).length}
                                                </div>
                                            </div>
                                            <div className="bg-white p-4 rounded-lg border border-green-200">
                                                <div className="text-sm text-green-600 font-medium">Total Commission Earned</div>
                                                <div className="text-xl font-bold text-green-800">
                                                    PKR {trips.filter(t => t.brokerName === selectedBroker.name).reduce((sum, t) => sum + t.brokerageCommission, 0).toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-blue-600">
                                            <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            <p className="text-lg font-medium">No broker selected</p>
                                            <p className="text-sm opacity-75">Select a broker above to view details</p>
                                        </div>
                                    );
                                })()
                            ) : (
                                <div className="text-center py-8 text-blue-600">
                                    <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-lg font-medium">No broker selected</p>
                                    <p className="text-sm opacity-75">Select a broker above to view details</p>
                                </div>
                            )}
                        </div>
                    </fieldset>

                    <fieldset className="mb-6">
                        <legend className="text-lg font-semibold text-primary mb-4 pb-2 border-b w-full">Financial Details</legend>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                             {renderInput('Weight (MT)', 'weight', 'number')}
                             {renderInput('Extra Weight', 'extraWeight', 'number')}
                             {renderInput('Freight (Bilty Fare)', 'freight', 'number')}
                             {renderInput('Office Fare', 'officeFare', 'number')}
                             {renderInput('Vehicle Received Bilty', 'vehicleReceivedBilty', 'number')}
                             {renderInput('Vehicle Fare', 'vehicleFare', 'number')}
                             {renderInput('Labor Charges', 'laborCharges', 'number')}
                             {renderInput('Excise Charges', 'exciseCharges', 'number')}
                             {renderInput('Bonus/Reward', 'bonus', 'number')}
                             {renderInput('Misc Expenses', 'miscExpenses', 'number')}
                             {renderInput('Daily Wages', 'dailyWages', 'number')}
                             {renderInput('Party Balance', 'partyBalance', 'number')}
                             {renderInput('Party Received', 'partyReceived', 'number')}
                             {renderInput('Brokerage + Commission', 'brokerageCommission', 'number')}
                             {renderInput('Vehicle Balance', 'vehicleBalance', 'number')}
                             <div>
                                 <label htmlFor="vehicleAccount" className="block text-sm font-medium text-gray-700">Vehicle Account (Owner)</label>
                                 <select id="vehicleAccount" name="vehicleAccount" value={formData.vehicleAccount} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                                     <option value="">Select Owner</option>
                                     {owners.map(o => <option key={o.id} value={o.name}>{o.name}</option>)}
                                 </select>
                             </div>
                        </div>
                    </fieldset>

                    <fieldset className="mb-6">
                        <legend className="text-lg font-semibold text-purple-600 mb-4 pb-2 border-b w-full">Product Receive Information</legend>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                            {renderInput('Product Name', 'productName')}
                            {renderInput('Product Quantity', 'productQuantity', 'number')}
                            {renderInput('Product Unit', 'productUnit')}
                            {renderInput('Product Type', 'productType')}
                            {renderInput('Truck Dimensions', 'truckDimensions')}
                        </div>
                    </fieldset>

                    <div>
                         <label htmlFor="additionalDetails" className="block text-sm font-medium text-gray-700">Additional Details / Remarks</label>
                         <textarea id="additionalDetails" name="additionalDetails" value={formData.additionalDetails} onChange={handleChange} rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"></textarea>
                     </div>
                </div>
                <div className="px-6 py-4 bg-gray-50 border-t flex flex-col gap-4 flex-shrink-0">
                    <div className="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
                        <div className="flex flex-col sm:flex-row gap-3">
                            {trip && (
                                 <button
                                    type="button"
                                    onClick={handleClone}
                                    className="inline-flex justify-center items-center py-2.5 px-6 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-200 transform hover:scale-105"
                                 >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    Clone Trip
                                </button>
                            )}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                            <button
                                type="button"
                                onClick={onClose}
                                className="inline-flex justify-center items-center py-2.5 px-6 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 transform hover:scale-105"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="inline-flex justify-center items-center py-2.5 px-6 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                {trip ? 'Save Changes' : 'Create Trip'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-2 sm:p-4" onClick={onClose}>
                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[95vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                    <div className="p-6 border-b flex justify-between items-center flex-shrink-0">
                        <h2 className="text-xl font-bold text-gray-900">{trip ? 'Edit Trip' : 'Add New Trip'}</h2>
                         <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    <div className="p-6 overflow-y-auto flex-1">
                        <fieldset className="mb-6">
                             <legend className="text-lg font-semibold text-primary mb-4 pb-2 border-b w-full">Core Information</legend>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {renderInput('Date', 'date', 'date', true)}
                                {renderInput('Vehicle Number', 'vehicleNumber', 'text', true)}
                                {renderInput('Driver Number', 'driverNumber')}
                                {renderInput('Vehicle Size', 'vehicleSize')}
                            </div>
                        </fieldset>

                         <fieldset className="mb-6">
                             <legend className="text-lg font-semibold text-primary mb-4 pb-2 border-b w-full">Party & Broker Details</legend>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div>
                                    <label htmlFor="partyName" className="block text-sm font-medium text-gray-700">Party Name<span className="text-red-500">*</span></label>
                                    <div className="flex space-x-2">
                                        <select id="partyName" name="partyName" value={formData.partyName} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                                            <option value="">Select Party</option>
                                            {parties.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                                        </select>
                                        <button
                                            type="button"
                                            onClick={() => setShowPartyModal(true)}
                                            className="mt-1 px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                                            title="Add New Party"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="brokerName" className="block text-sm font-medium text-gray-700">Broker Name<span className="text-red-500">*</span></label>
                                    <div className="flex space-x-2">
                                        <select id="brokerName" name="brokerName" value={formData.brokerName} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                                            <option value="">Select Broker</option>
                                            {brokers.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                                        </select>
                                        <button
                                            type="button"
                                            onClick={() => setShowBrokerModal(true)}
                                            className="mt-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            title="Add New Broker"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                {renderInput('Station', 'station')}
                            </div>
                        </fieldset>


                        {/* Party Calculation Section */}
                        <fieldset className="mb-6">
                            <legend className="text-lg font-semibold text-green-600 mb-4 pb-2 border-b w-full flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Party Calculation
                            </legend>
                            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="bg-white p-4 rounded-lg border border-green-200">
                                        <div className="text-sm text-green-600 font-medium">Total Freight</div>
                                        <div className="text-2xl font-bold text-green-800">PKR {formData.freight.toLocaleString()}</div>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg border border-green-200">
                                        <div className="text-sm text-red-600 font-medium">Total Expenses</div>
                                        <div className="text-2xl font-bold text-red-800">PKR {(formData.officeFare + formData.vehicleFare + formData.laborCharges + formData.exciseCharges + formData.miscExpenses + formData.dailyWages + formData.brokerageCommission).toLocaleString()}</div>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg border border-blue-200">
                                        <div className="text-sm text-blue-600 font-medium">Party Net Amount</div>
                                        <div className="text-2xl font-bold text-blue-800">PKR {(formData.freight - (formData.officeFare + formData.vehicleFare + formData.laborCharges + formData.exciseCharges + formData.miscExpenses + formData.dailyWages + formData.brokerageCommission)).toLocaleString()}</div>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg border border-purple-200">
                                        <div className="text-sm text-purple-600 font-medium">Outstanding Balance</div>
                                        <div className="text-2xl font-bold text-purple-800">PKR {(formData.partyBalance - formData.partyReceived).toLocaleString()}</div>
                                    </div>
                                </div>
                            </div>
                        </fieldset>

                        {/* Broker Calculation Section */}
                        <fieldset className="mb-6">
                            <legend className="text-lg font-semibold text-blue-600 mb-4 pb-2 border-b w-full flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                Broker Calculation
                            </legend>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="bg-white p-4 rounded-lg border border-blue-200">
                                        <div className="text-sm text-blue-600 font-medium">Selected Broker</div>
                                        <div className="text-lg font-bold text-blue-800">{formData.brokerName || 'None selected'}</div>
                                        {formData.brokerName && (
                                            <div className="text-xs text-blue-500 mt-1">
                                                Contact: {brokers.find(b => b.name === formData.brokerName)?.contact || 'N/A'}
                                            </div>
                                        )}
                                    </div>
                                    <div className="bg-white p-4 rounded-lg border border-blue-200">
                                        <div className="text-sm text-blue-600 font-medium">Commission Rate</div>
                                        <div className="text-2xl font-bold text-blue-800">
                                            {formData.brokerName ? `${brokers.find(b => b.name === formData.brokerName)?.commission || 0}%` : '0%'}
                                        </div>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg border border-blue-200">
                                        <div className="text-sm text-blue-600 font-medium">Commission Amount</div>
                                        <div className="text-2xl font-bold text-blue-800">
                                            PKR {formData.brokerName ?
                                                Math.round((formData.freight * (brokers.find(b => b.name === formData.brokerName)?.commission || 0)) / 100)
                                                : 0
                                            }
                                        </div>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg border border-blue-200">
                                        <div className="text-sm text-blue-600 font-medium">Broker Receives</div>
                                        <div className="text-2xl font-bold text-blue-800">
                                            PKR {formData.brokerageCommission.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                                {formData.brokerName && (
                                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                        <div className="flex items-center gap-2 text-yellow-800">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                            </svg>
                                            <span className="font-medium">Note:</span>
                                        </div>
                                        <p className="text-sm text-yellow-700 mt-1">
                                            Broker commission is automatically calculated as {brokers.find(b => b.name === formData.brokerName)?.commission || 0}% of freight (PKR {Math.round((formData.freight * (brokers.find(b => b.name === formData.brokerName)?.commission || 0)) / 100)}).
                                            This amount is deducted from the party calculation above.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </fieldset>

                        <div>
                             <label htmlFor="additionalDetails" className="block text-sm font-medium text-gray-700">Additional Details / Remarks</label>
                             <textarea id="additionalDetails" name="additionalDetails" value={formData.additionalDetails} onChange={handleChange} rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"></textarea>
                         </div>
                    </div>
                    <div className="px-6 py-4 bg-gray-50 border-t flex flex-col-reverse gap-4 sm:flex-row sm:justify-between items-center flex-shrink-0">
                        <div>
                            {trip && (
                                 <button
                                    type="button"
                                    onClick={handleClone}
                                    className="w-full sm:w-auto inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                                >
                                    Clone Trip
                                </button>
                            )}
                        </div>
                        <div className="flex space-x-3 w-full sm:w-auto">
                            <button type="button" onClick={handleCancel} className="w-full bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                                Cancel
                            </button>
                            <button type="submit" className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                                {trip ? 'Save Changes' : 'Create Trip'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Party Modal */}
            {showPartyModal && (
                <PartyForm
                    party={null}
                    onClose={() => setShowPartyModal(false)}
                />
            )}

            {/* Broker Modal */}
            {showBrokerModal && (
                <BrokerForm
                    broker={null}
                    onClose={() => setShowBrokerModal(false)}
                />
            )}
        </>
    );
};

export default TripForm;
