import React from 'react';
import { useData } from '../context/DataContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

// Fix: Replaced JSX.Element with React.ReactNode to resolve "Cannot find namespace 'JSX'" error.
const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-card p-6 rounded-xl shadow-md flex items-center justify-between">
        <div>
            <p className="text-sm font-medium text-text-secondary">{title}</p>
            <p className="text-2xl font-bold text-text-primary">{value}</p>
        </div>
        <div className="bg-primary/10 text-primary p-3 rounded-full">
            {icon}
        </div>
    </div>
);

const Dashboard: React.FC = () => {
    const { trips, parties, brokers } = useData();

    const totalRevenue = trips.reduce((acc, trip) => acc + trip.freight, 0);
    const totalExpenses = trips.reduce((acc, trip) => acc + trip.laborCharges + trip.exciseCharges + trip.miscExpenses + trip.dailyWages, 0);
    const outstandingBalance = parties.reduce((acc, party) => acc + party.outstandingBalance, 0);

    const chartData = trips.slice(0, 10).map(trip => ({
        name: `Trip ${trip.serialNumber}`,
        Revenue: trip.freight,
        Expense: trip.laborCharges + trip.exciseCharges + trip.miscExpenses + trip.dailyWages
    }));
    
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Trips" value={trips.length.toString()} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8a1 1 0 001-1z" /></svg>} />
                <StatCard title="Total Revenue" value={`PKR ${(totalRevenue / 100000).toFixed(2)}L`} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>} />
                <StatCard title="Total Expenses" value={`PKR ${(totalExpenses / 1000).toFixed(2)}K`} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>} />
                <StatCard title="Outstanding Balance" value={`PKR ${(outstandingBalance / 100000).toFixed(2)}L`} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-card p-6 rounded-xl shadow-md">
                    <h3 className="font-semibold text-lg mb-4">Recent Trips Overview</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Revenue" fill="#1D4ED8" />
                            <Bar dataKey="Expense" fill="#FBBF24" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                 <div className="bg-card p-6 rounded-xl shadow-md">
                    <h3 className="font-semibold text-lg mb-4">Revenue Trend</h3>
                    <ResponsiveContainer width="100%" height={300}>
                         <LineChart data={chartData}>
                             <CartesianGrid strokeDasharray="3 3" />
                             <XAxis dataKey="name" />
                             <YAxis />
                             <Tooltip />
                             <Legend />
                             <Line type="monotone" dataKey="Revenue" stroke="#1D4ED8" activeDot={{ r: 8 }} />
                             <Line type="monotone" dataKey="Expense" stroke="#FBBF24" />
                         </LineChart>
                     </ResponsiveContainer>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="bg-card p-6 rounded-xl shadow-md">
                    <h3 className="font-semibold text-lg mb-4">Top Parties by Balance</h3>
                     <ul>
                         {parties.sort((a,b) => b.outstandingBalance - a.outstandingBalance).slice(0, 5).map(party => (
                            <li key={party.id} className="flex justify-between items-center py-2 border-b last:border-none">
                                <span className="text-text-primary">{party.name}</span>
                                <span className="font-semibold text-primary">PKR {party.outstandingBalance.toLocaleString()}</span>
                            </li>
                         ))}
                     </ul>
                 </div>
                 <div className="bg-card p-6 rounded-xl shadow-md">
                    <h3 className="font-semibold text-lg mb-4">Brokers</h3>
                     <ul>
                         {brokers.map(broker => (
                            <li key={broker.id} className="flex justify-between items-center py-2 border-b last:border-none">
                                <div>
                                    <p className="text-text-primary">{broker.name}</p>
                                    <p className="text-sm text-text-secondary">{broker.station}</p>
                                </div>
                                <span className="font-semibold text-accent">{broker.commission}%</span>
                            </li>
                         ))}
                     </ul>
                 </div>
            </div>
        </div>
    );
};

export default Dashboard;