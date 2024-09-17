import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './RecommendCard.module.css';

const RecommendCard = ({ title, items }) => {
  const [visibleItems, setVisibleItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const cardRef = useRef(null);

  const itemsPerPage = 20;

  useEffect(() => {
    loadItems();
  }, [currentPage]);

  const loadItems = () => {
    setLoading(true);
    const start = currentPage * itemsPerPage;
    const end = start + itemsPerPage;
    setVisibleItems(items.slice(start, end));
    setLoading(false);
  };

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
    loadItems();
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
          <div className={styles.skeleton}>加载中...</div>
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
