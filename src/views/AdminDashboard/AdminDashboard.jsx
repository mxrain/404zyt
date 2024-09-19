import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Outlet } from 'react-router-dom';
import { logout } from '../../features/auth/authSlice';
import styles from './AdminDashboard.module.css';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import Breadcrumb from './components/Breadcrumb/Breadcrumb';
import TabNav from './components/TabNav/TabNav';

const AdminDashboard = () => {
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <div className={styles.dashboardContainer}>
            <Sidebar />
            <main className={styles.mainContent}>
                <Header userName={user?.name} onLogout={handleLogout} />
                <div className={styles.pageContent}>
                    <Breadcrumb />
                    <TabNav />
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;

