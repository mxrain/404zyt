import React from 'react'
import styles from './Header.module.css'
import TabNav from '../TabNav/TabNav'
import { useLocation } from 'react-router-dom';

const Header = ({ userName, onLogout }) => {
    const { title } = useLocation();
    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerTop}>
                <h1 className={styles.title}>{title}</h1>
                <div className={styles.userInfo}>
                    <span className={styles.welcome}>欢迎, {userName}</span>
                    <button onClick={onLogout} className={styles.logoutButton}>退出登录</button>
                </div>
            </div>
            <TabNav />
        </header>
    );
};

export default Header;