import React, { useState, useEffect } from 'react';
import styles from './CarouselCard.module.css';

const CarouselCard = ({ carousel = [], title }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (carousel.length > 0 && currentIndex >= carousel.length) {
            setCurrentIndex(0);
        }
    }, [carousel, currentIndex]);

    if (carousel.length === 0) {
        return (
            <div className={styles.carouselCard}>
                <h2 className={styles.title}>{title}</h2>
                <p>暂无轮播图片</p>
            </div>
        );
    }

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % carousel.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + carousel.length) % carousel.length);
    };

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    return (
        <div 
            className={styles.carouselCard} 
            style={{ backgroundImage: `url(${carousel[currentIndex].imageUrl+`?${Date.now()}`})`  }}
        >
            <div className={styles.overlay}>
                <h2 className={styles.title}>{title}</h2>
                <div className={styles.navigationWrapper}>
                    <button onClick={prevSlide} className={`${styles.navButton} ${styles.prevButton}`}>&#9664;</button>
                    <button onClick={nextSlide} className={`${styles.navButton} ${styles.nextButton}`}>&#9654;</button>
                </div>
                <div className={styles.pageIndicator}>
                    {carousel.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`${styles.dot} ${index === currentIndex ? styles.activeDot : ''}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CarouselCard;