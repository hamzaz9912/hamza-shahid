
import React, { useState, useMemo, useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { DataProvider } from './context/DataContext';
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
import Login from './pages/Login';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { fetchTrips } from './store/slices/tripsSlice';
import { fetchBrokers } from './store/slices/brokersSlice';
import { fetchParties } from './store/slices/partiesSlice';
import { fetchOwners } from './store/slices/ownersSlice';
import { fetchLabours } from './store/slices/laboursSlice';
import { fetchProductReceives } from './store/slices/productReceivesSlice';
import { fetchPayments } from './store/slices/paymentsSlice';
import { setLoading } from './store/slices/uiSlice';
import { getCurrentUser } from './store/slices/authSlice';
import { Toaster } from 'react-hot-toast';

type Page = 'Dashboard' | 'Trips' | 'Parties' | 'Brokers' | 'Accounts' | 'Ocr' | 'Owners' | 'Labour' | 'ProductReceive';

const AppContent: React.FC = () => {
    const dispatch = useAppDispatch();
    const { loading } = useAppSelector(state => state.ui);
    const { isAuthenticated, user } = useAppSelector(state => state.auth);
    const [currentPage, setCurrentPage] = useState<Page>('Dashboard');
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    await dispatch(getCurrentUser()).unwrap();
                } catch (error) {
                    console.error('Failed to get current user:', error);
                    localStorage.removeItem('token'); // Remove invalid token
                }
            }
        };

        // Small delay to prevent infinite loading
        const timer = setTimeout(() => {
            initializeAuth();
        }, 100);

        return () => clearTimeout(timer);
    }, [dispatch]);

    useEffect(() => {
        if (isAuthenticated) {
            const loadData = async () => {
                dispatch(setLoading(true));
                try {
                    await Promise.all([
                        dispatch(fetchTrips()),
                        dispatch(fetchBrokers()),
                        dispatch(fetchParties()),
                        dispatch(fetchOwners()),
                        dispatch(fetchLabours()),
                        dispatch(fetchProductReceives()),
                        dispatch(fetchPayments())
                    ]);
                } catch (error) {
                    console.error('Error loading data:', error);
                } finally {
                    dispatch(setLoading(false));
                }
            };

            loadData();
        }
    }, [dispatch, isAuthenticated]);

    const renderPage = () => {
        if (!isAuthenticated) {
            return <Login />;
        }

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

    // Show loading only when authenticated and loading data
    if (isAuthenticated && loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
                <div className="text-center">
                    <div className="animate-bounce mx-auto">
                        <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8a1 1 0 001-1z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 18h1a1 1 0 001-1v-3.333a1 1 0 00-.4-1.333l-1.5-1A1 1 0 0016 12v4a1 1 0 001 1h1z" />
                        </svg>
                    </div>
                    <p className="mt-4 text-gray-600">Loading Transport Management System...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 text-gray-900">
            <Sidebar
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                isOpen={isSidebarOpen}
                setIsOpen={setSidebarOpen}
            />
            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-0 md:ml-64' : 'ml-0 md:ml-16'}`}>
                <Header
                    title={pageTitle}
                    onMenuClick={() => setSidebarOpen(!isSidebarOpen)}
                />
                <main className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-10 overflow-y-auto bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
                    <div className="max-w-7xl mx-auto">
                        {renderPage()}
                    </div>
                </main>
            </div>
            <Toaster />
        </div>
    );
};

const App: React.FC = () => {
    return (
        <Provider store={store}>
            <DataProvider>
                <AppContent />
            </DataProvider>
        </Provider>
    );
};

export default App;
