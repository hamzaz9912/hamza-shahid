import React from 'react';
import { useData } from '../context/DataContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

// Fix: Replaced JSX.Element with React.ReactNode to resolve "Cannot find namespace 'JSX'" error.
const StatCard: React.FC<{ title: string; value: string; subtitle?: string; icon: React.ReactNode; trend?: string; color?: string }> = ({
    title,
    value,
    subtitle,
    icon,
    trend,
    color = "blue"
}) => {
    const colorClasses = {
        blue: "bg-blue-50 text-blue-600 border-blue-200",
        green: "bg-green-50 text-green-600 border-green-200",
        yellow: "bg-yellow-50 text-yellow-600 border-yellow-200",
        red: "bg-red-50 text-red-600 border-red-200",
        purple: "bg-purple-50 text-purple-600 border-purple-200"
    };

    return (
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-200/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
                    <p className="text-3xl font-bold text-slate-800 mb-1">{value}</p>
                    {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
                    {trend && <p className="text-xs text-green-600 font-medium mt-1">{trend}</p>}
                </div>
                <div className={`p-4 rounded-2xl border ${colorClasses[color as keyof typeof colorClasses]}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
};

const Dashboard: React.FC = () => {
    const { trips, parties, brokers, owners, labours, productReceives } = useData();

    // Financial Metrics
    const totalRevenue = trips.reduce((acc, trip) => acc + trip.freight, 0);
    const totalExpenses = trips.reduce((acc, trip) => acc + trip.laborCharges + trip.exciseCharges + trip.miscExpenses + trip.dailyWages, 0);
    const outstandingBalance = parties.reduce((acc, party) => acc + party.outstandingBalance, 0);
    const netProfit = totalRevenue - totalExpenses;

    // Fleet Metrics
    const totalTrucks = owners.reduce((acc, owner) => acc + owner.trucks.length, 0);
    const activeTrucks = owners.reduce((acc, owner) => acc + owner.trucks.filter(t => t.status === 'active').length, 0);
    const totalCapacity = owners.reduce((acc, owner) => acc + owner.trucks.reduce((sum, t) => sum + t.capacity, 0), 0);
    const maintenanceTrucks = owners.reduce((acc, owner) => acc + owner.trucks.filter(t => t.status === 'maintenance').length, 0);

    // Labour Metrics
    const totalLabourCost = labours.reduce((acc, labour) => acc + labour.cost, 0);
    const partyLabourCost = labours.filter(l => l.source === 'party').reduce((acc, l) => acc + l.cost, 0);
    const selfLabourCost = labours.filter(l => l.source === 'self').reduce((acc, l) => acc + l.cost, 0);

    // Product Metrics
    const totalProductsReceived = productReceives.reduce((acc, pr) => acc + pr.quantity, 0);

    // Financial Obligations
    const totalPartyDebit = parties.reduce((acc, party) => acc + party.debit, 0);
    const totalPartyCredit = parties.reduce((acc, party) => acc + party.credit, 0);
    const totalBrokerDebit = brokers.reduce((acc, broker) => acc + broker.debit, 0);
    const totalBrokerCredit = brokers.reduce((acc, broker) => acc + broker.credit, 0);

    const chartData = trips.slice(0, 10).map(trip => ({
        name: `Trip ${trip.serialNumber}`,
        Revenue: trip.freight,
        Expense: trip.laborCharges + trip.exciseCharges + trip.miscExpenses + trip.dailyWages
    }));

    // Fleet Status Distribution
    const fleetStatusData = [
        { name: 'Active', value: activeTrucks, color: '#10B981' },
        { name: 'Maintenance', value: maintenanceTrucks, color: '#F59E0B' },
        { name: 'Inactive', value: totalTrucks - activeTrucks - maintenanceTrucks, color: '#EF4444' }
    ].filter(item => item.value > 0);
    
    return (
        <div className="space-y-8">
            {/* Welcome Header */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">🚛 Transport Dashboard</h1>
                        <p className="text-blue-100 text-lg">Welcome back! Here's your fleet overview</p>
                    </div>
                    <div className="hidden lg:flex items-center space-x-4">
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                            <div className="text-2xl font-bold">{new Date().toLocaleDateString()}</div>
                            <div className="text-sm text-blue-200">Today's Date</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Fleet Size"
                    value={totalTrucks.toString()}
                    subtitle={`${activeTrucks} active trucks`}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8a1 1 0 001-1z" /><path strokeLinecap="round" strokeLinejoin="round" d="M18 18h1a1 1 0 001-1v-3.333a1 1 0 00-.4-1.333l-1.5-1A1 1 0 0016 12v4a1 1 0 001 1h1z" /></svg>}
                    color="blue"
                    trend={`${((activeTrucks/totalTrucks)*100).toFixed(0)}% operational`}
                />
                <StatCard
                    title="Total Capacity"
                    value={`${totalCapacity}t`}
                    subtitle="Load capacity"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>}
                    color="green"
                />
                <StatCard
                    title="Net Profit"
                    value={`PKR ${(netProfit / 100000).toFixed(2)}L`}
                    subtitle={`${((netProfit/totalRevenue)*100).toFixed(1)}% margin`}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>}
                    color={netProfit > 0 ? "green" : "red"}
                />
                <StatCard
                    title="Outstanding Balance"
                    value={`PKR ${(outstandingBalance / 100000).toFixed(2)}L`}
                    subtitle="From parties"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    color="yellow"
                />
            </div>

            {/* Financial Obligations Summary */}
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-200/50">
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" />
                    </svg>
                    Amounts to Return (Financial Obligations)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="text-sm text-red-600 font-medium">Total Party Debit</div>
                        <div className="text-2xl font-bold text-red-800">PKR {totalPartyDebit.toLocaleString()}</div>
                        <div className="text-xs text-red-500 mt-1">Amount I owe to parties</div>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="text-sm text-green-600 font-medium">Total Party Credit</div>
                        <div className="text-2xl font-bold text-green-800">PKR {totalPartyCredit.toLocaleString()}</div>
                        <div className="text-xs text-green-500 mt-1">Amount parties owe me</div>
                    </div>
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <div className="text-sm text-orange-600 font-medium">Total Broker Debit</div>
                        <div className="text-2xl font-bold text-orange-800">PKR {totalBrokerDebit.toLocaleString()}</div>
                        <div className="text-xs text-orange-500 mt-1">Amount I owe to brokers</div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="text-sm text-blue-600 font-medium">Total Broker Credit</div>
                        <div className="text-2xl font-bold text-blue-800">PKR {totalBrokerCredit.toLocaleString()}</div>
                        <div className="text-xs text-blue-500 mt-1">Amount brokers owe me</div>
                    </div>
                </div>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                        <h4 className="text-lg font-semibold text-slate-800 mb-3">Party Details</h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                            {parties.filter(p => p.debit > 0 || p.credit > 0).map(party => (
                                <div key={party.id} className="flex justify-between items-center text-sm">
                                    <span className="font-medium">{party.name}</span>
                                    <div className="flex gap-4">
                                        {party.debit > 0 && <span className="text-red-600">Owe: PKR {party.debit.toLocaleString()}</span>}
                                        {party.credit > 0 && <span className="text-green-600">Owed: PKR {party.credit.toLocaleString()}</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                        <h4 className="text-lg font-semibold text-slate-800 mb-3">Broker Details</h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                            {brokers.filter(b => b.debit > 0 || b.credit > 0).map(broker => (
                                <div key={broker.id} className="flex justify-between items-center text-sm">
                                    <span className="font-medium">{broker.name}</span>
                                    <div className="flex gap-4">
                                        {broker.debit > 0 && <span className="text-orange-600">Owe: PKR {broker.debit.toLocaleString()}</span>}
                                        {broker.credit > 0 && <span className="text-blue-600">Owed: PKR {broker.credit.toLocaleString()}</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Fleet Status & Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Fleet Status Pie Chart */}
                <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-200/50">
                    <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Fleet Status
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={fleetStatusData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {fleetStatusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Revenue Chart */}
                <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-200/50 lg:col-span-2">
                    <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Revenue vs Expenses (Recent Trips)
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                            <XAxis dataKey="name" stroke="#64748B" />
                            <YAxis stroke="#64748B" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'white',
                                    border: '1px solid #E2E8F0',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}
                            />
                            <Legend />
                            <Bar dataKey="Revenue" fill="#10B981" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="Expense" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
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
            
            {/* Additional Information Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Labour Costs */}
                <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-200/50">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-slate-800">Labour Costs</h3>
                        <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                        </svg>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-600">Total Cost</span>
                            <span className="font-bold text-slate-800">PKR {totalLabourCost.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-600">Party Labour</span>
                            <span className="font-semibold text-blue-600">PKR {partyLabourCost.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-600">Self Labour</span>
                            <span className="font-semibold text-green-600">PKR {selfLabourCost.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Product Received */}
                <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-200/50">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-slate-800">Products</h3>
                        <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-600">Total Received</span>
                            <span className="font-bold text-slate-800">{totalProductsReceived.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-600">Active Products</span>
                            <span className="font-semibold text-purple-600">{productReceives.length}</span>
                        </div>
                        <div className="text-xs text-slate-500 mt-2">
                            Product inventory tracking
                        </div>
                    </div>
                </div>

                {/* Top Parties */}
                <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-200/50">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Top Parties
                    </h3>
                    <div className="space-y-3">
                        {parties.sort((a,b) => b.outstandingBalance - a.outstandingBalance).slice(0, 3).map((party, index) => (
                            <div key={party.id} className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                                        {index + 1}
                                    </span>
                                    <span className="text-sm font-medium text-slate-700 truncate max-w-24">{party.name}</span>
                                </div>
                                <span className="font-bold text-slate-800 text-sm">PKR {(party.outstandingBalance / 1000).toFixed(0)}K</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Brokers Overview */}
                <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-200/50">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Brokers
                    </h3>
                    <div className="space-y-3">
                        {brokers.slice(0, 3).map(broker => (
                            <div key={broker.id} className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm font-medium text-slate-700">{broker.name}</p>
                                    <p className="text-xs text-slate-500">{broker.station}</p>
                                </div>
                                <span className="font-bold text-indigo-600">{broker.commission}%</span>
                            </div>
                        ))}
                        {brokers.length > 3 && (
                            <p className="text-xs text-slate-500 text-center mt-2">
                                +{brokers.length - 3} more brokers
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;