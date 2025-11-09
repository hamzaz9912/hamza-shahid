import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Trip } from '../types';
import TripForm from '../components/TripForm';
import ConfirmationModal from '../components/ConfirmationModal';

const Trips: React.FC = () => {
    const { trips, deleteTrip, userRole } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [deletingTrip, setDeletingTrip] = useState<Trip | null>(null);

    const filteredTrips = useMemo(() => {
        return trips.filter(trip =>
            trip.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            trip.partyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            trip.brokerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            trip.serialNumber.toString().includes(searchTerm)
        );
    }, [trips, searchTerm]);
    
    const handleEdit = (trip: Trip) => {
        setEditingTrip(trip);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setEditingTrip(null);
        setIsModalOpen(true);
    };
    
    const handleDeleteClick = (trip: Trip) => {
        setDeletingTrip(trip);
    };
    
    const handleConfirmDelete = () => {
        if (deletingTrip) {
            deleteTrip(deletingTrip.id);
        }
    };
    
    return (
        <div className="bg-card p-4 sm:p-6 rounded-xl shadow-md">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                <div className="relative w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search by Vehicle, Party, S.No..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
                    </div>
                </div>
                <button
                    onClick={handleAddNew}
                    className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 w-full md:w-auto"
                >
                    Add New Trip
                </button>
            </div>
            
            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {filteredTrips.map(trip => (
                    <div key={trip.id} className="bg-white border rounded-lg p-4 shadow-sm">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-bold text-primary">S.No: {trip.serialNumber}</p>
                                <p className="text-sm text-gray-600">{trip.vehicleNumber}</p>
                            </div>
                            <div className="flex items-center space-x-2 flex-shrink-0">
                                <button onClick={() => handleEdit(trip)} className="font-medium text-primary hover:underline">Edit</button>
                                {userRole === 'Admin' && (
                                    <button onClick={() => handleDeleteClick(trip)} className="font-medium text-red-600 hover:underline">Delete</button>
                                )}
                            </div>
                        </div>
                        <div className="mt-3 border-t pt-3 space-y-1 text-sm">
                            <p><span className="font-semibold text-gray-700">Date:</span> {trip.date}</p>
                            <p><span className="font-semibold text-gray-700">Party:</span> {trip.partyName}</p>
                            <p><span className="font-semibold text-gray-700">Broker:</span> {trip.brokerName}</p>
                            <p className="mt-2"><span className="font-semibold text-gray-700">Total Fare:</span> <span className="font-bold text-text-primary">PKR {trip.freight.toLocaleString()}</span></p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop Table View */}
            <div className="overflow-x-auto hidden md:block">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 whitespace-nowrap">S.No</th>
                            <th scope="col" className="px-6 py-3 whitespace-nowrap">Date</th>
                            <th scope="col" className="px-6 py-3 whitespace-nowrap">Vehicle No.</th>
                            <th scope="col" className="px-6 py-3 whitespace-nowrap">Party Name</th>
                            <th scope="col" className="px-6 py-3 whitespace-nowrap">Broker Name</th>
                            <th scope="col" className="px-6 py-3 whitespace-nowrap">Total Fare</th>
                            <th scope="col" className="px-6 py-3 whitespace-nowrap">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTrips.map(trip => (
                            <tr key={trip.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{trip.serialNumber}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{trip.date}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{trip.vehicleNumber}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{trip.partyName}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{trip.brokerName}</td>
                                <td className="px-6 py-4 font-semibold whitespace-nowrap">PKR {trip.freight.toLocaleString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button onClick={() => handleEdit(trip)} className="font-medium text-primary hover:underline mr-4">Edit</button>
                                    {userRole === 'Admin' && (
                                        <button onClick={() => handleDeleteClick(trip)} className="font-medium text-red-600 hover:underline">Delete</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {(filteredTrips.length === 0) && <p className="text-center py-8 text-text-secondary">No trip records found.</p>}

            {isModalOpen && (
                <TripForm
                    trip={editingTrip}
                    onClose={() => setIsModalOpen(false)}
                />
            )}

            <ConfirmationModal
                isOpen={!!deletingTrip}
                onClose={() => setDeletingTrip(null)}
                onConfirm={handleConfirmDelete}
                title={`Delete Trip: S.No ${deletingTrip?.serialNumber}`}
                message={
                    <>
                        This action cannot be undone. To proceed, please type the serial number "<strong>{deletingTrip?.serialNumber}</strong>" below.
                    </>
                }
                confirmationText={deletingTrip?.serialNumber.toString()}
            />
        </div>
    );
};

export default Trips;