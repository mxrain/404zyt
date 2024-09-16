import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';

const CategoryPage = () => {
  const location = useLocation();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 获取link

        const pathSegments = location.pathname.split('/').filter(Boolean);
        console.log(location.pathname);
        const jsonPath = `./db/${pathSegments.join('/')}/${pathSegments[pathSegments.length - 1]}.json`;

        const response = await fetch(jsonPath);
        if (!response.ok) {
          throw new Error('数据获取失败');
        }
        const jsonData = await response.json();
        setData(jsonData);
        setError(null);
      } catch (error) {
        console.error('获取数据时出错:', error);
        setError('无法加载数据，请稍后再试。');
        setData(null);
      }
    };

    fetchData();
  }, [location.pathname]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!data) {
    return <div>加载中...</div>;
  }

  const pathSegments = location.pathname.split('/').filter(Boolean);
  const currentCategory = pathSegments[pathSegments.length - 1];
  const currentData = data[currentCategory];

  if (!currentData) {
    return <div>未找到该分类</div>;
  }

  return (
    <div>
      <h1>{currentCategory}</h1>
      {Array.isArray(currentData) ? (
        <ul>
          {currentData.map((item, index) => (
            <li key={index}>
              <h2>{item.name}</h2>
              <p>{item.introduction}</p>
              <p>资源信息: {item.resource_information}</p>
              <p>夸克网盘链接: <a href={item.quark_link} target="_blank" rel="noopener noreferrer">{item.quark_link}</a></p>
              <p>上传时间: {new Date(item.uploaded).toLocaleString()}</p>
              <p>更新时间: {new Date(item.update_time).toLocaleString()}</p>
              <p>资源目录: {item.resource_directory}</p>
              {item.images && item.images.length > 0 && (
                <img src={item.images[0]} alt={item.name} style={{maxWidth: '200px'}} />
              )}
            </li>
          ))}
        </ul>
      ) : (
        currentData.items && (
          <ul>
            {Object.entries(currentData.items).map(([key, value]) => (
              <li key={key}>
                <Link to={`${location.pathname}/${key}`}>{key}</Link>
                {value.link && <span> - <a href={value.link} target="_blank" rel="noopener noreferrer">{value.link}</a></span>}
              </li>
            ))}
          </ul>
        )
      )}
    </div>
  );
};

export default CategoryPage;
