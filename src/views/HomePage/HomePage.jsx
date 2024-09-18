import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import styles from './HomePage.module.css';
import TabComponent from '../../components/TabComponent/TabComponent';
import RecommendCard from '../../components/RecommendCard/RecommendCard';
import LatestResourceCard from '../../components/LatestResourceCard/LatestResourceCard';
import HotCard from '../../components/HotCard/HotCard';

const BASE_URL = 'https://raw.githubusercontent.com/mxrain/404zyt/master/src/db/';

export default function HomePage() {
  const [data, setData] = useState({
    recommend: [],
    hot: [],
    latest: [],
    top: [],
    carousel: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/list.json`);
      const listData = await response.json();
      setData(listData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchData();
  };

  return (
    <div className={styles.container}>
      <TabComponent />
      <div className={styles.header}>
        <button onClick={handleRefresh} disabled={loading} className={styles.refreshButton}>
          <RefreshCw className={styles.refreshIcon} /> 重新加载
        </button>
      </div>
      <div className={styles.grid}>
        <RecommendCard title="推荐列表" items={data.recommend} />
        <LatestResourceCard title="最新资源" items={data.latest} />
        <HotCard title="最热资源" hot={data.hot}/>
        <HotCard title="高收益资源" hot={data.top}/>
      </div>
    </div>
  );
}