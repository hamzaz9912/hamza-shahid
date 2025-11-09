import React from 'react';

// Icon components
const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
const TruckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8a1 1 0 001-1z" /><path strokeLinecap="round" strokeLinejoin="round" d="M18 18h1a1 1 0 001-1v-3.333a1 1 0 00-.4-1.333l-1.5-1A1 1 0 0016 12v4a1 1 0 001 1h1z" /></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 21a6 6 0 006-6v-1a3 3 0 00-3-3H6a3 3 0 00-3 3v1a6 6 0 006 6z" /></svg>;
const BriefcaseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const ScanIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
const AccountsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>;


interface SidebarProps {
    currentPage: string;
    setCurrentPage: (page: 'Dashboard' | 'Trips' | 'Parties' | 'Brokers' | 'Accounts' | 'Ocr') => void;
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
        { name: 'Accounts', icon: <AccountsIcon />, page: 'Accounts' as const },
        { name: 'Scan & Import', icon: <ScanIcon />, page: 'Ocr' as const },
    ];

    const handleNavClick = (page: 'Dashboard' | 'Trips' | 'Parties' | 'Brokers' | 'Accounts' | 'Ocr') => {
        setCurrentPage(page);
        if (window.innerWidth < 768) { // md breakpoint
            setIsOpen(false);
        }
    };

    return (
        <aside className={`fixed top-0 left-0 h-full bg-secondary text-white transition-all duration-300 z-30 
            md:w-64 md:translate-x-0
            ${isOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full md:w-20'}`}>
            <div className="flex flex-col h-full overflow-y-auto">
                <div className={`flex items-center h-16 px-6 flex-shrink-0 transition-all duration-300 ${isOpen ? '' : 'justify-center'}`}>
                    <TruckIcon />
                    <h1 className={`ml-3 text-xl font-bold whitespace-nowrap transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 md:opacity-0'}`}>Hamza & Shahid Co</h1>
                </div>
                <nav className="flex-1 mt-8">
                    <ul>
                        {navItems.map(item => (
                            <li key={item.name} className="px-3">
                                <button
                                    onClick={() => handleNavClick(item.page)}
                                    className={`flex items-center w-full px-3 py-3 my-1 rounded-lg transition-colors duration-200 overflow-hidden ${!isOpen ? 'justify-center' : ''} ${currentPage === item.page ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                                >
                                    {item.icon}
                                    <span className={`ml-4 font-medium whitespace-nowrap transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 md:opacity-0'}`}>{item.name}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;
