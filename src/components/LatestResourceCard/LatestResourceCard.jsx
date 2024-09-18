import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import styles from './LatestResourceCard.module.css';

const LatestResourceCard = ({ title, items }) => {
    const navigate = useNavigate();

    const handleItemClick = (item) => {
        // 假设我们有一个详情页面路由 `/detail/:id`
        navigate(`/detail/${item.id}`);
    };

    return (
        <div className={styles.card}>
            <h2>{title}</h2>
            <div className={styles.itemList}>
                {items.map((item, index) => (
                    <div key={index} className={styles.item} onClick={() => handleItemClick(item)} title={item.description}>
                        <div className={styles.backgroundImage} style={{ backgroundImage: `url(${item.image}?${index})` }} />
                        <div className={styles.content}>
                            <div className={styles.title}>{item.title}</div>
                            <div className={styles.tags}>
                                {item.tags.map((tag, tagIndex) => (
                                    <span key={tagIndex} className={styles.tag}>{tag}</span>
                                ))}
                            </div>
                            <p className={styles.updateTime}>
                                {(() => {
                                    const timeDiff = Date.now() - new Date(item.updateTime).getTime();
                                    const hoursDiff = timeDiff / (1000 * 60 * 60);
                                    if (hoursDiff < 1) {
                                        return '刚刚';
                                    } else if (hoursDiff < 24) {
                                        return `${Math.floor(hoursDiff)}小时前`;
                                    } else {
                                        return `${Math.floor(hoursDiff / 24)}天前`;
                                    }
                                })()}
                            </p>
                        </div>
                        <div className={styles.arrowIcon}>
                            <ChevronRight size={24} strokeWidth={3} color="white" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LatestResourceCard;
