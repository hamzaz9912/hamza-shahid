
import React, { useState, useEffect } from 'react';
import { Trip, PartyType } from '../types';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { createTrip, updateTrip } from '../store/slices/tripsSlice';
import { createParty } from '../store/slices/partiesSlice';
import { createBroker } from '../store/slices/brokersSlice';
import { createOwner, updateOwner } from '../store/slices/ownersSlice';
import PartyForm from './PartyForm';
import BrokerForm from './BrokerForm';
import toast from 'react-hot-toast';

interface TripFormProps {
    trip: Trip | null;
    onClose: () => void;
}

const TripForm: React.FC<TripFormProps> = ({ trip, onClose }) => {
    const dispatch = useAppDispatch();
    const { parties } = useAppSelector(state => state.parties);
    const { brokers } = useAppSelector(state => state.brokers);
    const { owners } = useAppSelector(state => state.owners);
    const { trips } = useAppSelector(state => state.trips);
    const { user } = useAppSelector(state => state.auth);
    const [showPartyInput, setShowPartyInput] = useState(false);
    const [showBrokerInput, setShowBrokerInput] = useState(false);
    const [newPartyName, setNewPartyName] = useState('');
    const [newBrokerName, setNewBrokerName] = useState('');
    const [newBrokerCommission, setNewBrokerCommission] = useState('');
    const [showOwnerInput, setShowOwnerInput] = useState(false);
    const [newOwnerName, setNewOwnerName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
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
        mt: 0,
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

    // Auto-populate vehicle account when vehicle number changes
    useEffect(() => {
        if (formData.vehicleNumber) {
            const ownerWithTruck = owners.find(owner =>
                owner.trucks.some(truck => truck.vehicleNumber === formData.vehicleNumber)
            );
            if (ownerWithTruck) {
                setFormData(prev => ({
                    ...prev,
                    vehicleAccount: ownerWithTruck.name
                }));
            }
        }
    }, [formData.vehicleNumber, owners]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name.match(/weight|freight|fare|charges|bonus|expenses|wages|balance|received|commission/i) ? parseFloat(value) || 0 : value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Check permissions for editing
        if (trip && user?.role === 'Staff' && !user.permissions.canEditTrips) {
            toast.error('You do not have permission to edit trips.');
            return;
        }

        setIsSubmitting(true);
        try {
            let ownerToUpdate = null;
            const isNewTrip = !trip;

            // Check if owner exists, if not create it
            if (formData.vehicleAccount && formData.vehicleNumber && formData.vehicleSize) {
                const existingOwner = owners.find(o => o.name === formData.vehicleAccount);
                if (!existingOwner) {
                    // Create new owner with the truck
                    const newOwner = await dispatch(createOwner({
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
                    })).unwrap();
                    ownerToUpdate = newOwner;
                } else {
                    ownerToUpdate = existingOwner;
                    // Check if truck already exists for this owner
                    const truckExists = existingOwner.trucks.some(t => t.vehicleNumber === formData.vehicleNumber);
                    if (!truckExists) {
                        // Add truck to existing owner
                        await dispatch(updateOwner({
                            id: existingOwner.id || existingOwner._id,
                            owner: {
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
                            }
                        })).unwrap();
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
                  savedTrip = await dispatch(updateTrip({ id: trip.id || trip._id, trip: { ...formData, id: trip.id || trip._id, serialNumber: trip.serialNumber } })).unwrap();
              } else {
                  savedTrip = await dispatch(createTrip(formData)).unwrap();
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

                await dispatch(updateOwner({
                    id: ownerToUpdate.id || ownerToUpdate._id,
                    owner: {
                        ...ownerToUpdate,
                        debit: updatedDebit,
                        credit: updatedCredit,
                        outstandingBalance: updatedOutstandingBalance,
                        totalTrips: updatedTotalTrips,
                        totalEarnings: updatedTotalEarnings,
                        totalPayments: updatedTotalPayments
                    }
                })).unwrap();
            }

            toast.success(isNewTrip ? 'Trip added successfully!' : 'Trip updated successfully!');
            onClose();
        } catch (error) {
            console.error('Error saving trip:', error);
            toast.error('Error saving trip. Please try again.');
        } finally {
            setIsSubmitting(false);
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
            await dispatch(createTrip(clonedTripData)).unwrap();
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
            mt: 0,
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
        setShowOwnerInput(false);
        setNewPartyName('');
        setNewBrokerName('');
        setNewBrokerCommission('');
        setNewOwnerName('');
        onClose();
    };

    const handleAddParty = async () => {
        if (newPartyName.trim()) {
            try {
                await dispatch(createParty({
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
                })).unwrap();
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
                await dispatch(createBroker({
                    name: newBrokerName.trim(),
                    commission: parseFloat(newBrokerCommission) || 0,
                    contact: '',
                    station: '',
                    debit: 0,
                    credit: 0
                })).unwrap();
                setFormData(prev => ({ ...prev, brokerName: newBrokerName.trim() }));
                setNewBrokerName('');
                setNewBrokerCommission('');
                setShowBrokerInput(false);
            } catch (error) {
                console.error('Error adding broker:', error);
            }
        }
    };

    const handleAddOwner = async () => {
        if (newOwnerName.trim() && formData.vehicleNumber && formData.vehicleSize) {
            try {
                await dispatch(createOwner({
                    name: newOwnerName.trim(),
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
                })).unwrap();
                setFormData(prev => ({ ...prev, vehicleAccount: newOwnerName.trim() }));
                setNewOwnerName('');
                setShowOwnerInput(false);
            } catch (error) {
                console.error('Error adding owner:', error);
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
        <>
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-2 sm:p-4" onClick={onClose}>
                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[95vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                    <div className="p-6 border-b flex justify-between items-center flex-shrink-0">
                        <h2 className="text-xl font-bold text-gray-900">{trip ? 'Edit Trip' : 'Add New Trip'}</h2>
                          <button type="button" onClick={handleCancel} disabled={isSubmitting} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
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
                                {renderInput('Truck Dimensions', 'truckDimensions')}
                            </div>
                        </fieldset>

                         <fieldset className="mb-6">
                             <legend className="text-lg font-semibold text-primary mb-4 pb-2 border-b w-full">Party & Broker Details</legend>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                                                     placeholder="Enter party name"
                                                     value={newPartyName}
                                                     onChange={(e) => setNewPartyName(e.target.value)}
                                                     className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                                 />
                                                 <button
                                                     type="button"
                                                     onClick={handleAddParty}
                                                     className="px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                 >
                                                     Add
                                                 </button>
                                                 <button
                                                     type="button"
                                                     onClick={() => setShowPartyInput(false)}
                                                     className="px-3 py-2 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
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
                                                    placeholder="Enter broker name"
                                                    value={newBrokerName}
                                                    onChange={(e) => setNewBrokerName(e.target.value)}
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                                />
                                                <input
                                                    type="number"
                                                    placeholder="Commission %"
                                                    value={newBrokerCommission}
                                                    onChange={(e) => setNewBrokerCommission(e.target.value)}
                                                    className="w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleAddBroker}
                                                    className="px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                                                >
                                                    Add
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowBrokerInput(false)}
                                                    className="px-3 py-2 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
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


                        {/* Financial Details Section */}
                        <fieldset className="mb-6">
                            <legend className="text-lg font-semibold text-primary mb-4 pb-2 border-b w-full">Financial Details</legend>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {renderInput('Weight', 'weight', 'number')}
                                {renderInput('Freight', 'freight', 'number')}
                                {renderInput('Office Fare', 'officeFare', 'number')}
                                {renderInput('Vehicle Received Bilty', 'vehicleReceivedBilty', 'number')}
                                {renderInput('Vehicle Fare', 'vehicleFare', 'number')}
                                {renderInput('Labor Charges', 'laborCharges', 'number')}
                                {renderInput('Excise Charges', 'exciseCharges', 'number')}
                                {renderInput('Bonus', 'bonus', 'number')}
                                {renderInput('Misc Expenses', 'miscExpenses', 'number')}
                                {renderInput('Daily Wages', 'dailyWages', 'number')}
                                {renderInput('Extra Weight', 'extraWeight', 'number')}
                                {renderInput('MT', 'mt', 'number')}
                                {renderInput('Party Balance', 'partyBalance', 'number')}
                                {renderInput('Party Received', 'partyReceived', 'number')}
                                {renderInput('Brokerage Commission', 'brokerageCommission', 'number')}
                                {renderInput('Vehicle Balance', 'vehicleBalance', 'number')}
                                <div>
                                    <label htmlFor="vehicleAccount" className="block text-sm font-medium text-gray-700">Vehicle Account</label>
                                    <div className="space-y-2">
                                        <div className="flex space-x-2">
                                            <input
                                                type="text"
                                                name="vehicleAccount"
                                                id="vehicleAccount"
                                                value={formData.vehicleAccount}
                                                onChange={handleChange}
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowOwnerInput(!showOwnerInput)}
                                                className="mt-1 px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                                                title="Add New Owner"
                                            >
                                                +
                                            </button>
                                        </div>
                                        {showOwnerInput && (
                                            <div className="flex space-x-2">
                                                <input
                                                    type="text"
                                                    placeholder="Enter owner name"
                                                    value={newOwnerName}
                                                    onChange={(e) => setNewOwnerName(e.target.value)}
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleAddOwner}
                                                    className="px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    Add
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowOwnerInput(false)}
                                                    className="px-3 py-2 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </fieldset>

                        {/* Product Details Section */}
                        <fieldset className="mb-6">
                            <legend className="text-lg font-semibold text-purple-600 mb-4 pb-2 border-b w-full flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                                Product Details
                            </legend>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {renderInput('Product Name', 'productName')}
                                {renderInput('Product Quantity', 'productQuantity', 'number')}
                                {renderInput('Product Unit', 'productUnit')}
                                {renderInput('Product Type', 'productType')}
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
                            <button type="button" onClick={handleCancel} disabled={isSubmitting} className="w-full bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed">
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting || (trip && user?.role === 'Staff' && !user.permissions.canEditTrips)}
                                className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Saving...' : (trip ? 'Save Changes' : 'Create Trip')}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

        </>
    );
};

export default TripForm;
