import React, { useState, useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { Broker, Trip } from '../types';
import BrokerForm from '../components/BrokerForm';
import ConfirmationModal from '../components/ConfirmationModal';
import TripForm from '../components/TripForm';
import { deleteBroker } from '../store/slices/brokersSlice';
import { deleteTrip } from '../store/slices/tripsSlice';

const Brokers: React.FC = () => {
    const dispatch = useAppDispatch();
    const { brokers } = useAppSelector(state => state.brokers);
    const { trips } = useAppSelector(state => state.trips);
    const { userRole } = useAppSelector(state => state.ui);
    const [isBrokerFormOpen, setIsBrokerFormOpen] = useState(false);
    const [isTripFormOpen, setIsTripFormOpen] = useState(false);

    const [editingBroker, setEditingBroker] = useState<Broker | null>(null);
    const [editingTrip, setEditingTrip] = useState<Trip | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    
    const [viewingBroker, setViewingBroker] = useState<Broker | null>(null);
    const [deletingBroker, setDeletingBroker] = useState<Broker | null>(null);
    const [deletingTripId, setDeletingTripId] = useState<string | null>(null);


    const filteredBrokers = useMemo(() => {
        return brokers.filter(broker =>
            broker.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [brokers, searchTerm]);
    
    const tripsForDeletingBroker = useMemo(() => {
        if (!deletingBroker) return 0;
        return trips.filter(trip => trip.brokerName === deletingBroker.name).length;
    }, [deletingBroker, trips]);

    const brokerTrips = useMemo(() => {
        if (!viewingBroker) return [];
        return trips.filter(trip => trip.brokerName === viewingBroker.name).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [viewingBroker, trips]);

    const totalCommission = useMemo(() => {
        return brokerTrips.reduce((acc, trip) => acc + trip.brokerageCommission, 0);
    }, [brokerTrips]);

    const handleEditBroker = (broker: Broker) => {
        setEditingBroker(broker);
        setIsBrokerFormOpen(true);
    };

    const handleAddNewBroker = () => {
        setEditingBroker(null);
        setIsBrokerFormOpen(true);
    };

    const handleDeleteBrokerClick = (broker: Broker) => {
        setDeletingBroker(broker);
    };

    const handleConfirmBrokerDelete = () => {
        if (deletingBroker) {
            dispatch(deleteBroker(deletingBroker.id || deletingBroker._id));
        }
    };

    const handleViewDetails = (broker: Broker) => {
        setViewingBroker(broker);
    };

    const handleEditTrip = (trip: Trip) => {
        setViewingBroker(null); // Close details modal
        setEditingTrip(trip);
        setIsTripFormOpen(true);
    };

    const handleDeleteTripClick = (id: string) => {
        setDeletingTripId(id);
    };

    const handleConfirmTripDelete = () => {
        if(deletingTripId) {
            dispatch(deleteTrip(deletingTripId));
        }
    };

    const handlePrint = (broker: Broker) => {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            const printContent = `
                <html>
                    <head>
                        <title>Broker Record - ${broker.name}</title>
                        <script src="https://cdn.tailwindcss.com"></script>
                    </head>
                    <body class="font-sans p-8 bg-gray-50">
                        <div class="max-w-2xl mx-auto bg-white p-10 rounded-lg shadow-lg border">
                            <div class="flex justify-between items-center border-b pb-4 mb-6">
                                <div>
                                    <h1 class="text-2xl font-bold text-gray-800">Hamza & Shahid Co</h1>
                                    <p class="text-gray-500">Broker Record Summary</p>
                                </div>
                                <div class="text-right">
                                    <p class="text-gray-600">Date: ${new Date().toLocaleDateString()}</p>
                                    <p class="text-gray-600">Broker ID: ${broker.id}</p>
                                </div>
                            </div>
                            <div class="mb-8">
                                <h2 class="text-xl font-semibold text-gray-700 mb-4">${broker.name}</h2>
                                <div class="grid grid-cols-2 gap-4 text-gray-600">
                                    <div><strong>Commission:</strong> ${broker.commission}%</div>
                                    <div><strong>Contact:</strong> ${broker.contact || 'N/A'}</div>
                                    <div class="col-span-2"><strong>Station:</strong> ${broker.station || 'N/A'}</div>
                                </div>
                            </div>
                            <div class="mt-10 text-center text-xs text-gray-400">
                                <p>This is a computer-generated document.</p>
                                <p>Hamza & Shahid Co - Your trusted logistics partner.</p>
                            </div>
                        </div>
                        <script>
                            setTimeout(() => {
                                window.print();
                                window.close();
                            }, 500);
                        </script>
                    </body>
                </html>
            `;
            printWindow.document.write(printContent);
            printWindow.document.close();
        }
    };
    
    return (
        <>
            <div className="bg-card p-4 sm:p-6 rounded-xl shadow-md">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Search by Broker Name..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="pl-4 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                        onClick={handleAddNewBroker}
                        className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 w-full md:w-auto"
                    >
                        Add New Broker
                    </button>
                </div>
                
                {/* Mobile Card View */}
                <div className="md:hidden space-y-4">
                    {filteredBrokers.map(broker => (
                         <div key={broker.id} className="bg-white border rounded-lg p-4 shadow-sm">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-gray-800">{broker.name}</p>
                                    <p className="text-sm text-gray-500">{broker.station}</p>
                                </div>
                                <button onClick={() => handleViewDetails(broker)} className="font-medium text-indigo-600 hover:underline">View</button>
                            </div>
                            <div className="mt-3 border-t pt-3 space-y-1 text-sm">
                                <p><span className="font-semibold text-gray-700">Contact:</span> {broker.contact || 'N/A'}</p>
                                <p><span className="font-semibold text-gray-700">Commission:</span> <span className="font-bold text-accent">{broker.commission}%</span></p>
                            </div>
                             <div className="mt-3 border-t pt-2 flex items-center justify-end space-x-4">
                                <button onClick={() => handlePrint(broker)} className="font-medium text-green-600 hover:underline text-sm">Print</button>
                                <button onClick={() => handleEditBroker(broker)} className="font-medium text-primary hover:underline text-sm">Edit</button>
                                {userRole === 'Admin' && (
                                    <button onClick={() => handleDeleteBrokerClick(broker)} className="font-medium text-red-600 hover:underline text-sm">Delete</button>
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
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">Broker Name</th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">Commission</th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap hidden sm:table-cell">Contact</th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap hidden md:table-cell">Station</th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBrokers.map(broker => (
                                <tr key={broker.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{broker.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{broker.commission}%</td>
                                    <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">{broker.contact}</td>
                                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">{broker.station}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button onClick={() => handleViewDetails(broker)} className="font-medium text-indigo-600 hover:underline mr-4">View</button>
                                        <button onClick={() => handlePrint(broker)} className="font-medium text-green-600 hover:underline mr-4 hidden sm:inline">Print</button>
                                        <button onClick={() => handleEditBroker(broker)} className="font-medium text-primary hover:underline mr-4">Edit</button>
                                        {userRole === 'Admin' && (
                                            <button onClick={() => handleDeleteBrokerClick(broker)} className="font-medium text-red-600 hover:underline">Delete</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredBrokers.length === 0 && <p className="text-center py-8 text-text-secondary">No brokers found.</p>}
            </div>

            {isBrokerFormOpen && (
                <BrokerForm
                    broker={editingBroker}
                    onClose={() => setIsBrokerFormOpen(false)}
                />
            )}
            
            {isTripFormOpen && (
                <TripForm
                    trip={editingTrip}
                    onClose={() => setIsTripFormOpen(false)}
                />
            )}

            {viewingBroker && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">{viewingBroker.name}</h2>
                                <p className="text-sm text-gray-500">Broker Transaction History</p>
                            </div>
                            <button onClick={() => setViewingBroker(null)} className="text-gray-400 hover:text-gray-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto flex-1">
                            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="font-semibold text-gray-600">Contact</p>
                                    <p className="text-gray-800">{viewingBroker.contact || 'N/A'}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="font-semibold text-gray-600">Station</p>
                                    <p className="text-gray-800">{viewingBroker.station || 'N/A'}</p>
                                </div>
                                <div className="bg-amber-100 p-4 rounded-lg text-center">
                                    <p className="font-semibold text-amber-800">Total Commission Earned</p>
                                    <p className="text-amber-600 text-xl font-bold">PKR {totalCommission.toLocaleString()}</p>
                                </div>
                            </div>

                            <h3 className="text-lg font-semibold text-gray-700 mb-2">Associated Trips</h3>
                            
                             {/* Mobile Card View for Trip History */}
                            <div className="md:hidden space-y-3">
                                {brokerTrips.length > 0 ? brokerTrips.map(trip => (
                                    <div key={trip.id} className="bg-gray-50 border rounded-lg p-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-semibold text-gray-800">S.No: {trip.serialNumber}</p>
                                                <p className="text-xs text-gray-500">{new Date(trip.date).toLocaleDateString()}</p>
                                            </div>
                                            <div className="flex items-center space-x-2 text-sm">
                                                <button onClick={() => handleEditTrip(trip)} className="font-medium text-primary hover:underline">Edit</button>
                                                {userRole === 'Admin' && (
                                                    <button onClick={() => handleDeleteTripClick(trip.id)} className="font-medium text-red-600 hover:underline">Delete</button>
                                                )}
                                            </div>
                                        </div>
                                        <div className="mt-2 pt-2 border-t text-xs space-y-1">
                                            <p><strong>Vehicle:</strong> {trip.vehicleNumber}</p>
                                            <p><strong>Party:</strong> {trip.partyName}</p>
                                            <p><strong>Commission:</strong> <span className="font-bold text-green-600">{trip.brokerageCommission.toLocaleString()}</span></p>
                                        </div>
                                    </div>
                                )) : <p className="text-center py-8 text-gray-500">No trips found for this broker.</p>}
                            </div>

                            {/* Desktop Table View for Trip History */}
                            <div className="overflow-x-auto border rounded-lg hidden md:block">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-100 text-gray-600">
                                        <tr>
                                            <th className="py-2 px-3 text-center whitespace-nowrap">S.No</th>
                                            <th className="py-2 px-3 whitespace-nowrap">Date</th>
                                            <th className="py-2 px-3 whitespace-nowrap">Vehicle</th>
                                            <th className="py-2 px-3 whitespace-nowrap hidden sm:table-cell">Party</th>
                                            <th className="py-2 px-3 text-right whitespace-nowrap">Freight (PKR)</th>
                                            <th className="py-2 px-3 text-right whitespace-nowrap">Commission (PKR)</th>
                                            <th className="py-2 px-3 text-center whitespace-nowrap">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {brokerTrips.length > 0 ? brokerTrips.map(trip => (
                                            <tr key={trip.id} className="border-b last:border-0 hover:bg-gray-50">
                                                <td className="py-2 px-3 text-center text-gray-700 whitespace-nowrap">{trip.serialNumber}</td>
                                                <td className="py-2 px-3 text-gray-700 whitespace-nowrap">{new Date(trip.date).toLocaleDateString()}</td>
                                                <td className="py-2 px-3 text-gray-700 whitespace-nowrap">{trip.vehicleNumber}</td>
                                                <td className="py-2 px-3 text-gray-700 whitespace-nowrap hidden sm:table-cell">{trip.partyName}</td>
                                                <td className="py-2 px-3 text-right font-medium text-gray-800 whitespace-nowrap">{trip.freight.toLocaleString()}</td>
                                                <td className="py-2 px-3 text-right font-medium text-green-600 whitespace-nowrap">{trip.brokerageCommission.toLocaleString()}</td>
                                                <td className="py-2 px-3 text-center whitespace-nowrap">
                                                    <button onClick={() => handleEditTrip(trip)} className="font-medium text-primary hover:underline mr-3">Edit</button>
                                                    {userRole === 'Admin' && (
                                                        <button onClick={() => handleDeleteTripClick(trip.id)} className="font-medium text-red-600 hover:underline">Delete</button>
                                                    )}
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan={7} className="text-center py-8 text-gray-500">No trips found for this broker.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end">
                            <button type="button" onClick={() => setViewingBroker(null)} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}


            <ConfirmationModal
                isOpen={!!deletingBroker}
                onClose={() => setDeletingBroker(null)}
                onConfirm={handleConfirmBrokerDelete}
                title={`Delete Broker: ${deletingBroker?.name}`}
                message={
                     <>
                        This broker is associated with <strong>{tripsForDeletingBroker}</strong> trip record(s).
                        This action cannot be undone. To proceed, please type "<strong>{deletingBroker?.name}</strong>" below.
                    </>
                }
                confirmationText={deletingBroker?.name}
            />

            <ConfirmationModal
                isOpen={!!deletingTripId}
                onClose={() => setDeletingTripId(null)}
                onConfirm={handleConfirmTripDelete}
                title="Delete Trip Record"
                message="Are you sure you want to delete this trip record? This action cannot be undone."
            />
        </>
    );
};

export default Brokers;