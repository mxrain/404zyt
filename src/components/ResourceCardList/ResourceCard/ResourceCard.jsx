import styles from './ResourceCard.module.css';
import { Link } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';

const BASE_URL = 'https://raw.githubusercontent.com/mxrain/404zyt/master/src/db';

const ResourceCard = ({ resource }) => {
    // 将状态移到组件内部
    const [infoData, setInfoData] = useState(null);

    // 将fetchResource移到组件内部并使用useCallback优化
    const fetchResource = useCallback(async (uuid) => {
        try {
            const response = await fetch(`${BASE_URL}/zyt/${uuid}.json`);
            const data = await response.json();
            setInfoData(data);
        } catch (error) {
            console.error('获取资源信息失败:', error);
        }
    }, []);

    useEffect(() => {
        fetchResource(resource.uuid);
    }, [resource.uuid, fetchResource]);

    if (!infoData) {
        return (
            <div className={`${styles.card} ${styles.emptyCard}`}>
                <p>资源正在加载中...</p>
            </div>
        );
    }

    return (
        <Link to={`/resource/${resource.uuid}`} className={styles.cardLink}>
            <div className={styles.card}>
                <h2 className={styles.title}>{infoData.name}</h2>
                <p className={styles.category}>{infoData.category}</p>
                <img src={infoData.images[0]} alt={infoData.name} className={styles.image} />
                <p className={styles.description}>{infoData.description}</p>
                <div className={styles.info}>
                    <span className={styles.rating}>评分: {infoData.rating}</span>
                    <span className={styles.downloads}>下载次数: {infoData.download_count}</span>
                </div>
            </div>
        </Link>
    );
};

export default ResourceCard;
