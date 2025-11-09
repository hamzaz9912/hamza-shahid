
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
        address: '',
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
            [name]: name === 'outstandingBalance' ? parseFloat(value) || 0 : value
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                <div className="p-6 border-b">
                    <h2 className="text-xl font-bold text-gray-900">{party ? 'Edit Party' : 'Add New Party'}</h2>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Party Name<span className="text-red-500">*</span></label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700">Party Type</label>
                        <select name="type" id="type" value={formData.type} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                            <option value={PartyType.REGULAR}>Regular</option>
                            <option value={PartyType.ONETIME}>One-time</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="contact" className="block text-sm font-medium text-gray-700">Contact Information</label>
                        <input type="text" name="contact" id="contact" value={formData.contact} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                    </div>
                     <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                        <input type="text" name="address" id="address" value={formData.address} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                    </div>
                     <div>
                        <label htmlFor="outstandingBalance" className="block text-sm font-medium text-gray-700">Outstanding Balance</label>
                        <input type="number" name="outstandingBalance" id="outstandingBalance" value={formData.outstandingBalance} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                    </div>
                </div>
                <div className="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                    <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-700">{party ? 'Save Changes' : 'Create Party'}</button>
                </div>
            </form>
        </div>
    );
};

export default PartyForm;
