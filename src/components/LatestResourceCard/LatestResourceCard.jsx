import React from 'react';
import styles from './LatestResourceCard.module.css';

const LatestResourceCard = ({ title, items }) => {
  return (
    <div className={styles.card}>
      <h2>{title}</h2>
      <div className={styles.itemList}>
        {items.map((item, index) => (
          <div key={index} className={styles.item} title={item.description} style={{ backgroundImage: `url(${item.image})` }}>
        
            <div className={styles.overlay}>
              <h3>{item.title}</h3>
              <div className={styles.tags}>
                {item.tags.map((tag, tagIndex) => (
                  <span key={tagIndex} className={styles.tag}>{tag}</span>
                ))}
              </div>
            </div>
            <p className={styles.updateTime}>{new Date(item.updateTime).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LatestResourceCard;
