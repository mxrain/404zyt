import React from 'react'
import { useDispatch } from 'react-redux';
import { logout } from '../../../../features/auth/authSlice';
import { removeAllTabs } from '../../../../features/sysTabs/tabSlice';
import Cookies from 'js-cookie';
import styles from './Header.module.css';
import TabNav from '../TabNav/TabNav';

const Header = ({ userName, onLogout }) => {
    const dispatch = useDispatch();

    const handleClearCache = () => {
        // 清除 Redux store 中的所有 tabs
        dispatch(removeAllTabs());

        // 清除 localStorage
        // 已在 removeAllTabs 中处理

        // 清除 Cookies
        Cookies.remove('githubApi', { sameSite: 'None', secure: true });
        Cookies.remove('owner', { sameSite: 'None', secure: true });
        Cookies.remove('repo', { sameSite: 'None', secure: true });
        Cookies.remove('isAuthenticated', { sameSite: 'None', secure: true });

        // 退出登录
        dispatch(logout());

        // 刷新页面
        window.location.reload();
    };

    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerTop}>
                <h1 className={styles.title}>{'当前标题'}</h1>
                <div className={styles.userInfo}>
                    <span className={styles.welcome}>欢迎, {userName}</span>
                    <button onClick={onLogout} className={styles.logoutButton}>退出登录</button>
                    {/* 添加清除缓存按钮 */}
                    <button onClick={handleClearCache} className={styles.clearCacheButton}>
                        清除缓存
                    </button>
                </div>
            </div>
            <TabNav />
        </header>
    );
};

export default Header;