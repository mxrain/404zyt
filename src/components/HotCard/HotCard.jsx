import React, { useState } from 'react';
import styles from './HotCard.module.css';
import { Link } from 'react-router-dom';

const HotCard = ({ hot, title }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5; // 每页显示的项目数
    const pageCount = Math.ceil(hot.length / itemsPerPage);

    const nextPage = () => {
        setCurrentPage((prev) => (prev + 1) % pageCount);
    };

    const prevPage = () => {
        setCurrentPage((prev) => (prev - 1 + pageCount) % pageCount);
    };

    const currentItems = hot.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    return (
        <div className={styles.hotCard}>
            <h2 className={styles.title}>{title}</h2>
            <ul className={styles.list}>
                {currentItems.map((item) => (
                    <li key={item.id} className={styles.item}>
                        <Link to={`/hot/${item.id}`} className={styles.link}>
                            <div className={styles.itemContent}>
                                <span className={styles.itemTitle}>{item.title}</span>
                                {item.imageUrl && <img src={item.imageUrl} alt={item.title} className={styles.itemImage} />}
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
            <div className={styles.navigation}>
                <button onClick={prevPage} className={styles.navButton}>&lt;</button>
                <div className={styles.pageIndicator}>
                    {[...Array(pageCount)].map((_, index) => (
                        <span
                            key={index}
                            className={`${styles.dot} ${index === currentPage ? styles.activeDot : ''}`}
                        />
                    ))}
                </div>
                <button onClick={nextPage} className={styles.navButton}>&gt;</button>
            </div>
        </div>
    );
};

export default HotCard;