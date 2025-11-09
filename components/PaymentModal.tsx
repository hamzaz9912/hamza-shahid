import React, { useState } from 'react';
import { Payment } from '../types';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (payment: Omit<Payment, 'id'>) => void;
    type: 'received' | 'paid';
    entityType: 'party' | 'broker';
    entityName: string;
    maxAmount?: number;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    type,
    entityType,
    entityName,
    maxAmount
}) => {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [reference, setReference] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const paymentAmount = parseFloat(amount);
        if (paymentAmount > 0) {
            onSubmit({
                date: new Date().toISOString().split('T')[0],
                type,
                entityType,
                entityName,
                amount: paymentAmount,
                description: description || `${type === 'received' ? 'Payment received' : 'Payment made'} to ${entityName}`,
                reference: reference || undefined
            });
            setAmount('');
            setDescription('');
            setReference('');
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">
                    {type === 'received' ? 'Receive Payment' : 'Make Payment'}
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                    {entityType === 'party' ? 'Party' : 'Broker'}: {entityName}
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Amount (PKR)
                        </label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter amount"
                            min="0"
                            step="0.01"
                            required
                        />
                        {maxAmount && (
                            <p className="text-xs text-gray-500 mt-1">
                                Maximum: PKR {maxAmount.toLocaleString()}
                            </p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Payment description"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Reference (Optional)
                        </label>
                        <input
                            type="text"
                            value={reference}
                            onChange={(e) => setReference(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Trip # or Invoice #"
                        />
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            {type === 'received' ? 'Receive Payment' : 'Make Payment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PaymentModal;