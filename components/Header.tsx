
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
        <header className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-slate-200/50 h-auto md:h-20 flex flex-col md:flex-row items-start md:items-center justify-between p-6 flex-shrink-0 gap-4 md:gap-0">
            <div className="flex items-center w-full md:w-auto">
                <button
                    onClick={onMenuClick}
                    className="mr-4 p-2 rounded-lg text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-all duration-200"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
                    <p className="text-sm text-slate-500 mt-1">Transport Management System</p>
                </div>
            </div>
            <div className="flex items-center space-x-6 w-full md:w-auto justify-end">
                {/* Quick Stats */}
                <div className="hidden lg:flex items-center space-x-4">
                    <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-blue-700">System Online</span>
                    </div>
                </div>

                {/* User Role Selector */}
                <div className="relative">
                    <select
                        value={userRole}
                        onChange={(e) => setUserRole(e.target.value as UserRole)}
                        className="appearance-none bg-white border border-slate-300 rounded-lg py-2.5 pl-4 pr-10 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm hover:border-slate-400 transition-colors"
                    >
                        <option value="Admin">👑 Admin</option>
                        <option value="Staff">👤 Staff</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                        </svg>
                    </div>
                </div>

                {/* Welcome Message */}
                <div className="hidden md:flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                            {userRole === 'Admin' ? 'A' : 'S'}
                        </span>
                    </div>
                    <span className="text-sm font-medium text-slate-600">Welcome, {userRole}</span>
                </div>
            </div>
        </header>
    );
};

export default Header;
