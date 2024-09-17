import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Star } from 'lucide-react';
import styles from './HomePage.module.css';
import TabComponent from '../../components/TabComponent/TabComponent';
import Test from '../../components/Test/Test';

const ITEMS_PER_PAGE = 10;
const BASE_URL = 'https://raw.githubusercontent.com/mxrain/404zyt/master/src/db/';
const DEFAULT_IMAGE = 'https://picsum.photos/id/36/150/150';

const Card = ({ item }) => {
  const [imageSrc, setImageSrc] = useState(item.cover);

  const handleImageError = () => {
    setImageSrc(DEFAULT_IMAGE);
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardImageContainer}>
        <img
          src={imageSrc}
          alt={item.title}
          className={styles.cardImage}
          onError={handleImageError}
        />
      </div>
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{item.title}</h3>
        <p className={styles.cardDescription}>{item.introduction}</p>
        <div className={styles.cardScore}>
          <Star className={styles.starIcon} />
          <span>{item.score}</span>
        </div>
      </div>
      <div className={styles.cardFooter}>
        <a href={item.link} className={styles.cardLink}>查看详情</a>
      </div>
    </div>
  );
};

const Button = ({ children, onClick, disabled, size, className }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`${styles.button} ${size === 'sm' ? styles.buttonSm : ''} ${disabled ? styles.buttonDisabled : ''} ${className}`}
  >
    {children}
  </button>
);

const Carousel = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? items.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === items.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className={styles.carousel}>
      <div className={styles.carouselContent} style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {items.map((item, index) => (
          <div key={index} className={styles.carouselItem}>
            <div className={styles.carouselImageContainer}>
              <img src={item.imageUrl} alt={item.altText} className={styles.carouselImage} />
            </div>
          </div>
        ))}
      </div>
      <button className={`${styles.carouselNav} ${styles.carouselPrev}`} onClick={handlePrev}>{'<'}</button>
      <button className={`${styles.carouselNav} ${styles.carouselNext}`} onClick={handleNext}>{'>'}</button>
    </div>
  );
};

const ListSection = ({ items, title }) => (
  <div className={styles.listSection}>
    <h2 className={styles.sectionTitle}>{title}</h2>
    <div className={styles.grid}>
      {items.map((item, index) => (
        <Card key={index} item={item} />
      ))}
    </div>
  </div>
);

export default function HomePage() {
  const [data, setData] = useState({
    recommend: [],
    hot: [],
    latest: [],
    top: [],
    carousel: [],
  });
  const [socialLinks, setSocialLinks] = useState([]);
  const [copyright, setCopyright] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [listResponse, infoResponse] = await Promise.all([
        fetch(`${BASE_URL}/list.json`),
        fetch(`${BASE_URL}/info.json`)
      ]);
      const listData = await listResponse.json();
      const infoData = await infoResponse.json();

      setData({
        recommend: listData.recommend,
        hot: listData.hot.slice(0, page * ITEMS_PER_PAGE),
        latest: listData.latest,
        top: listData.top,
        carousel: listData.carousel,
      });
      setSocialLinks(infoData.socialLinks);
      setCopyright(infoData.copyright);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const handleRefresh = () => {
    setPage(1);
    fetchData();
  };

  return (

    <div className={styles.container}>
      <TabComponent/>
      <div className={styles.header}>
        <Button onClick={handleRefresh} disabled={loading} size="sm" className={styles.refreshButton}>
          <RefreshCw className={styles.refreshIcon} /> 重新加载
        </Button>
      </div>
      <Test/> 
      <Carousel items={data.carousel} />

      <ListSection items={data.recommend} title="推荐列表" />
      <ListSection items={data.latest} title="最新资源" />
      <ListSection items={data.hot} title="最热列表" />
      <ListSection items={data.top} title="最高收益列表" />

      {data.hot.length % ITEMS_PER_PAGE === 0 && (
        <div className={styles.loadMoreContainer}>
          <Button onClick={handleLoadMore} disabled={loading} size="sm">
            {loading ? '加载中...' : '加载更多'}
          </Button>
        </div>
      )}

      <footer className={styles.footer}>
        <div className={styles.socialLinks}>
          {socialLinks.map((link, index) => (
            <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <i className={link.icon}></i>
            </a>
          ))}
        </div>
        <p className={styles.copyright}>{copyright}</p>
      </footer>
    </div>
  );
}