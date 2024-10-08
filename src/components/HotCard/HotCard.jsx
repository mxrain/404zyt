import React, { useState } from 'react';
import styles from './HotCard.module.css';
import { Link } from 'react-router-dom';

const HotCard = ({ hot, title }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 8;
    const pageCount = Math.ceil(hot.length / itemsPerPage);

    const nextPage = () => {
        setCurrentPage((prev) => (prev + 1) % pageCount);
    };

    const prevPage = () => {
        setCurrentPage((prev) => (prev - 1 + pageCount) % pageCount);
    };

    const goToPage = (pageIndex) => {
        setCurrentPage(pageIndex);
    };

    const currentItems = hot.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    return (
        <div className={styles.hotCard}>
            <h2 className={styles.title}>{title}</h2>
            <ul className={styles.list}>
                {currentItems.map((item, index) => (
                    <li key={item.id} className={styles.item}>
                        <Link to={item.link} className={styles.link}>
                            <span className={styles.itemTitle}>{item.name}</span>
                            <div 
                                className={styles.itemDetails} 
                                style={{backgroundImage: `url(${item.image}?${index + currentPage * itemsPerPage})`}}
                            >
                                <div className={styles.itemInfo}>
                                    <p className={styles.itemDescription}>{item.description}</p>
                                    <p className={styles.itemRating}>评分: {item.rating}</p>
                                    <p className={styles.itemCategory}>类别: {item.category}</p>
                                </div>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
            <div className={styles.navigationWrapper}>
                <button onClick={prevPage} className={`${styles.navButton} ${styles.prevButton}`}>&#9664;</button>
                <button onClick={nextPage} className={`${styles.navButton} ${styles.nextButton}`}>&#9654;</button>
            </div>
            <div className={styles.pageIndicator}>
                {[...Array(pageCount)].map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToPage(index)}
                        className={`${styles.dot} ${index === currentPage ? styles.activeDot : ''}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default HotCard;