
import React, { useState } from 'react';
import { useAppSelector } from '../store/hooks';
import TripForm from '../components/TripForm';
import { Trip } from '../types';

const Trips: React.FC = () => {
    const { trips } = useAppSelector(state => state.trips);
    const { user } = useAppSelector(state => state.auth);
    const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
    const [showForm, setShowForm] = useState(false);

    const handleEdit = (trip: Trip) => {
        setSelectedTrip(trip);
        setShowForm(true);
    };

    const handleClose = () => {
        setSelectedTrip(null);
        setShowForm(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Trips Management</h1>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Add New Trip
                </button>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {trips.map((trip) => (
                        <li key={trip.id || trip._id} className="px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        Trip #{trip.serialNumber} - {trip.vehicleNumber}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {trip.partyName} - {trip.brokerName} - {trip.date}
                                    </p>
                                </div>
                                {(user?.role === 'Admin' || user?.permissions.canEditTrips) && (
                                    <button
                                        onClick={() => handleEdit(trip)}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm"
                                    >
                                        Edit
                                    </button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {showForm && (
                <TripForm
                    trip={selectedTrip}
                    onClose={handleClose}
                />
            )}
        </div>
    );
};

export default Trips;