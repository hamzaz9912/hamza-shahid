import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Owner } from '../types';
import ConfirmationModal from '../components/ConfirmationModal';

const Owners: React.FC = () => {
    const { owners, addOwner, updateOwner, deleteOwner, userRole, trips } = useData();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingOwner, setEditingOwner] = useState<Owner | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [deletingOwner, setDeletingOwner] = useState<Owner | null>(null);
    const [viewingOwner, setViewingOwner] = useState<Owner | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        trucks: [{
            vehicleNumber: '',
            vehicleSize: '',
            dimensions: { length: 0, width: 0, height: 0 },
            capacity: 0,
            registrationDate: '',
            insuranceExpiry: '',
            fitnessExpiry: '',
            status: 'active' as 'active' | 'inactive' | 'maintenance'
        }]
    });

    const filteredOwners = useMemo(() => {
        return owners.filter(owner =>
            owner.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [owners, searchTerm]);

    const handleAddNew = () => {
        setEditingOwner(null);
        setFormData({ name: '', trucks: [{ vehicleNumber: '', vehicleSize: '' }] });
        setIsFormOpen(true);
    };

    const handleEdit = (owner: Owner) => {
        setEditingOwner(owner);
        setFormData({
            name: owner.name,
            trucks: owner.trucks.length > 0 ? owner.trucks : [{
                vehicleNumber: '',
                vehicleSize: '',
                dimensions: { length: 0, width: 0, height: 0 },
                capacity: 0,
                registrationDate: '',
                insuranceExpiry: '',
                fitnessExpiry: '',
                status: 'active' as 'active' | 'inactive' | 'maintenance'
            }]
        });
        setIsFormOpen(true);
    };

    const handleDeleteClick = (owner: Owner) => {
        setDeletingOwner(owner);
    };

    const handleViewDetails = (owner: Owner) => {
        setViewingOwner(owner);
    };

    const handleConfirmDelete = () => {
        if (deletingOwner) {
            deleteOwner(deletingOwner.id);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const ownerData = {
            name: formData.name,
            trucks: formData.trucks.filter(truck => truck.vehicleNumber && truck.vehicleSize),
            debit: 0,
            credit: 0,
            outstandingBalance: 0,
            totalTrips: 0,
            totalEarnings: 0,
            totalPayments: 0
        };

        if (editingOwner) {
            await updateOwner({ ...editingOwner, ...ownerData });
        } else {
            await addOwner(ownerData);
        }
        setIsFormOpen(false);
    };

    const addTruck = () => {
        setFormData(prev => ({
            ...prev,
            trucks: [...prev.trucks, {
                vehicleNumber: '',
                vehicleSize: '',
                dimensions: { length: 0, width: 0, height: 0 },
                capacity: 0,
                registrationDate: '',
                insuranceExpiry: '',
                fitnessExpiry: '',
                status: 'active' as 'active' | 'inactive' | 'maintenance'
            }]
        }));
    };

    const updateTruck = (index: number, field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            trucks: prev.trucks.map((truck, i) =>
                i === index ? { ...truck, [field]: value } : truck
            )
        }));
    };

    const removeTruck = (index: number) => {
        setFormData(prev => ({
            ...prev,
            trucks: prev.trucks.filter((_, i) => i !== index)
        }));
    };

    return (
        <>
            <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-slate-200/50">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-800 mb-2">Truck Fleet Management</h2>
                        <p className="text-slate-600">Manage truck owners and their vehicle fleets</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                        <input
                            type="text"
                            placeholder="🔍 Search by Owner Name..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="pl-4 pr-4 py-3 border border-slate-300 rounded-xl w-full lg:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 backdrop-blur-sm shadow-sm"
                        />
                        <button
                            onClick={handleAddNew}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add New Owner
                        </button>
                    </div>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-6">
                    {filteredOwners.map(owner => (
                        <div key={owner.id} className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                            {/* Owner Header */}
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800 text-lg">{owner.name}</p>
                                        <p className="text-sm text-slate-500">{owner.trucks.length} truck{owner.trucks.length !== 1 ? 's' : ''} in fleet</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleViewDetails(owner)}
                                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                        title="View Details"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => handleEdit(owner)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Edit Owner"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                    {userRole === 'Admin' && (
                                        <button
                                            onClick={() => handleDeleteClick(owner)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete Owner"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Fleet Summary */}
                            <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-slate-50 rounded-xl">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-blue-600">{owner.trucks.filter(t => t.status === 'active').length}</p>
                                    <p className="text-xs text-slate-600">Active</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-slate-600">{owner.trucks.length}</p>
                                    <p className="text-xs text-slate-600">Total</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-green-600">{owner.trucks.reduce((sum, t) => sum + t.capacity, 0)}</p>
                                    <p className="text-xs text-slate-600">Capacity</p>
                                </div>
                            </div>

                            {/* Truck Details */}
                            <div className="space-y-3">
                                <h4 className="font-semibold text-slate-700 flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8a1 1 0 001-1z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18h1a1 1 0 001-1v-3.333a1 1 0 00-.4-1.333l-1.5-1A1 1 0 0016 12v4a1 1 0 001 1h1z" />
                                    </svg>
                                    Fleet Details
                                </h4>
                                {owner.trucks.map((truck, index) => (
                                    <div key={index} className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="font-semibold text-slate-800">{truck.vehicleNumber}</p>
                                                <p className="text-sm text-slate-600">{truck.vehicleSize}</p>
                                            </div>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                truck.status === 'active'
                                                    ? 'bg-green-100 text-green-800'
                                                    : truck.status === 'maintenance'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {truck.status}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                                            <div>Capacity: <span className="font-medium">{truck.capacity} tons</span></div>
                                            <div>Dimensions: <span className="font-medium">{truck.dimensions.length}×{truck.dimensions.width}×{truck.dimensions.height} ft</span></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Desktop Table View */}
                <div className="overflow-x-auto hidden md:block">
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                                <tr>
                                     <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Owner Details</th>
                                     <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Fleet Size</th>
                                     <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Active Trucks</th>
                                     <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Total Capacity</th>
                                     <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                                 </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {filteredOwners.map(owner => {
                                    const activeTrucks = owner.trucks.filter(t => t.status === 'active').length;
                                    const totalCapacity = owner.trucks.reduce((sum, truck) => sum + truck.capacity, 0);
                                    return (
                                        <tr key={owner.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-semibold text-slate-900">{owner.name}</div>
                                                        <div className="text-xs text-slate-500">Fleet Owner</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                     <span className="text-lg font-bold text-slate-900 mr-2">{owner.trucks.length}</span>
                                                     <span className="text-sm text-slate-600">trucks</span>
                                                 </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    activeTrucks === owner.trucks.length
                                                        ? 'bg-green-100 text-green-800'
                                                        : activeTrucks > 0
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {activeTrucks} active{activeTrucks !== 1 ? '' : ''}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                     <span className="text-lg font-bold text-green-600 mr-2">{totalCapacity}</span>
                                                     <span className="text-sm text-slate-600">tons</span>
                                                 </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center space-x-3">
                                                    <button
                                                        onClick={() => handleViewDetails(owner)}
                                                        className="text-indigo-600 hover:text-indigo-900 transition-colors flex items-center gap-1"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                        View
                                                    </button>
                                                    <button
                                                        onClick={() => handleEdit(owner)}
                                                        className="text-blue-600 hover:text-blue-900 transition-colors flex items-center gap-1"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                        Edit
                                                    </button>
                                                    {userRole === 'Admin' && (
                                                        <button
                                                            onClick={() => handleDeleteClick(owner)}
                                                            className="text-red-600 hover:text-red-900 transition-colors flex items-center gap-1"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                            Delete
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {filteredOwners.length === 0 && (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-slate-600 mb-2">No Fleet Owners Found</h3>
                        <p className="text-slate-500 mb-6">Get started by adding your first truck owner and their fleet.</p>
                        <button
                            onClick={handleAddNew}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 inline-flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add First Owner
                        </button>
                    </div>
                )}
            </div>

            {isFormOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-200">
                        <div className="p-8 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-3xl font-bold text-slate-800">
                                        {editingOwner ? 'Edit Fleet Owner' : 'Add New Fleet Owner'}
                                    </h2>
                                    <p className="text-slate-600 mt-1">
                                        {editingOwner ? 'Update owner details and truck fleet' : 'Create a new owner and add their trucks'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsFormOpen(false)}
                                    className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto flex-1 bg-slate-50">
                            {/* Owner Information Section */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-6">
                                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Owner Information
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Owner Name *</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-colors"
                                            placeholder="Enter owner full name"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Fleet Information Section */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8a1 1 0 001-1z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18h1a1 1 0 001-1v-3.333a1 1 0 00-.4-1.333l-1.5-1A1 1 0 0016 12v4a1 1 0 001 1h1z" />
                                        </svg>
                                        Truck Fleet Details
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={addTruck}
                                        className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 flex items-center gap-2 shadow-sm"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Add Truck
                                    </button>
                                </div>

                                {formData.trucks.length === 0 ? (
                                    <div className="text-center py-8 text-slate-500">
                                        <svg className="w-12 h-12 mx-auto mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8a1 1 0 001-1z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18h1a1 1 0 001-1v-3.333a1 1 0 00-.4-1.333l-1.5-1A1 1 0 0016 12v4a1 1 0 001 1h1z" />
                                        </svg>
                                        <p>No trucks added yet. Click "Add Truck" to get started.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {formData.trucks.map((truck, index) => (
                                            <div key={index} className="border border-slate-200 rounded-xl p-6 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h4 className="text-md font-semibold text-slate-800 flex items-center gap-2">
                                                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                                            <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                                                        </div>
                                                        Truck #{index + 1}
                                                    </h4>
                                                    {formData.trucks.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeTruck(index)}
                                                            className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 transition-colors"
                                                            title="Remove Truck"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 mb-2">Vehicle Number *</label>
                                                        <input
                                                            type="text"
                                                            placeholder="ABC-123"
                                                            value={truck.vehicleNumber}
                                                            onChange={e => updateTruck(index, 'vehicleNumber', e.target.value)}
                                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 mb-2">Vehicle Size</label>
                                                        <input
                                                            type="text"
                                                            placeholder="20ft / 40ft"
                                                            value={truck.vehicleSize}
                                                            onChange={e => updateTruck(index, 'vehicleSize', e.target.value)}
                                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 mb-2">Capacity (tons)</label>
                                                        <input
                                                            type="number"
                                                            placeholder="10"
                                                            value={truck.capacity || ''}
                                                            onChange={e => updateTruck(index, 'capacity', parseFloat(e.target.value) || 0)}
                                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                                            min="0"
                                                            step="0.1"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="mb-4">
                                                    <label className="block text-sm font-medium text-slate-700 mb-2">Dimensions (feet)</label>
                                                    <div className="grid grid-cols-3 gap-3">
                                                        <div>
                                                            <input
                                                                type="number"
                                                                placeholder="Length"
                                                                value={truck.dimensions?.length || ''}
                                                                onChange={e => updateTruck(index, 'dimensions', { ...truck.dimensions, length: parseFloat(e.target.value) || 0 })}
                                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                                                min="0"
                                                                step="0.1"
                                                            />
                                                            <span className="text-xs text-slate-500 mt-1 block">Length</span>
                                                        </div>
                                                        <div>
                                                            <input
                                                                type="number"
                                                                placeholder="Width"
                                                                value={truck.dimensions?.width || ''}
                                                                onChange={e => updateTruck(index, 'dimensions', { ...truck.dimensions, width: parseFloat(e.target.value) || 0 })}
                                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                                                min="0"
                                                                step="0.1"
                                                            />
                                                            <span className="text-xs text-slate-500 mt-1 block">Width</span>
                                                        </div>
                                                        <div>
                                                            <input
                                                                type="number"
                                                                placeholder="Height"
                                                                value={truck.dimensions?.height || ''}
                                                                onChange={e => updateTruck(index, 'dimensions', { ...truck.dimensions, height: parseFloat(e.target.value) || 0 })}
                                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                                                min="0"
                                                                step="0.1"
                                                            />
                                                            <span className="text-xs text-slate-500 mt-1 block">Height</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 mb-2">Registration Date</label>
                                                        <input
                                                            type="date"
                                                            value={truck.registrationDate || ''}
                                                            onChange={e => updateTruck(index, 'registrationDate', e.target.value)}
                                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 mb-2">Insurance Expiry</label>
                                                        <input
                                                            type="date"
                                                            value={truck.insuranceExpiry || ''}
                                                            onChange={e => updateTruck(index, 'insuranceExpiry', e.target.value)}
                                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 mb-2">Fitness Expiry</label>
                                                        <input
                                                            type="date"
                                                            value={truck.fitnessExpiry || ''}
                                                            onChange={e => updateTruck(index, 'fitnessExpiry', e.target.value)}
                                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                                                        <select
                                                            value={truck.status || 'active'}
                                                            onChange={e => updateTruck(index, 'status', e.target.value as 'active' | 'inactive' | 'maintenance')}
                                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                                        >
                                                            <option value="active">🟢 Active</option>
                                                            <option value="inactive">⚪ Inactive</option>
                                                            <option value="maintenance">🟡 Maintenance</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end gap-4 pt-6 border-t border-slate-200">
                                <button
                                    type="button"
                                    onClick={() => setIsFormOpen(false)}
                                    className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                                >
                                    {editingOwner ? 'Update Fleet Owner' : 'Create Fleet Owner'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Owner Details Modal */}
            {viewingOwner && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
                        <div className="p-8 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-bold text-slate-800">{viewingOwner.name}</h2>
                                        <p className="text-slate-600">Fleet Owner Profile</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setViewingOwner(null)}
                                    className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="p-8 overflow-y-auto flex-1">
                            {/* Financial Summary */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-green-600">Total Earnings</p>
                                            <p className="text-2xl font-bold text-green-800">PKR {viewingOwner.totalEarnings?.toLocaleString() || 0}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                                            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-red-600">Total Payments</p>
                                            <p className="text-2xl font-bold text-red-800">PKR {viewingOwner.totalPayments?.toLocaleString() || 0}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-blue-600">Total Trips</p>
                                            <p className="text-2xl font-bold text-blue-800">{viewingOwner.totalTrips || 0}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className={`border rounded-2xl p-6 ${viewingOwner.outstandingBalance >= 0 ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' : 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200'}`}>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${viewingOwner.outstandingBalance >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                                            <svg className={`w-5 h-5 ${viewingOwner.outstandingBalance >= 0 ? 'text-green-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className={`text-sm font-medium ${viewingOwner.outstandingBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>Outstanding Balance</p>
                                            <p className={`text-2xl font-bold ${viewingOwner.outstandingBalance >= 0 ? 'text-green-800' : 'text-red-800'}`}>
                                                PKR {Math.abs(viewingOwner.outstandingBalance || 0).toLocaleString()}
                                                {viewingOwner.outstandingBalance >= 0 ? ' (Owed to me)' : ' (I owe)'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Fleet Details */}
                            <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8">
                                <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8a1 1 0 001-1z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18h1a1 1 0 001-1v-3.333a1 1 0 00-.4-1.333l-1.5-1A1 1 0 0016 12v4a1 1 0 001 1h1z" />
                                    </svg>
                                    Fleet Details ({viewingOwner.trucks.length} trucks)
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {viewingOwner.trucks.map((truck, index) => {
                                        const truckTrips = trips.filter(t => t.vehicleNumber === truck.vehicleNumber);
                                        return (
                                            <div key={index} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div>
                                                        <h4 className="font-semibold text-slate-800">{truck.vehicleNumber}</h4>
                                                        <p className="text-sm text-slate-600">{truck.vehicleSize}</p>
                                                    </div>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                        truck.status === 'active'
                                                            ? 'bg-green-100 text-green-800'
                                                            : truck.status === 'maintenance'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {truck.status}
                                                    </span>
                                                </div>

                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-slate-600">Capacity:</span>
                                                        <span className="font-medium">{truck.capacity} tons</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-slate-600">Trips:</span>
                                                        <span className="font-medium">{truckTrips.length}</span>
                                                    </div>
                                                    {truckTrips.length > 0 && (
                                                        <div className="flex justify-between">
                                                            <span className="text-slate-600">Last Trip:</span>
                                                            <span className="font-medium">{new Date(Math.max(...truckTrips.map(t => new Date(t.date).getTime()))).toLocaleDateString()}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {truckTrips.length > 0 && (
                                                    <div className="mt-3 pt-3 border-t border-slate-200">
                                                        <p className="text-xs font-medium text-slate-700 mb-2">Recent Trips:</p>
                                                        <div className="space-y-1">
                                                            {truckTrips.slice(0, 3).map((trip, tripIndex) => (
                                                                <div key={tripIndex} className="flex justify-between text-xs">
                                                                    <span className="text-slate-600">S.No {trip.serialNumber}</span>
                                                                    <span className="font-medium">PKR {trip.vehicleBalance?.toLocaleString() || 0}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Trip History */}
                            <div className="bg-white rounded-2xl border border-slate-200 p-6">
                                <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    Trip History
                                </h3>

                                {(() => {
                                    const ownerTrips = trips.filter(trip =>
                                        viewingOwner.trucks.some(truck => truck.vehicleNumber === trip.vehicleNumber)
                                    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

                                    if (ownerTrips.length === 0) {
                                        return (
                                            <div className="text-center py-8 text-slate-500">
                                                <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                </svg>
                                                <p className="text-lg font-medium">No trips found</p>
                                                <p className="text-sm opacity-75">Trips associated with this owner's trucks will appear here</p>
                                            </div>
                                        );
                                    }

                                    return (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead className="bg-slate-50 border-b border-slate-200">
                                                    <tr>
                                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">S.No</th>
                                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Date</th>
                                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Vehicle</th>
                                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Party</th>
                                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Freight</th>
                                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Vehicle Balance</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-200">
                                                    {ownerTrips.map((trip, index) => (
                                                        <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                                                            <td className="px-4 py-3 text-sm font-medium text-slate-900">{trip.serialNumber}</td>
                                                            <td className="px-4 py-3 text-sm text-slate-600">{new Date(trip.date).toLocaleDateString()}</td>
                                                            <td className="px-4 py-3 text-sm text-slate-900">{trip.vehicleNumber}</td>
                                                            <td className="px-4 py-3 text-sm text-slate-600">{trip.partyName}</td>
                                                            <td className="px-4 py-3 text-sm font-medium text-green-600">PKR {trip.freight.toLocaleString()}</td>
                                                            <td className={`px-4 py-3 text-sm font-medium ${trip.vehicleBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                                PKR {trip.vehicleBalance?.toLocaleString() || 0}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>

                        <div className="px-8 py-6 bg-slate-50 border-t border-slate-200 flex justify-end">
                            <button
                                onClick={() => setViewingOwner(null)}
                                className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors font-medium"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmationModal
                isOpen={!!deletingOwner}
                onClose={() => setDeletingOwner(null)}
                onConfirm={handleConfirmDelete}
                title={`Delete Owner: ${deletingOwner?.name}`}
                message="Are you sure you want to delete this owner? This action cannot be undone."
            />
        </>
    );
};

export default Owners;