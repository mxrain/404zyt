import React, { useState, useEffect, useCallback } from 'react';
import { Clock, Grid, ExternalLink } from 'lucide-react';
import styles from './ResourceCard.module.css';

const BASE_URL = 'https://raw.githubusercontent.com/mxrain/404zyt/master/src/db';

function ResourceCard({ resource }) {
  const [infoData, setInfoData] = useState(null);

  const fetchResource = useCallback(async (uuid) => {
    try {
      const response = await fetch(`${BASE_URL}/zyt/${uuid}.json`);
      const data = await response.json();
      setInfoData({
        ...data,
        tags: data.tags || {}  // 设置默认值
      });
    } catch (error) {
      console.error('获取资源信息失败:', error);
      setInfoData({ name: '加载失败', introduction: '无法获取资源信息', tags: {} });
    }
  }, []);

  useEffect(() => {
    fetchResource(resource.id);
  }, [resource.id, fetchResource]);

  if (!infoData) {
    return <div className={`${styles.card} ${styles.emptyCard}`}>
        加载中...
    </div>;
  }

  return (
    <div className={styles.card}>
      {infoData.images && infoData.images.length > 0 && (
        <img className={styles.cardImage} src={infoData.images[0]} alt={infoData.name} />
      )}
      <h3 className={styles.cardTitle}>{infoData.name}</h3>
      <p className={styles.cardInfo}>{(infoData?.introduction || '暂无简介').substring(0, 30)}...</p>
      <p className={styles.timeBox}>
        <Clock size={13}/> <span className='updateTimeFont'>更新时间: {new Date(resource.updatetime * 1000).toLocaleDateString()}</span>
      </p>
      <p className={styles.cardInfo}>
        <Grid size={16} /> {infoData.category}
      </p>
      <div className={styles.tagContainer}>
        {infoData.tags && Object.values(infoData.tags).flat().slice(0, 5).map((tag, index) => (
          <span key={index} className={styles.tagItem}>{tag}</span>
        ))}
      </div>
      <div className={styles.sourceLinks}>
        {Object.keys(infoData.source_links).map((source) => (
          <a key={source} href={infoData.source_links[source]} target="_blank" rel="noopener noreferrer" className={styles.iconLink}>
            <ExternalLink size={20} />
          </a>
        ))}
      </div>
    </div>
  );
}

export default ResourceCard;
