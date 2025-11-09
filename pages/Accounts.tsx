import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Payment } from '../types';
import PaymentModal from '../components/PaymentModal';

const Accounts: React.FC = () => {
    const { trips, parties, brokers, payments, addPayment, deletePayment } = useData();
    const [paymentModal, setPaymentModal] = useState<{
        isOpen: boolean;
        type: 'received' | 'paid';
        entityType: 'party' | 'broker';
        entityName: string;
        maxAmount?: number;
    }>({
        isOpen: false,
        type: 'received',
        entityType: 'party',
        entityName: '',
        maxAmount: 0
    });

    // Calculate payables (what we owe to brokers)
    const payables = brokers.map(broker => {
        const brokerTrips = trips.filter(trip => trip.brokerName === broker.name);
        const totalCommission = brokerTrips.reduce((sum, trip) => sum + trip.brokerageCommission, 0);
        return {
            id: broker.id,
            name: broker.name,
            type: 'Broker',
            amount: totalCommission,
            contact: broker.contact,
            station: broker.station,
            commissionRate: broker.commission,
            tripsCount: brokerTrips.length,
            dueDate: 'As per agreement'
        };
    });

    // Calculate receivables (what parties owe us)
    const receivables = parties.map(party => {
        const partyTrips = trips.filter(trip => trip.partyName === party.name);
        const totalOutstanding = partyTrips.reduce((sum, trip) => sum + trip.partyBalance, 0) + party.outstandingBalance;
        return {
            id: party.id,
            name: party.name,
            type: party.type === 'Regular' ? 'Regular Party' : 'One-time Party',
            amount: totalOutstanding,
            contact: party.contact,
            address: party.address,
            tripsCount: partyTrips.length,
            dueDate: 'As per agreement'
        };
    });

    // Calculate adjusted amounts based on payments
    const adjustedPayables = payables.map(payable => {
        const paidAmount = payments
            .filter(p => p.type === 'paid' && p.entityType === 'broker' && p.entityName === payable.name)
            .reduce((sum, p) => sum + p.amount, 0);
        return { ...payable, adjustedAmount: Math.max(0, payable.amount - paidAmount) };
    });

    const adjustedReceivables = receivables.map(receivable => {
        const receivedAmount = payments
            .filter(p => p.type === 'received' && p.entityType === 'party' && p.entityName === receivable.name)
            .reduce((sum, p) => sum + p.amount, 0);
        return { ...receivable, adjustedAmount: Math.max(0, receivable.amount - receivedAmount) };
    });

    const totalPayables = adjustedPayables.reduce((sum, item) => sum + item.adjustedAmount, 0);
    const totalReceivables = adjustedReceivables.reduce((sum, item) => sum + item.adjustedAmount, 0);
    const netPosition = totalReceivables - totalPayables;

    const handlePayment = (payment: Omit<Payment, 'id'>) => {
        addPayment(payment);
    };

    const openPaymentModal = (type: 'received' | 'paid', entityType: 'party' | 'broker', entityName: string, maxAmount: number) => {
        setPaymentModal({
            isOpen: true,
            type,
            entityType,
            entityName,
            maxAmount
        });
    };

    const closePaymentModal = () => {
        setPaymentModal(prev => ({ ...prev, isOpen: false }));
    };

    return (
        <div className="p-4 bg-gray-100 min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Accounts Summary</h1>
                <div className="text-sm text-gray-600">Financial overview and outstanding balances</div>
            </div>

            {/* Summary Panel */}
            <div className="bg-white border border-gray-300 mb-6">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-300">
                    <h2 className="font-semibold text-gray-800">Financial Summary</h2>
                </div>
                <div className="p-4">
                    <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                            <div className="text-sm text-gray-600 mb-1">Total Payables</div>
                            <div className="text-xl font-bold text-red-600">PKR {totalPayables.toLocaleString()}</div>
                            <div className="text-xs text-gray-500">Amount owed to brokers</div>
                        </div>
                        <div className="text-center border-l border-r border-gray-200">
                            <div className="text-sm text-gray-600 mb-1">Total Receivables</div>
                            <div className="text-xl font-bold text-green-600">PKR {totalReceivables.toLocaleString()}</div>
                            <div className="text-xs text-gray-500">Amount parties owe you</div>
                        </div>
                        <div className="text-center">
                            <div className="text-sm text-gray-600 mb-1">Net Position</div>
                            <div className={`text-xl font-bold ${netPosition >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                PKR {netPosition.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500">
                                {netPosition >= 0 ? 'Positive cash flow' : 'Negative cash flow'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payables Table */}
            <div className="bg-white border border-gray-300 mb-6">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-300">
                    <h2 className="font-semibold text-gray-800">Payables - Brokers to Pay</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-300">
                            <tr>
                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-r border-gray-200">Broker Name</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-r border-gray-200">Station</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-r border-gray-200">Contact</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-r border-gray-200">Commission Rate</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-r border-gray-200">Trips</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-r border-gray-200">Due Date</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-r border-gray-200">Outstanding</th>
                                <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {adjustedPayables.map((payable, index) => (
                                <tr key={payable.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    <td className="px-4 py-2 border-r border-gray-200 text-sm">{payable.name}</td>
                                    <td className="px-4 py-2 border-r border-gray-200 text-sm">{payable.station}</td>
                                    <td className="px-4 py-2 border-r border-gray-200 text-sm">{payable.contact}</td>
                                    <td className="px-4 py-2 border-r border-gray-200 text-sm">{payable.commissionRate}%</td>
                                    <td className="px-4 py-2 border-r border-gray-200 text-sm">{payable.tripsCount}</td>
                                    <td className="px-4 py-2 border-r border-gray-200 text-sm">{payable.dueDate}</td>
                                    <td className="px-4 py-2 border-r border-gray-200 text-sm font-semibold text-red-600">{payable.adjustedAmount.toLocaleString()}</td>
                                    <td className="px-4 py-2 text-center border-r border-gray-200">
                                        <button
                                            onClick={() => openPaymentModal('paid', 'broker', payable.name, payable.adjustedAmount)}
                                            className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                                        >
                                            Pay
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {payables.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-4 text-center text-gray-500 text-sm">No payables found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Receivables Table */}
            <div className="bg-white border border-gray-300">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-300">
                    <h2 className="font-semibold text-gray-800">Receivables - Parties Owe You</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-300">
                            <tr>
                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-r border-gray-200">Party Name</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-r border-gray-200">Type</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-r border-gray-200">Contact</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-r border-gray-200">Address</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-r border-gray-200">Trips</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-r border-gray-200">Due Date</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-r border-gray-200">Outstanding</th>
                                <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {adjustedReceivables.map((receivable, index) => (
                                <tr key={receivable.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    <td className="px-4 py-2 border-r border-gray-200 text-sm">{receivable.name}</td>
                                    <td className="px-4 py-2 border-r border-gray-200 text-sm">{receivable.type}</td>
                                    <td className="px-4 py-2 border-r border-gray-200 text-sm">{receivable.contact}</td>
                                    <td className="px-4 py-2 border-r border-gray-200 text-sm">{receivable.address}</td>
                                    <td className="px-4 py-2 border-r border-gray-200 text-sm">{receivable.tripsCount}</td>
                                    <td className="px-4 py-2 border-r border-gray-200 text-sm">{receivable.dueDate}</td>
                                    <td className="px-4 py-2 border-r border-gray-200 text-sm font-semibold text-green-600">{receivable.adjustedAmount.toLocaleString()}</td>
                                    <td className="px-4 py-2 text-center border-r border-gray-200">
                                        <button
                                            onClick={() => openPaymentModal('received', 'party', receivable.name, receivable.adjustedAmount)}
                                            className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                                        >
                                            Receive
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {receivables.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-4 text-center text-gray-500 text-sm">No receivables found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Payment History */}
            <div className="bg-white border border-gray-300 mt-6">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-300">
                    <h2 className="font-semibold text-gray-800">Payment History</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-300">
                            <tr>
                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-r border-gray-200">Date</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-r border-gray-200">Type</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-r border-gray-200">Entity</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-r border-gray-200">Description</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-r border-gray-200">Reference</th>
                                <th className="px-4 py-2 text-right text-sm font-semibold text-gray-700">Amount (PKR)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map((payment, index) => (
                                <tr key={payment.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    <td className="px-4 py-2 border-r border-gray-200 text-sm">{payment.date}</td>
                                    <td className="px-4 py-2 border-r border-gray-200 text-sm">
                                        <span className={`px-2 py-1 text-xs rounded ${
                                            payment.type === 'received' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                            {payment.type === 'received' ? 'Received' : 'Paid'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 border-r border-gray-200 text-sm">{payment.entityName}</td>
                                    <td className="px-4 py-2 border-r border-gray-200 text-sm">{payment.description}</td>
                                    <td className="px-4 py-2 border-r border-gray-200 text-sm">{payment.reference || '-'}</td>
                                    <td className="px-4 py-2 text-right text-sm font-semibold">
                                        <span className={payment.type === 'received' ? 'text-green-600' : 'text-red-600'}>
                                            {payment.amount.toLocaleString()}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {payments.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-4 text-center text-gray-500 text-sm">No payment history found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <PaymentModal
                isOpen={paymentModal.isOpen}
                onClose={closePaymentModal}
                onSubmit={handlePayment}
                type={paymentModal.type}
                entityType={paymentModal.entityType}
                entityName={paymentModal.entityName}
                maxAmount={paymentModal.maxAmount}
            />
        </div>
    );
};

export default Accounts;