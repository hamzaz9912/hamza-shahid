
import React, { useState, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Trips from './pages/Trips';
import Parties from './pages/Parties';
import Brokers from './pages/Brokers';
import Owners from './pages/Owners';
import Labour from './pages/Labour';
import ProductReceive from './pages/ProductReceive';
import Accounts from './pages/Accounts';
import Ocr from './pages/Ocr';
import { DataProvider } from './context/DataContext';

type Page = 'Dashboard' | 'Trips' | 'Parties' | 'Brokers' | 'Accounts' | 'Ocr' | 'Owners' | 'Labour' | 'ProductReceive';

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
            case 'Owners':
                return <Owners />;
            case 'Labour':
                return <Labour />;
            case 'ProductReceive':
                return <ProductReceive />;
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
            case 'Dashboard': return 'Dashboard Summary';
            case 'Trips': return 'Trip Management';
            case 'Parties': return 'Parties Management';
            case 'Brokers': return 'Brokers Management';
            case 'Owners': return 'Truck Owners Management';
            case 'Labour': return 'Labour Costs Management';
            case 'ProductReceive': return 'Product Receive Management';
            case 'Accounts': return 'Accounts and Financial Summary';
            case 'Ocr': return 'Scan and Import from Image';
            default: return 'Dashboard';
        }
    }, [currentPage]);

    return (
        <DataProvider>
            <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 text-gray-900">
                <Sidebar
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    isOpen={isSidebarOpen}
                    setIsOpen={setSidebarOpen}
                />
                <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-16'}`}>
                    <Header
                        title={pageTitle}
                        onMenuClick={() => setSidebarOpen(!isSidebarOpen)}
                    />
                    <main className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
                        <div className="max-w-7xl mx-auto">
                            {renderPage()}
                        </div>
                    </main>
                </div>
            </div>
        </DataProvider>
    );
};

export default App;
