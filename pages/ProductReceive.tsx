import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { ProductReceive } from '../types';
import ConfirmationModal from '../components/ConfirmationModal';

const ProductReceivePage: React.FC = () => {
    const { productReceives, addProductReceive, updateProductReceive, deleteProductReceive, userRole } = useData();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProductReceive, setEditingProductReceive] = useState<ProductReceive | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [deletingProductReceive, setDeletingProductReceive] = useState<ProductReceive | null>(null);

    const [formData, setFormData] = useState({
        productName: '',
        quantity: 0,
        unit: '',
        receivedFrom: '',
        date: '',
        productType: '',
        truckDimensions: '',
        description: ''
    });

    const filteredProductReceives = useMemo(() => {
        return productReceives.filter(productReceive =>
            productReceive.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            productReceive.receivedFrom.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [productReceives, searchTerm]);

    const handleAddNew = () => {
        setEditingProductReceive(null);
        setFormData({
            productName: '',
            quantity: 0,
            unit: '',
            receivedFrom: '',
            date: new Date().toISOString().split('T')[0],
            productType: '',
            truckDimensions: '',
            description: ''
        });
        setIsFormOpen(true);
    };

    const handleEdit = (productReceive: ProductReceive) => {
        setEditingProductReceive(productReceive);
        setFormData({
            productName: productReceive.productName,
            quantity: productReceive.quantity,
            unit: productReceive.unit,
            receivedFrom: productReceive.receivedFrom,
            date: productReceive.date,
            productType: productReceive.productType,
            truckDimensions: productReceive.truckDimensions,
            description: productReceive.description
        });
        setIsFormOpen(true);
    };

    const handleDeleteClick = (productReceive: ProductReceive) => {
        setDeletingProductReceive(productReceive);
    };

    const handleConfirmDelete = () => {
        if (deletingProductReceive) {
            deleteProductReceive(deletingProductReceive.id);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingProductReceive) {
            await updateProductReceive({ ...editingProductReceive, ...formData });
        } else {
            await addProductReceive(formData);
        }
        setIsFormOpen(false);
    };

    return (
        <>
            <div className="bg-card p-4 sm:p-6 rounded-xl shadow-md">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Search by product name or received from..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="pl-4 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                        onClick={handleAddNew}
                        className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 w-full md:w-auto"
                    >
                        Add New Product Receive
                    </button>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-4">
                    {filteredProductReceives.map(productReceive => (
                        <div key={productReceive.id} className="bg-white border rounded-lg p-4 shadow-sm">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-gray-800">{productReceive.productName}</p>
                                    <p className="text-sm text-gray-500">{productReceive.quantity} {productReceive.unit}</p>
                                </div>
                                <p className="text-sm text-gray-500">{new Date(productReceive.date).toLocaleDateString()}</p>
                            </div>
                            <div className="mt-3 border-t pt-3 space-y-1 text-sm">
                                <p><span className="font-semibold text-gray-700">Received From:</span> {productReceive.receivedFrom}</p>
                                <p><span className="font-semibold text-gray-700">Description:</span> {productReceive.description || 'N/A'}</p>
                            </div>
                            <div className="mt-3 border-t pt-2 flex items-center justify-end space-x-4">
                                <button onClick={() => handleEdit(productReceive)} className="font-medium text-primary hover:underline text-sm">Edit</button>
                                {userRole === 'Admin' && (
                                    <button onClick={() => handleDeleteClick(productReceive)} className="font-medium text-red-600 hover:underline text-sm">Delete</button>
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
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">Product Name</th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">Quantity</th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">Received From</th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">Description</th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProductReceives.map(productReceive => (
                                <tr key={productReceive.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">{new Date(productReceive.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 font-medium whitespace-nowrap">{productReceive.productName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{productReceive.quantity} {productReceive.unit}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{productReceive.receivedFrom}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{productReceive.description || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button onClick={() => handleEdit(productReceive)} className="font-medium text-primary hover:underline mr-4">Edit</button>
                                        {userRole === 'Admin' && (
                                            <button onClick={() => handleDeleteClick(productReceive)} className="font-medium text-red-600 hover:underline">Delete</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredProductReceives.length === 0 && <p className="text-center py-8 text-text-secondary">No product receives found.</p>}
            </div>

            {isFormOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                            <h2 className="text-2xl font-bold text-gray-800">
                                {editingProductReceive ? 'Edit Product Receive' : 'Add New Product Receive'}
                            </h2>
                            <button onClick={() => setIsFormOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                                    <input
                                        type="text"
                                        value={formData.productName}
                                        onChange={e => setFormData(prev => ({ ...prev, productName: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        required
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

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                                    <input
                                        type="number"
                                        value={formData.quantity}
                                        onChange={e => setFormData(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        required
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                                    <input
                                        type="text"
                                        value={formData.unit}
                                        onChange={e => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        required
                                        placeholder="e.g., kg, tons, pieces"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Received From</label>
                                    <input
                                        type="text"
                                        value={formData.receivedFrom}
                                        onChange={e => setFormData(prev => ({ ...prev, receivedFrom: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Type</label>
                                    <input
                                        type="text"
                                        value={formData.productType}
                                        onChange={e => setFormData(prev => ({ ...prev, productType: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        required
                                        placeholder="e.g., Cement, Steel, Coal"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Truck Dimensions</label>
                                    <input
                                        type="text"
                                        value={formData.truckDimensions}
                                        onChange={e => setFormData(prev => ({ ...prev, truckDimensions: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        required
                                        placeholder="e.g., 20ft x 8ft x 10ft"
                                    />
                                </div>
                            </div>

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
                                    {editingProductReceive ? 'Update' : 'Add'} Product Receive
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ConfirmationModal
                isOpen={!!deletingProductReceive}
                onClose={() => setDeletingProductReceive(null)}
                onConfirm={handleConfirmDelete}
                title="Delete Product Receive"
                message="Are you sure you want to delete this product receive entry? This action cannot be undone."
            />
        </>
    );
};

export default ProductReceivePage;