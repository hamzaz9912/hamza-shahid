
import React, { useState, useEffect } from 'react';
import { Broker } from '../types';
import { useData } from '../context/DataContext';

interface BrokerFormProps {
    broker: Broker | null;
    onClose: () => void;
}

const BrokerForm: React.FC<BrokerFormProps> = ({ broker, onClose }) => {
    const { addBroker, updateBroker } = useData();
    const [formData, setFormData] = useState<Omit<Broker, 'id'>>({
        name: '',
        commission: 0,
        contact: '',
        station: '',
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
            [name]: name === 'commission' ? parseFloat(value) || 0 : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (broker) {
            updateBroker({ ...formData, id: broker.id });
        } else {
            addBroker(formData);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                <div className="p-6 border-b">
                    <h2 className="text-xl font-bold text-gray-900">{broker ? 'Edit Broker' : 'Add New Broker'}</h2>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Broker Name<span className="text-red-500">*</span></label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                    </div>
                     <div>
                        <label htmlFor="commission" className="block text-sm font-medium text-gray-700">Commission (%)</label>
                        <input type="number" step="0.1" name="commission" id="commission" value={formData.commission} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="contact" className="block text-sm font-medium text-gray-700">Contact Information</label>
                        <input type="text" name="contact" id="contact" value={formData.contact} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                    </div>
                     <div>
                        <label htmlFor="station" className="block text-sm font-medium text-gray-700">Station / Location</label>
                        <input type="text" name="station" id="station" value={formData.station} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                    </div>
                </div>
                <div className="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                    <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-700">{broker ? 'Save Changes' : 'Create Broker'}</button>
                </div>
            </form>
        </div>
    );
};

export default BrokerForm;
