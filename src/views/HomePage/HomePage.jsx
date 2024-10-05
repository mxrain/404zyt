import React, { useState, useEffect, useCallback } from 'react';
// import { RefreshCw } from 'lucide-react';
import styles from './HomePage.module.css';
import TabComponent from '../../components/TabComponent/TabComponent';
import RecommendCard from '../../components/RecommendCard/RecommendCard';
import LatestResourceCard from '../../components/LatestResourceCard/LatestResourceCard';
import HotCard from '../../components/HotCard/HotCard';
import CarouselCard from '../../components/CarouselCard/CarouselCard';
import ResourceCardList  from '../../components/ResourceCardList/ResourceCardList';
import RevenueRankingCard from '../../components/RevenueRankingCard/RevenueRankingCard';
const BASE_URL = 'https://raw.gitmirror.com/mxrain/404zyt/master/src/db/';

export default function HomePage() {
  const [data, setData] = useState({
    recommend: [],
    hot: [],
    latest: [],
    top: [],
    carousel: [],
  });
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const listResponse = await fetch(`${BASE_URL}/list.json`);
      const listData = await listResponse.json();
      setData(listData);

    } catch (error) {
      console.error('获取数据时出错:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = () => {
    fetchData();
  };

  return (
    <div className={styles.container}>
      <TabComponent />
      <div className={styles.header}>
        <button onClick={handleRefresh} disabled={loading} className={styles.refreshButton}>
          {/* <RefreshCw className={styles.refreshIcon} /> 重新加载 */}
        </button>
      </div>
      <div className={styles.grid}>
        {/* 轮播图  */}
        <RecommendCard title="推荐列表" items={data.recommend} />
        <CarouselCard carousel={data.carousel} title="精选轮播" />
        <LatestResourceCard title="最新资源" items={data.latest} />
        <HotCard title="高收益资源" hot={data.top} />
        <HotCard title="最热资源" hot={data.hot} />
        <RevenueRankingCard title="高收益资源" hot={data.top} />

      </div>
      <ResourceCardList title="资源列表" />
    </div>
  );
}