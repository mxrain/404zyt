import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';


const CategoryMenu = ({ categories, depth = 0 }) => {
    const [hoveredCategory, setHoveredCategory] = useState(null);

    return (
        <ul className={`${styles.categoryList} ${depth === 0 ? styles.topLevelMenu : styles.subMenu}`}>
            {Object.entries(categories).map(([key, value]) => (
                <li
                    key={key}
                    className={styles.categoryItem}
                    onMouseEnter={() => setHoveredCategory(key)}
                    onMouseLeave={() => setHoveredCategory(null)}
                >
                    <Link to={`/category/${key}`} className={styles.categoryLink}>
                        <span style={{ fontWeight: value.items ? 'bold' : 'normal' }}>{key}</span>
                    </Link>
                    {value.items && hoveredCategory === key && (
                        <CategoryMenu categories={value.items} depth={depth + 1} />
                    )}
                </li>
            ))}
        </ul>
    );
};
const Header = () => {
    const [categories, setCategories] = useState({});
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    useEffect(() => {
        fetch('https://raw.githubusercontent.com/mxrain/404zyt/master/src/db/db.json')
            .then(response => response.json())
            .then(data => setCategories(data))
            .catch(error => console.error('Error fetching categories:', error));
    }, []);

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <Link to="/" className={styles.logo}>
                    <span className={styles.logoText}>资源桶</span>
                </Link>
                <nav className={styles.nav}>
                    <div
                        className={styles.menuContainer}
                        onMouseEnter={() => setIsMenuOpen(true)}
                        onMouseLeave={() => setIsMenuOpen(false)}
                    >
                        <button className={styles.menuButton}>
                            <span className={styles.menuText}>分类</span>
                            <svg className={styles.arrowDown} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                <path d="M562.5 771c-14.3 14.3-33.7 27.5-52 23.5-18.4 3.1-35.7-11.2-50-23.5L18.8 327.3c-22.4-22.4-22.4-59.2 0-81.6s59.2-22.4 81.6 0L511.5 668l412.1-422.3c22.4-22.4 59.2-22.4 81.6 0s22.4 59.2 0 81.6L562.5 771z" />
                            </svg>
                        </button>
                        {isMenuOpen && <CategoryMenu categories={categories} />}
                    </div>
                    <Link to="/resource-help" className={styles.menuButton}>
                        

                        <span className={styles.menuText}>资源求助</span>
                    </Link>
                </nav>
            </div>
        </header>
    )
}

export default Header;