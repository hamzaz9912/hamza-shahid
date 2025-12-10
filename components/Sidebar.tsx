import React from 'react';

// Icon components
const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
const TruckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8a1 1 0 001-1z" /><path strokeLinecap="round" strokeLinejoin="round" d="M18 18h1a1 1 0 001-1v-3.333a1 1 0 00-.4-1.333l-1.5-1A1 1 0 0016 12v4a1 1 0 001 1h1z" /></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 21a6 6 0 006-6v-1a3 3 0 00-3-3H6a3 3 0 00-3 3v1a6 6 0 006 6z" /></svg>;
const BriefcaseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const ScanIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
const AccountsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>;
const OwnerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>;
const LabourIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>;
const ProductIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>;


interface SidebarProps {
    currentPage: string;
    setCurrentPage: (page: 'Dashboard' | 'Trips' | 'Parties' | 'Brokers' | 'Accounts' | 'Ocr' | 'Owners' | 'Labour' | 'ProductReceive') => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

// Fix: Added 'setIsOpen' to the destructured props to resolve the "Cannot find name 'setIsOpen'" error.
const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, isOpen, setIsOpen }) => {
    const navItems = [
        { name: 'Dashboard', icon: <DashboardIcon />, page: 'Dashboard' as const },
        { name: 'Trips', icon: <TruckIcon />, page: 'Trips' as const },
        { name: 'Parties', icon: <UsersIcon />, page: 'Parties' as const },
        { name: 'Brokers', icon: <BriefcaseIcon />, page: 'Brokers' as const },
        { name: 'Owners', icon: <OwnerIcon />, page: 'Owners' as const },
        { name: 'Labour', icon: <LabourIcon />, page: 'Labour' as const },
        { name: 'Product Receive', icon: <ProductIcon />, page: 'ProductReceive' as const },
        { name: 'Accounts', icon: <AccountsIcon />, page: 'Accounts' as const },
        { name: 'Scan and Import', icon: <ScanIcon />, page: 'Ocr' as const },
    ];

    const handleNavClick = (page: 'Dashboard' | 'Trips' | 'Parties' | 'Brokers' | 'Accounts' | 'Ocr' | 'Owners' | 'Labour' | 'ProductReceive') => {
        setCurrentPage(page);
        // Don't auto-close on mobile anymore - let user control with hamburger button
    };

    return (
        <aside className={`fixed top-0 left-0 h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white transition-all duration-300 z-30 shadow-2xl border-r border-slate-700
            ${isOpen ? 'w-64 translate-x-0' : 'w-16 translate-x-0'}`}>
            <div className="flex flex-col h-full overflow-y-auto">
                {/* Logo Section */}
                <div className={`flex items-center h-20 px-4 flex-shrink-0 transition-all duration-300 bg-gradient-to-r from-blue-600 to-indigo-700 ${isOpen ? 'px-6' : 'px-2 justify-center'}`}>
                    <div className="flex items-center justify-center w-10 h-10 bg-white bg-opacity-20 rounded-lg">
                        <TruckIcon />
                    </div>
                    <div className={`ml-3 transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
                        <h1 className="text-sm font-bold whitespace-nowrap">Hamza & Shahid</h1>
                        <p className="text-xs text-blue-200">Transportes S.A.</p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 mt-4 px-2">
                    <ul className="space-y-1">
                        {navItems.map(item => (
                            <li key={item.name}>
                                <button
                                    onClick={() => handleNavClick(item.page)}
                                    className={`group flex items-center w-full py-3 rounded-lg transition-all duration-200 overflow-hidden hover:scale-105 ${
                                        !isOpen ? 'justify-center px-3' : 'px-3'
                                    } ${
                                        currentPage === item.page
                                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 border border-blue-500/30'
                                            : 'text-slate-300 hover:bg-slate-700/50 hover:text-white hover:shadow-md'
                                    }`}
                                >
                                    <div className={`flex items-center justify-center ${!isOpen ? 'w-6 h-6' : 'w-5 h-5'} ${
                                        currentPage === item.page ? 'text-blue-200' : 'text-slate-400 group-hover:text-blue-300'
                                    }`}>
                                        {item.icon}
                                    </div>
                                    <span className={`ml-3 font-medium whitespace-nowrap transition-opacity duration-200 text-sm ${
                                        isOpen ? 'opacity-100' : 'opacity-0'
                                    }`}>{item.name}</span>
                                    {currentPage === item.page && isOpen && (
                                        <div className="ml-auto w-2 h-2 bg-blue-300 rounded-full animate-pulse"></div>
                                    )}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Footer */}
                <div className={`px-3 py-3 border-t border-slate-700/50 ${isOpen ? 'px-4' : 'px-2'}`}>
                    <div className="text-xs text-slate-400 text-center">
                        <p>© 2024</p>
                        <p className={`mt-1 ${!isOpen ? 'hidden' : ''}`}>Transport Management</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
