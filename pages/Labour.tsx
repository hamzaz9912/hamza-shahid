 import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Labour } from '../types';
import ConfirmationModal from '../components/ConfirmationModal';

const LabourPage: React.FC = () => {
    const { labours, addLabour, updateLabour, deleteLabour, userRole } = useData();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingLabour, setEditingLabour] = useState<Labour | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [deletingLabour, setDeletingLabour] = useState<Labour | null>(null);

    const [formData, setFormData] = useState({
        cost: 0,
        source: 'party' as 'party' | 'self',
        selfName: '' as 'hamza' | 'shahid' | '',
        partyName: '',
        date: '',
        description: ''
    });

    const filteredLabours = useMemo(() => {
        return labours.filter(labour =>
            labour.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            labour.partyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            labour.selfName?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [labours, searchTerm]);

    const handleAddNew = () => {
        setEditingLabour(null);
        setFormData({
            cost: 0,
            source: 'party',
            selfName: '',
            partyName: '',
            date: new Date().toISOString().split('T')[0],
            description: ''
        });
        setIsFormOpen(true);
    };

    const handleEdit = (labour: Labour) => {
        setEditingLabour(labour);
        setFormData({
            cost: labour.cost,
            source: labour.source,
            selfName: labour.selfName || '',
            partyName: labour.partyName || '',
            date: labour.date,
            description: labour.description
        });
        setIsFormOpen(true);
    };

    const handleDeleteClick = (labour: Labour) => {
        setDeletingLabour(labour);
    };

    const handleConfirmDelete = () => {
        if (deletingLabour) {
            deleteLabour(deletingLabour.id);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const labourData = {
            cost: formData.cost,
            source: formData.source,
            date: formData.date,
            description: formData.description,
            ...(formData.source === 'self' && { selfName: formData.selfName }),
            ...(formData.source === 'party' && { partyName: formData.partyName })
        };

        if (editingLabour) {
            await updateLabour({ ...editingLabour, ...labourData });
        } else {
            await addLabour(labourData);
        }
        setIsFormOpen(false);
    };

    return (
        <>
            <div className="bg-card p-4 sm:p-6 rounded-xl shadow-md">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Search by description or name..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="pl-4 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                        onClick={handleAddNew}
                        className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 w-full md:w-auto"
                    >
                        Add New Labour Entry
                    </button>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-4">
                    {filteredLabours.map(labour => (
                        <div key={labour.id} className="bg-white border rounded-lg p-4 shadow-sm">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-gray-800">PKR {labour.cost.toLocaleString()}</p>
                                    <p className="text-sm text-gray-500">{labour.source === 'self' ? `Self (${labour.selfName})` : `Party (${labour.partyName})`}</p>
                                </div>
                                <p className="text-sm text-gray-500">{new Date(labour.date).toLocaleDateString()}</p>
                            </div>
                            <div className="mt-3 border-t pt-3 space-y-1 text-sm">
                                <p><span className="font-semibold text-gray-700">Description:</span> {labour.description || 'N/A'}</p>
                            </div>
                            <div className="mt-3 border-t pt-2 flex items-center justify-end space-x-4">
                                <button onClick={() => handleEdit(labour)} className="font-medium text-primary hover:underline text-sm">Edit</button>
                                {userRole === 'Admin' && (
                                    <button onClick={() => handleDeleteClick(labour)} className="font-medium text-red-600 hover:underline text-sm">Delete</button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Desktop Table View */}
                <div className="overflow-x-auto hidden md:block">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">Date</th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">Cost</th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">Source</th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">Description</th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLabours.map(labour => (
                                <tr key={labour.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">{new Date(labour.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 font-medium whitespace-nowrap">PKR {labour.cost.toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {labour.source === 'self' ? `Self (${labour.selfName})` : `Party (${labour.partyName})`}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">{labour.description || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button onClick={() => handleEdit(labour)} className="font-medium text-primary hover:underline mr-4">Edit</button>
                                        {userRole === 'Admin' && (
                                            <button onClick={() => handleDeleteClick(labour)} className="font-medium text-red-600 hover:underline">Delete</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredLabours.length === 0 && <p className="text-center py-8 text-text-secondary">No labour entries found.</p>}
            </div>

            {isFormOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                            <h2 className="text-2xl font-bold text-gray-800">
                                {editingLabour ? 'Edit Labour Entry' : 'Add New Labour Entry'}
                            </h2>
                            <button onClick={() => setIsFormOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Cost (PKR)</label>
                                    <input
                                        type="number"
                                        value={formData.cost}
                                        onChange={e => setFormData(prev => ({ ...prev, cost: Number(e.target.value) }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        required
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                                    <input
                                        type="date"
                                        value={formData.date}
                                        onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Source</label>
                                <select
                                    value={formData.source}
                                    onChange={e => setFormData(prev => ({ ...prev, source: e.target.value as 'party' | 'self' }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="party">Party</option>
                                    <option value="self">Self</option>
                                </select>
                            </div>

                            {formData.source === 'party' && (
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Party Name</label>
                                    <input
                                        type="text"
                                        value={formData.partyName}
                                        onChange={e => setFormData(prev => ({ ...prev, partyName: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        required
                                    />
                                </div>
                            )}

                            {formData.source === 'self' && (
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Self Name</label>
                                    <select
                                        value={formData.selfName}
                                        onChange={e => setFormData(prev => ({ ...prev, selfName: e.target.value as 'hamza' | 'shahid' }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        required
                                    >
                                        <option value="">Select</option>
                                        <option value="hamza">Hamza</option>
                                        <option value="shahid">Shahid</option>
                                    </select>
                                </div>
                            )}

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                    rows={3}
                                />
                            </div>

                            <div className="flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => setIsFormOpen(false)}
                                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700"
                                >
                                    {editingLabour ? 'Update' : 'Add'} Entry
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ConfirmationModal
                isOpen={!!deletingLabour}
                onClose={() => setDeletingLabour(null)}
                onConfirm={handleConfirmDelete}
                title="Delete Labour Entry"
                message="Are you sure you want to delete this labour entry? This action cannot be undone."
            />
        </>
    );
};

export default LabourPage;