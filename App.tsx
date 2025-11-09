
import React, { useState, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Trips from './pages/Trips';
import Parties from './pages/Parties';
import Brokers from './pages/Brokers';
import Accounts from './pages/Accounts';
import Ocr from './pages/Ocr';
import { DataProvider } from './context/DataContext';

type Page = 'Dashboard' | 'Trips' | 'Parties' | 'Brokers' | 'Accounts' | 'Ocr';

const App: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<Page>('Dashboard');
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    const renderPage = () => {
        switch (currentPage) {
            case 'Dashboard':
                return <Dashboard />;
            case 'Trips':
                return <Trips />;
            case 'Parties':
                return <Parties />;
            case 'Brokers':
                return <Brokers />;
            case 'Accounts':
                return <Accounts />;
            case 'Ocr':
                return <Ocr />;
            default:
                return <Dashboard />;
        }
    };

    const pageTitle = useMemo(() => {
        switch (currentPage) {
            case 'Dashboard': return 'Dashboard Overview';
            case 'Trips': return 'Trip Management';
            case 'Parties': return 'Party Management';
            case 'Brokers': return 'Broker Management';
            case 'Accounts': return 'Accounts & Financial Summary';
            case 'Ocr': return 'Scan & Import from Image';
            default: return 'Dashboard';
        }
    }, [currentPage]);

    return (
        <DataProvider>
            <div className="flex h-screen bg-background text-text-primary">
                <Sidebar
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    isOpen={isSidebarOpen}
                    setIsOpen={setSidebarOpen}
                />
                <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
                    {isSidebarOpen && <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black opacity-50 z-20 md:hidden"></div>}
                    <Header
                        title={pageTitle}
                        onMenuClick={() => setSidebarOpen(!isSidebarOpen)}
                    />
                    <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                        {renderPage()}
                    </main>
                </div>
            </div>
        </DataProvider>
    );
};

export default App;
