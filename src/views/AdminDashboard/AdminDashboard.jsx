import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../features/auth/authSlice';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
    const { isAuthenticated, githubApi, owner, repo } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) { 
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <div className={styles.dashboardContainer}>
            <h1>管理面板</h1>
            <div className={styles.infoSection}>
                <p>GitHub API: {githubApi ? '已设置' : '未设置'}</p>
                <p>仓库所有者: {owner}</p>
                <p>仓库名称: {repo}</p>
            </div>
            <div className={styles.actionSection}>
                <button onClick={handleLogout} className={styles.logoutButton}>
                    退出登录
                </button>
            </div>
            {/* 这里可以添加其他管理功能 */}
        </div>
    );
};

export default AdminDashboard;

