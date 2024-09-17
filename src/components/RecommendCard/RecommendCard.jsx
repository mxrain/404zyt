import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './RecommendCard.module.css';

const RecommendCard = ({ title, items, onRefresh }) => {
  const [visibleItems, setVisibleItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const cardRef = useRef(null);

  const itemsPerPage = 20;

  const loadItems = useCallback(() => {
    setLoading(true);
    const start = currentPage * itemsPerPage;
    const end = start + itemsPerPage;
    setVisibleItems(items.slice(start, end));
    setLoading(false);
  }, [currentPage, items, itemsPerPage]);

  useEffect(() => {
    loadItems();
  }, [loadItems, items]);

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if ((currentPage + 1) * itemsPerPage < items.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleRefresh = () => {
    setCurrentPage(0);
    setLoading(true);
    if (onRefresh) {
      onRefresh().then(() => {
        loadItems();
        setLoading(false);
      });
    } else {
      // 如果没有提供 onRefresh，我们至少可以重新加载当前项目
      loadItems();
      setLoading(false);
    }
  };

  const renderSkeletonItems = () => {
    return Array(itemsPerPage).fill().map((_, index) => (
      <div key={index} className={styles.skeletonItem}>
        <div className={styles.skeletonName}></div>
        <div className={styles.skeletonDescription}></div>
        <div className={styles.skeletonSize}></div>
      </div>
    ));
  };

  return (
    <div className={styles.card} ref={cardRef}>
      <div className={styles.cardHeader}>
        <h2>{title}</h2>
        <button onClick={handleRefresh} className={styles.refreshButton}>
          <RefreshCw size={16} />
        </button>
      </div>
      <div className={styles.cardContent}>
        {loading ? (
          renderSkeletonItems()
        ) : (
          visibleItems.map((item) => (
            <Link to={`/resource/${item.uuid}`} key={item.uuid} className={styles.item}>
              <span className={styles.itemName}>{item.name}</span>
              <span className={styles.itemDescription}>{item.description}</span>
              <span className={styles.itemSize}>{item.size}</span>
            </Link>
          ))
        )}
      </div>
      <div className={styles.cardFooter}>
        <button onClick={handlePrevPage} disabled={currentPage === 0}>
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={handleNextPage}
          disabled={(currentPage + 1) * itemsPerPage >= items.length}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default RecommendCard;
