import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Outlet } from 'react-router-dom';
import { logout } from '../../features/auth/authSlice';
import styles from './AdminDashboard.module.css';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import Breadcrumb from './components/Breadcrumb/Breadcrumb';

const AdminDashboard = () => {
    const { user } = useSelector(state => state.auth);// 获取用户信息
    const dispatch = useDispatch(); // 获取dispatch函数
    const navigate = useNavigate(); // 获取导航函数

    const handleLogout = () => { // 登出函数
        dispatch(logout());// 调用登出函数
        navigate('/login');// 跳转到登录页面
    };

    return (
        <div className={styles.dashboardContainer}>
            <Sidebar />
            <main className={styles.mainContent}>
                <Header userName={user?.name} onLogout={handleLogout} />
                <div className={styles.pageContent}>
                    <Breadcrumb />
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;

