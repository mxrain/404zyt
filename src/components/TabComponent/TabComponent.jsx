import React, { useState, useEffect, useRef } from 'react';
import styles from './TabComponent.module.css';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDbData } from '../../features/dbData/dbSlice';

export default function TabComponent() {
  const [isExceed, setIsExceed] = useState(() => {
    // 检查是否为移动设备（这里假设宽度小于768px为移动设备）
    return window.innerWidth < 768;
  });
  const [showMoreModal, setShowMoreModal] = useState(false);
  const headerRef = useRef(null);
  const moreButtonRef = useRef(null);
  const moreModalRef = useRef(null);
  const dispatch = useDispatch(); // 使用 dispatch 来分发 actions
  const { data, status, error } = useSelector(state => state.db);
  const [tabs, setTabs] = useState([]);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchDbData());
    }

    if (status === 'succeeded' && data) {
      const extractCategories = (obj) => {
        let categories = [];
        for (let key in obj) {
          if (obj[key] && typeof obj[key] === 'object') {
            if (obj[key].items) {
              categories = [...categories, ...extractCategories(obj[key].items)];
            } else {
              categories.push({ name: key, link: obj[key].link });
            }
          }
        }
        return categories;
      };

      const allCategories = extractCategories(data);
      setTabs(allCategories);
    }

    const handleScroll = () => {
      if (headerRef.current) { // headerRef.current 本质是一个dom对象
        const headerBottom = headerRef.current.getBoundingClientRect().bottom; //getBoundingClientRect 获取dom对象的边界
        setIsExceed(headerBottom <= 50);
      }
    };

    const handleClickOutside = (event) => {
      if (moreModalRef.current && !moreModalRef.current.contains(event.target) &&
          moreButtonRef.current && !moreButtonRef.current.contains(event.target)) {
        setShowMoreModal(false);
      }
    };

    const handleResize = () => {
      // 当窗口大小改变时，更新isExceed状态
      setIsExceed(window.innerWidth < 768 || headerRef.current.getBoundingClientRect().bottom <= 50);
    };

    window.addEventListener('scroll', handleScroll); // 监听滚动事件 调用handleScroll函数
    window.addEventListener('resize', handleResize); // 监听窗口大小改变事件
    document.addEventListener('mousedown', handleClickOutside); // 监听点击事件

    return () => {
      window.removeEventListener('scroll', handleScroll); // 移除监听事件
      window.removeEventListener('resize', handleResize); // 移除窗口大小改变事件监听
      document.removeEventListener('mousedown', handleClickOutside); // 移除点击事件监听
    };
  }, [dispatch, data, status]);

  const toggleMoreModal = () => {
    setShowMoreModal(!showMoreModal);
  };

  if (status === 'loading') {
    return <div>加载中...</div>;
  }

  if (status === 'failed') {
    return <div>错误: {error}</div>;
  }

  return (
    <div className={styles.tabContainer} ref={headerRef}>
      {
        !isExceed && (
          <div className={styles.tabList}>
            {tabs.slice(0, 23).map((tab, index) => (
              <Link to={tab.link} className={styles.tabItem} key={index}>{tab.name}</Link>
            ))}
            <div className={styles.tabItem} onClick={toggleMoreModal} ref={moreButtonRef}>
              更多
            </div>
            {showMoreModal && (
              <div className={styles.moreModal} ref={moreModalRef} style={{
                top: moreButtonRef.current ? `${moreButtonRef.current.offsetHeight + 135}px ` : '100%',
                left: moreButtonRef.current ? `${moreButtonRef.current.offsetLeft - 80}px` : '0'
              }}>
                {tabs.slice(19).map((tab, index) => (
                  <Link to={tab.link} className={styles.tabItem} key={index + 23}>{tab.name}</Link>
                ))}
              </div>
            )}
          </div>
        )
      }

      {
        isExceed && (
          <div className={`${styles.exceedList} ${styles.fadeIn}`}>
            {tabs.map((tab, index) => (
              <Link to={tab.link} className={styles.exceedListItem} key={index}>{tab.name}</Link>
            ))}
          </div>
        )
      }


    </div>
  );
}