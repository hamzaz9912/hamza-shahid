
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
    const { addTrip, updateTrip, parties, brokers, addParty, addBroker } = useData();
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
        mt: 0,
    });

    useEffect(() => {
        if (trip) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { id, serialNumber, ...editableData } = trip;
            setFormData(editableData);
        }
    }, [trip]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name.match(/weight|freight|fare|charges|bonus|expenses|wages|balance|received|commission|mt/i) ? parseFloat(value) || 0 : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (trip) {
            updateTrip({ ...formData, id: trip.id, serialNumber: trip.serialNumber });
        } else {
            addTrip(formData);
        }
        onClose();
    };

    const handleClone = () => {
        if (!trip) return;

        const clonedTripData: Omit<Trip, 'id' | 'serialNumber'> = {
            ...formData,
            date: new Date().toISOString().split('T')[0],
            additionalDetails: `(Cloned from S.No: ${trip.serialNumber}) ${formData.additionalDetails}`.trim(),
        };

        addTrip(clonedTripData);
        onClose();
    };

    const handleAddParty = () => {
        if (newPartyName.trim()) {
            addParty({
                name: newPartyName.trim(),
                type: PartyType.REGULAR,
                contact: '',
                address: '',
                outstandingBalance: 0
            });
            setFormData(prev => ({ ...prev, partyName: newPartyName.trim() }));
            setNewPartyName('');
            setShowPartyInput(false);
        }
    };

    const handleAddBroker = () => {
        if (newBrokerName.trim() && newBrokerCommission) {
            addBroker({
                name: newBrokerName.trim(),
                commission: parseFloat(newBrokerCommission) || 0,
                contact: '',
                station: ''
            });
            setFormData(prev => ({ ...prev, brokerName: newBrokerName.trim() }));
            setNewBrokerName('');
            setNewBrokerCommission('');
            setShowBrokerInput(false);
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
                                            <input
                                                type="number"
                                                value={newBrokerCommission}
                                                onChange={(e) => setNewBrokerCommission(e.target.value)}
                                                placeholder="Commission %"
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

                    <fieldset className="mb-6">
                        <legend className="text-lg font-semibold text-primary mb-4 pb-2 border-b w-full">Financial Details</legend>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                             {renderInput('Weight', 'weight', 'number')}
                             {renderInput('Extra Weight', 'extraWeight', 'number')}
                             {renderInput('MT (Metric Ton)', 'mt', 'number')}
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
                              {renderInput('Vehicle Account', 'vehicleAccount')}
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

                        <fieldset className="mb-6">
                            <legend className="text-lg font-semibold text-primary mb-4 pb-2 border-b w-full">Financial Details</legend>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                 {renderInput('Weight', 'weight', 'number')}
                                 {renderInput('Extra Weight', 'extraWeight', 'number')}
                                 {renderInput('MT (Metric Ton)', 'mt', 'number')}
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
                                  {renderInput('Vehicle Account', 'vehicleAccount')}
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
                            <button type="button" onClick={onClose} className="w-full bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
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
