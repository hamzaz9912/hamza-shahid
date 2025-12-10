
import React, { useState, useEffect } from 'react';
import { Party, PartyType } from '../types';
import { useData } from '../context/DataContext';

interface PartyFormProps {
    party: Party | null;
    onClose: () => void;
}

const PartyForm: React.FC<PartyFormProps> = ({ party, onClose }) => {
    const { addParty, updateParty } = useData();
    const [formData, setFormData] = useState<Omit<Party, 'id'>>({
        name: '',
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
        outstandingBalance: 0,
    });

    useEffect(() => {
        if (party) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { id, ...editableData } = party;
            setFormData(editableData);
        }
    }, [party]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: ['outstandingBalance', 'debit', 'credit'].includes(name) ? parseFloat(value) || 0 : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (party) {
            updateParty({ ...formData, id: party.id });
        } else {
            addParty(formData);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-xl w-full max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
                <div className="p-3 sm:p-4 md:p-6 border-b">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">{party ? 'Edit Party' : 'Add New Party'}</h2>
                </div>
                <div className="p-3 sm:p-4 md:p-6 overflow-y-auto flex-1">
                    {/* Basic Information */}
                    <fieldset className="mb-4 sm:mb-6">
                        <legend className="text-base sm:text-lg font-semibold text-primary mb-3 sm:mb-4 pb-2 border-b w-full">Basic Information</legend>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Party Name<span className="text-red-500">*</span></label>
                                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm" />
                            </div>
                            <div>
                                <label htmlFor="type" className="block text-sm font-medium text-gray-700">Party Type</label>
                                <select name="type" id="type" value={formData.type} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm">
                                    <option value={PartyType.REGULAR}>Regular</option>
                                    <option value={PartyType.ONETIME}>One-time</option>
                                </select>
                            </div>
                        </div>
                    </fieldset>

                    {/* Contact Information */}
                    <fieldset className="mb-4 sm:mb-6">
                        <legend className="text-base sm:text-lg font-semibold text-primary mb-3 sm:mb-4 pb-2 border-b w-full">Contact Information</legend>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div>
                                <label htmlFor="contact" className="block text-sm font-medium text-gray-700">Contact Person</label>
                                <input type="text" name="contact" id="contact" value={formData.contact} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm" />
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                                <input type="text" name="phone" id="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm" />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                                <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm" />
                            </div>
                        </div>
                    </fieldset>

                    {/* Address Information */}
                    <fieldset className="mb-4 sm:mb-6">
                        <legend className="text-base sm:text-lg font-semibold text-primary mb-3 sm:mb-4 pb-2 border-b w-full">Address Information</legend>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div className="sm:col-span-2">
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                                <input type="text" name="address" id="address" value={formData.address} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm" />
                            </div>
                            <div>
                                <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                                <input type="text" name="city" id="city" value={formData.city} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm" />
                            </div>
                            <div>
                                <label htmlFor="businessType" className="block text-sm font-medium text-gray-700">Business Type</label>
                                <input type="text" name="businessType" id="businessType" value={formData.businessType} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm" placeholder="e.g., Trading, Manufacturing" />
                            </div>
                        </div>
                    </fieldset>

                    {/* Business & Tax Information */}
                    <fieldset className="mb-4 sm:mb-6">
                        <legend className="text-base sm:text-lg font-semibold text-primary mb-3 sm:mb-4 pb-2 border-b w-full">Business & Tax Information</legend>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div>
                                <label htmlFor="gstNumber" className="block text-sm font-medium text-gray-700">GST Number</label>
                                <input type="text" name="gstNumber" id="gstNumber" value={formData.gstNumber} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm" />
                            </div>
                            <div>
                                <label htmlFor="panNumber" className="block text-sm font-medium text-gray-700">PAN Number</label>
                                <input type="text" name="panNumber" id="panNumber" value={formData.panNumber} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm" />
                            </div>
                        </div>
                    </fieldset>

                    {/* Financial Information */}
                    <fieldset className="mb-4 sm:mb-6">
                        <legend className="text-base sm:text-lg font-semibold text-primary mb-3 sm:mb-4 pb-2 border-b w-full">Financial Information</legend>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                            <div>
                                <label htmlFor="debit" className="block text-sm font-medium text-gray-700">Debit (Amount I Owe)</label>
                                <input type="number" name="debit" id="debit" value={formData.debit} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm" />
                            </div>
                            <div>
                                <label htmlFor="credit" className="block text-sm font-medium text-gray-700">Credit (Amount Party Owes Me)</label>
                                <input type="number" name="credit" id="credit" value={formData.credit} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm" />
                            </div>
                            <div className="sm:col-span-2 lg:col-span-1">
                                <label htmlFor="outstandingBalance" className="block text-sm font-medium text-gray-700">Outstanding Balance</label>
                                <input type="number" name="outstandingBalance" id="outstandingBalance" value={formData.outstandingBalance} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm" />
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
                            {party ? 'Save Changes' : 'Create Party'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default PartyForm;
