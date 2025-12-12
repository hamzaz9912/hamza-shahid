
import React, { useState, useEffect } from 'react';
import { Broker } from '../types';
import { useAppDispatch } from '../store/hooks';
import { createBroker, updateBroker } from '../store/slices/brokersSlice';

interface BrokerFormProps {
    broker: Broker | null;
    onClose: () => void;
}

const BrokerForm: React.FC<BrokerFormProps> = ({ broker, onClose }) => {
    const dispatch = useAppDispatch();
    const [formData, setFormData] = useState<Omit<Broker, 'id'>>({
        name: '',
        commission: 0,
        contact: '',
        station: '',
        debit: 0,
        credit: 0,
    });

    useEffect(() => {
        if (broker) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { id, ...editableData } = broker;
            setFormData(editableData);
        }
    }, [broker]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: ['commission', 'debit', 'credit'].includes(name) ? parseFloat(value) || 0 : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (broker) {
            dispatch(updateBroker({ id: broker.id || broker._id, broker: { ...formData, id: broker.id } }));
        } else {
            dispatch(createBroker(formData));
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-xl w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-3xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
                <div className="p-3 sm:p-4 md:p-6 border-b">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">{broker ? 'Edit Broker' : 'Add New Broker'}</h2>
                </div>
                <div className="p-3 sm:p-4 md:p-6 overflow-y-auto flex-1">
                    {/* Basic Information */}
                    <fieldset className="mb-4 sm:mb-6">
                        <legend className="text-base sm:text-lg font-semibold text-primary mb-3 sm:mb-4 pb-2 border-b w-full">Basic Information</legend>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Broker Name<span className="text-red-500">*</span></label>
                                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm" />
                            </div>
                            <div>
                                <label htmlFor="commission" className="block text-sm font-medium text-gray-700">Commission (%)</label>
                                <input type="number" step="0.1" name="commission" id="commission" value={formData.commission} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm" />
                            </div>
                        </div>
                    </fieldset>

                    {/* Contact Information */}
                    <fieldset className="mb-4 sm:mb-6">
                        <legend className="text-base sm:text-lg font-semibold text-primary mb-3 sm:mb-4 pb-2 border-b w-full">Contact Information</legend>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div>
                                <label htmlFor="contact" className="block text-sm font-medium text-gray-700">Contact Number<span className="text-red-500">*</span></label>
                                <input type="text" name="contact" id="contact" value={formData.contact} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm" />
                            </div>
                            <div>
                                <label htmlFor="station" className="block text-sm font-medium text-gray-700">Station / Location</label>
                                <input type="text" name="station" id="station" value={formData.station} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm" />
                            </div>
                        </div>
                    </fieldset>

                    {/* Financial Information */}
                    <fieldset className="mb-4 sm:mb-6">
                        <legend className="text-base sm:text-lg font-semibold text-primary mb-3 sm:mb-4 pb-2 border-b w-full">Financial Information</legend>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div>
                                <label htmlFor="debit" className="block text-sm font-medium text-gray-700">Debit (Amount I Owe)</label>
                                <input type="number" name="debit" id="debit" value={formData.debit} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm" />
                            </div>
                            <div>
                                <label htmlFor="credit" className="block text-sm font-medium text-gray-700">Credit (Amount Broker Owes Me)</label>
                                <input type="number" name="credit" id="credit" value={formData.credit} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm" />
                            </div>
                        </div>
                    </fieldset>
                </div>
                <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 bg-gray-50 border-t flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-3 flex-shrink-0">
                    <div className="text-xs text-gray-500 text-center sm:text-left">
                        Fields marked with <span className="text-red-500">*</span> are required
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                        <button type="button" onClick={onClose} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 order-2 sm:order-1">
                            Cancel
                        </button>
                        <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary order-1 sm:order-2">
                            {broker ? 'Save Changes' : 'Create Broker'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default BrokerForm;
