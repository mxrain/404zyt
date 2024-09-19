import React from 'react'
import styles from '../../AdminDashboard.module.css'

const Header = ({ userName, onLogout }) => {
    return (
        <header className={styles.header}>
            <h1>管理面板</h1>
            <div>
                <span>欢迎, {userName}</span>
                <button onClick={onLogout} className={styles.logoutButton}>退出登录</button>
            </div>
        </header>
    );
};

export default Header;