
import React from 'react';
import { useData } from '../context/DataContext';
import { UserRole } from '../types';

interface HeaderProps {
    title: string;
    onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onMenuClick }) => {
    const { userRole, setUserRole } = useData();

    return (
        <header className="bg-card shadow-sm h-auto md:h-16 flex flex-col md:flex-row items-start md:items-center justify-between p-4 sm:px-6 lg:px-8 flex-shrink-0 gap-4 md:gap-0">
            <div className="flex items-center w-full md:w-auto">
                 <button onClick={onMenuClick} className="mr-4 text-gray-500 hover:text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <h1 className="text-xl font-semibold text-text-primary">{title}</h1>
            </div>
            <div className="flex items-center space-x-4 w-full md:w-auto justify-end">
                <div className="relative">
                    <select
                        value={userRole}
                        onChange={(e) => setUserRole(e.target.value as UserRole)}
                        className="appearance-none bg-background border border-gray-300 rounded-md py-2 pl-3 pr-8 text-sm font-medium text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                        <option value="Admin">Admin</option>
                        <option value="Staff">Staff</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                </div>
                 <span className="text-sm font-medium text-text-secondary hidden sm:inline">Welcome, {userRole}</span>
            </div>
        </header>
    );
};

export default Header;
