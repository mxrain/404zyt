import React from 'react';
import styles from './LatestResourceCard.module.css';

const LatestResourceCard = ({ title, items }) => {
  return (
    <div className={styles.card}>
      <h2>{title}</h2>
      <div className={styles.itemList}>
        {items.map((item, index) => (
          <div key={index} className={styles.item} title={item.description}>
            <img src={item.image} alt={item.title} className={styles.itemImage} />
            <div className={styles.itemInfo}>
              <h3>{item.title}</h3>
              <p>{new Date(item.updateTime).toLocaleDateString()}</p>
              <div className={styles.tags}>
                {item.tags.map((tag, tagIndex) => (
                  <span key={tagIndex} className={styles.tag}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LatestResourceCard;
