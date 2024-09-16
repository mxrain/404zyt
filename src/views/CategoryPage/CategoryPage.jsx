import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const BASE_URL = 'https://raw.githubusercontent.com/mxrain/404zyt/master/src/db/';

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [categoryData, setCategoryData] = useState(null);
  console.log(categoryName);
  useEffect(() => {
    fetch(`${BASE_URL}${encodeURIComponent(categoryName)}.json`)
      .then(response => response.json())
      .then(data => setCategoryData(data))
      .catch(error => console.error('获取分类数据时出错:', error));
  }, [categoryName]);

  if (!categoryData) return <div>加载中...</div>;

  return (
    <div>
      <h1>{categoryName}</h1>
      {Array.isArray(categoryData) ? (
        <ul>
          {categoryData.map((item, index) => (
            <li key={index}>
              <h2>{item.name}</h2>
              <p>{item.introduction}</p>
              <p>资源信息: {item.resource_information}</p>
              <p>夸克网盘链接: <a href={item.quark_link} target="_blank" rel="noopener noreferrer">{item.quark_link}</a></p>
              <p>上传时间: {new Date(item.uploaded).toLocaleString()}</p>
              <p>更新时间: {new Date(item.update_time).toLocaleString()}</p>
              <p>资源目录: {item.resource_directory}</p>
              {item.images && item.images.length > 0 && (
                <img src={item.images[0]} alt={item.name} style={{ maxWidth: '200px' }} />
              )}
            </li>
          ))}
        </ul>
      ) : (
        categoryData.items && (
          <ul>
            {Object.entries(categoryData.items).map(([key, value]) => (
              <li key={key}>
                {/* <Link to={`${location.pathname}/${key}`}>{key}</Link>
                 */}
                {key}
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
