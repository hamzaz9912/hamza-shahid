
import React from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';

interface HeaderProps {
    title: string;
    onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onMenuClick }) => {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(state => state.auth);

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

                {/* Logout Button */}
                <button
                    onClick={() => dispatch(logout())}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                    Logout
                </button>

                {/* Welcome Message */}
                <div className="hidden md:flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                            {user?.role === 'Admin' ? 'A' : 'S'}
                        </span>
                    </div>
                    <span className="text-sm font-medium text-slate-600">Welcome, {user?.username} ({user?.role})</span>
                </div>
            </div>
        </header>
    );
};

export default Header;
