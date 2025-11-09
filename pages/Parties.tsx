import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Party, PartyType, Trip } from '../types';
import PartyForm from '../components/PartyForm';
import TripForm from '../components/TripForm';
import ConfirmationModal from '../components/ConfirmationModal';

const Parties: React.FC = () => {
    const { parties, deleteParty, userRole, trips, deleteTrip } = useData();
    const [isPartyFormOpen, setIsPartyFormOpen] = useState(false);
    const [isTripFormOpen, setIsTripFormOpen] = useState(false);

    const [editingParty, setEditingParty] = useState<Party | null>(null);
    const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewingParty, setViewingParty] = useState<Party | null>(null);

    const [deletingParty, setDeletingParty] = useState<Party | null>(null);
    const [deletingTripId, setDeletingTripId] = useState<string | null>(null);

    const filteredParties = useMemo(() => {
        return parties.filter(party =>
            party.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [parties, searchTerm]);
    
    const partyTrips = useMemo(() => {
        if (!viewingParty) return [];
        return trips.filter(trip => trip.partyName === viewingParty.name).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [viewingParty, trips]);
    
    const tripsForDeletingParty = useMemo(() => {
        if (!deletingParty) return 0;
        return trips.filter(trip => trip.partyName === deletingParty.name).length;
    }, [deletingParty, trips]);


    const handleEditParty = (party: Party) => {
        setEditingParty(party);
        setIsPartyFormOpen(true);
    };

    const handleAddNewParty = () => {
        setEditingParty(null);
        setIsPartyFormOpen(true);
    };

    const handleDeletePartyClick = (party: Party) => {
        setDeletingParty(party);
    };

    const handleConfirmPartyDelete = () => {
        if (deletingParty) {
            deleteParty(deletingParty.id);
        }
    };
    
    const handleViewDetails = (party: Party) => {
        setViewingParty(party);
    };
    
    const handleEditTrip = (trip: Trip) => {
        setViewingParty(null); // Close party details modal first
        setEditingTrip(trip);
        setIsTripFormOpen(true);
    };

    const handleDeleteTripClick = (id: string) => {
        setDeletingTripId(id);
    };

    const handleConfirmTripDelete = () => {
        if(deletingTripId) {
            deleteTrip(deletingTripId);
        }
    };

    const handlePrint = (party: Party) => {
        const partyTrips = trips.filter(trip => trip.partyName === party.name).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        const tripRows = partyTrips.map(trip => `
            <tr class="border-b">
                <td class="py-2 px-3 text-center">${trip.serialNumber}</td>
                <td class="py-2 px-3">${new Date(trip.date).toLocaleDateString()}</td>
                <td class="py-2 px-3">${trip.vehicleNumber}</td>
                <td class="py-2 px-3">${trip.brokerName}</td>
                <td class="py-2 px-3 text-right">${trip.freight.toLocaleString()}</td>
                <td class="py-2 px-3 text-right">${trip.partyReceived.toLocaleString()}</td>
                <td class="py-2 px-3 text-right">${trip.partyBalance.toLocaleString()}</td>
            </tr>
        `).join('');

        const tripsTable = `
            <div class="mt-8">
                <h3 class="text-lg font-semibold text-gray-700 mb-2">Trip History</h3>
                <table class="w-full text-sm text-left">
                    <thead class="bg-gray-100 text-gray-600">
                        <tr>
                            <th class="py-2 px-3 text-center">S.No</th>
                            <th class="py-2 px-3">Date</th>
                            <th class="py-2 px-3">Vehicle</th>
                            <th class="py-2 px-3">Broker</th>
                            <th class="py-2 px-3 text-right">Freight (PKR)</th>
                            <th class="py-2 px-3 text-right">Received (PKR)</th>
                            <th class="py-2 px-3 text-right">Balance (PKR)</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tripRows.length > 0 ? tripRows : '<tr><td colspan="7" class="text-center py-4 text-gray-500">No trips found for this party.</td></tr>'}
                    </tbody>
                </table>
            </div>
        `;

        const printWindow = window.open('', '_blank');
        if (printWindow) {
            const printContent = `
                <html>
                    <head>
                        <title>Party Statement - ${party.name}</title>
                        <script src="https://cdn.tailwindcss.com"></script>
                    </head>
                    <body class="font-sans p-8 bg-gray-50">
                        <div class="max-w-4xl mx-auto bg-white p-10 rounded-lg shadow-lg border">
                            <div class="flex justify-between items-start border-b pb-4 mb-6">
                                <div>
                                    <h1 class="text-3xl font-bold text-gray-800">Hamza & Shahid Co</h1>
                                    <p class="text-gray-500">Statement of Account</p>
                                </div>
                                <div class="text-right">
                                    <p class="text-gray-600">Date: ${new Date().toLocaleDateString()}</p>
                                    <p class="text-gray-600">Party ID: ${party.id}</p>
                                </div>
                            </div>
                            <div class="mb-8 grid grid-cols-2 gap-x-8 gap-y-2">
                                <h2 class="col-span-2 text-xl font-semibold text-gray-700 mb-2">Party Details</h2>
                                <div><strong>Name:</strong> ${party.name}</div>
                                <div><strong>Contact:</strong> ${party.contact || 'N/A'}</div>
                                <div><strong>Type:</strong> ${party.type}</div>
                                <div><strong>Address:</strong> ${party.address || 'N/A'}</div>
                            </div>
                            
                            ${tripsTable}

                            <div class="mt-8 pt-4 border-t-2 border-gray-200 flex justify-end">
                                <div class="w-1/2">
                                    <div class="flex justify-between text-lg font-semibold">
                                        <span class="text-gray-800">Total Outstanding Balance:</span>
                                        <span class="text-blue-600">PKR ${party.outstandingBalance.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="mt-12 text-center text-xs text-gray-400">
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
                        placeholder="Search by Party Name..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="pl-4 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                        onClick={handleAddNewParty}
                        className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 w-full md:w-auto"
                    >
                        Add New Party
                    </button>
                </div>
                
                 {/* Mobile Card View */}
                <div className="md:hidden space-y-4">
                    {filteredParties.map(party => (
                        <div key={party.id} className="bg-white border rounded-lg p-4 shadow-sm">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-gray-800">{party.name}</p>
                                    <p className="text-sm text-gray-500">{party.type}</p>
                                </div>
                                <button onClick={() => handleViewDetails(party)} className="font-medium text-indigo-600 hover:underline">View</button>
                            </div>
                            <div className="mt-3 border-t pt-3 space-y-1 text-sm">
                                <p><span className="font-semibold text-gray-700">Contact:</span> {party.contact || 'N/A'}</p>
                                <p><span className="font-semibold text-gray-700">Balance:</span> <span className="font-bold text-primary">PKR {party.outstandingBalance.toLocaleString()}</span></p>
                            </div>
                             <div className="mt-3 border-t pt-2 flex items-center justify-end space-x-4">
                                <button onClick={() => handlePrint(party)} className="font-medium text-green-600 hover:underline text-sm">Print</button>
                                <button onClick={() => handleEditParty(party)} className="font-medium text-primary hover:underline text-sm">Edit</button>
                                {userRole === 'Admin' && (
                                    <button onClick={() => handleDeletePartyClick(party)} className="font-medium text-red-600 hover:underline text-sm">Delete</button>
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
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">Party Name</th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">Type</th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap hidden sm:table-cell">Contact</th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap hidden md:table-cell">Address</th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">Outstanding Balance</th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredParties.map(party => (
                                <tr key={party.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{party.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{party.type}</td>
                                    <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">{party.contact}</td>
                                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">{party.address}</td>
                                    <td className="px-6 py-4 font-semibold whitespace-nowrap">PKR {party.outstandingBalance.toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button onClick={() => handleViewDetails(party)} className="font-medium text-indigo-600 hover:underline mr-4">View</button>
                                        <button onClick={() => handlePrint(party)} className="font-medium text-green-600 hover:underline mr-4 hidden sm:inline">Print</button>
                                        <button onClick={() => handleEditParty(party)} className="font-medium text-primary hover:underline mr-4">Edit</button>
                                        {userRole === 'Admin' && (
                                            <button onClick={() => handleDeletePartyClick(party)} className="font-medium text-red-600 hover:underline">Delete</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredParties.length === 0 && <p className="text-center py-8 text-text-secondary">No parties found.</p>}
            </div>

            {isPartyFormOpen && (
                <PartyForm
                    party={editingParty}
                    onClose={() => setIsPartyFormOpen(false)}
                />
            )}

            {isTripFormOpen && (
                <TripForm
                    trip={editingTrip}
                    onClose={() => setIsTripFormOpen(false)}
                />
            )}

            {viewingParty && (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
                    <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">{viewingParty.name}</h2>
                            <p className="text-sm text-gray-500">Statement of Account</p>
                        </div>
                        <button onClick={() => setViewingParty(null)} className="text-gray-400 hover:text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    <div className="p-6 overflow-y-auto flex-1">
                        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="font-semibold text-gray-600">Contact</p>
                            <p className="text-gray-800">{viewingParty.contact || 'N/A'}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="font-semibold text-gray-600">Address</p>
                            <p className="text-gray-800">{viewingParty.address || 'N/A'}</p>
                        </div>
                        <div className="bg-primary/10 p-4 rounded-lg text-center">
                            <p className="font-semibold text-primary">Outstanding Balance</p>
                            <p className="text-primary text-xl font-bold">PKR {viewingParty.outstandingBalance.toLocaleString()}</p>
                        </div>
                        </div>

                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Trip History</h3>

                        {/* Mobile Card View for Trip History */}
                        <div className="md:hidden space-y-3">
                             {partyTrips.length > 0 ? partyTrips.map(trip => (
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
                                        <p><strong>Broker:</strong> {trip.brokerName}</p>
                                        <p><strong>Freight:</strong> {trip.freight.toLocaleString()}</p>
                                        <p><strong>Balance:</strong> <span className="font-bold text-red-600">{trip.partyBalance.toLocaleString()}</span></p>
                                    </div>
                                </div>
                             )) : <p className="text-center py-8 text-gray-500">No trips found for this party.</p>}
                        </div>

                        {/* Desktop Table View for Trip History */}
                        <div className="overflow-x-auto border rounded-lg hidden md:block">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-100 text-gray-600">
                                    <tr>
                                        <th className="py-2 px-3 text-center whitespace-nowrap">S.No</th>
                                        <th className="py-2 px-3 whitespace-nowrap">Date</th>
                                        <th className="py-2 px-3 whitespace-nowrap">Vehicle</th>
                                        <th className="py-2 px-3 whitespace-nowrap hidden sm:table-cell">Broker</th>
                                        <th className="py-2 px-3 text-right whitespace-nowrap">Freight (PKR)</th>
                                        <th className="py-2 px-3 text-right whitespace-nowrap hidden md:table-cell">Received (PKR)</th>
                                        <th className="py-2 px-3 text-right whitespace-nowrap">Balance (PKR)</th>
                                        <th className="py-2 px-3 text-center whitespace-nowrap">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {partyTrips.length > 0 ? partyTrips.map(trip => (
                                        <tr key={trip.id} className="border-b last:border-0 hover:bg-gray-50">
                                            <td className="py-2 px-3 text-center text-gray-700 whitespace-nowrap">{trip.serialNumber}</td>
                                            <td className="py-2 px-3 text-gray-700 whitespace-nowrap">{new Date(trip.date).toLocaleDateString()}</td>
                                            <td className="py-2 px-3 text-gray-700 whitespace-nowrap">{trip.vehicleNumber}</td>
                                            <td className="py-2 px-3 text-gray-700 whitespace-nowrap hidden sm:table-cell">{trip.brokerName}</td>
                                            <td className="py-2 px-3 text-right font-medium text-gray-800 whitespace-nowrap">{trip.freight.toLocaleString()}</td>
                                            <td className="py-2 px-3 text-right font-medium text-green-600 whitespace-nowrap hidden md:table-cell">{trip.partyReceived.toLocaleString()}</td>
                                            <td className="py-2 px-3 text-right font-medium text-red-600 whitespace-nowrap">{trip.partyBalance.toLocaleString()}</td>
                                            <td className="py-2 px-3 text-center whitespace-nowrap">
                                                <button onClick={() => handleEditTrip(trip)} className="font-medium text-primary hover:underline mr-3">Edit</button>
                                                {userRole === 'Admin' && (
                                                    <button onClick={() => handleDeleteTripClick(trip.id)} className="font-medium text-red-600 hover:underline">Delete</button>
                                                )}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan={8} className="text-center py-8 text-gray-500">No trips found for this party.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="px-6 py-4 bg-gray-50 border-t flex justify-end">
                        <button type="button" onClick={() => setViewingParty(null)} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                            Close
                        </button>
                    </div>
                </div>
            </div>
            )}
            
            <ConfirmationModal
                isOpen={!!deletingParty}
                onClose={() => setDeletingParty(null)}
                onConfirm={handleConfirmPartyDelete}
                title={`Delete Party: ${deletingParty?.name}`}
                message={
                    <>
                        This party is associated with <strong>{tripsForDeletingParty}</strong> trip record(s).
                        This action cannot be undone. To proceed, please type "<strong>{deletingParty?.name}</strong>" below.
                    </>
                }
                confirmationText={deletingParty?.name}
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

export default Parties;