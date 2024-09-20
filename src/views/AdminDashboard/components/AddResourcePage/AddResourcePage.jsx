import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import styles from './AddResourcePage.module.css';

export default function AddResourcePage() {
  const [resources, setResources] = useState({});
  const [newResource, setNewResource] = useState({
    title: '',
    category: ''
  });

  // 直接从 Cookies 获取 owner 和 repo
  const owner = Cookies.get('owner') || '';
  const repo = Cookies.get('repo') || '';

  useEffect(() => {
    if (owner && repo) {
      const url = `https://raw.githubusercontent.com/${owner}/${repo}/master/src/db/uuid_resource_curd.json`;
      fetch(url)
        .then(response => response.json())
        .then(data => setResources(data))
        .catch(error => console.error('获取数据失败:', error));
    }
  }, [owner, repo]);

  const handleInputChange = (e) => {
    setNewResource({
      ...newResource,
      [e.target.name]: e.target.value
    });
  };

  const addResource = () => {
    const newId = Date.now().toString();
    setResources({
      ...resources,
      [newId]: {
        ...newResource,
        updatetime: Date.now()
      }
    });
    setNewResource({ title: '', category: '' });
  };

  // 格式化时间1726839093
  
  const formatDate = (timestamp) => {
    // 将秒级时间戳转换为毫秒级
    const milliseconds = timestamp * 1000;
    
    const date = new Date(milliseconds);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className={styles.container}>
      <h1>添加资源</h1>
      <div className={styles.addForm}>
        <input
          type="text"
          name="title"
          value={newResource.title}
          onChange={handleInputChange}
          placeholder="标题"
        />
        <input
          type="text"
          name="category"
          value={newResource.category}
          onChange={handleInputChange}
          placeholder="分类"
        />
        <button onClick={addResource}>添加资源</button>
      </div>
      <div className={styles.resourceList}>
        <table>
          <thead>
            <tr>
              <th>标题</th>
              <th>更新时间</th>
              <th>分类</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(resources).map(([id, resource]) => (
              <tr key={id}>
                <td>{resource.title}</td>
                <td>{formatDate(resource.updatetime)}</td>
                <td>{resource.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}