import React, { useState, useEffect } from 'react';
import styles from './AddResourcePage.module.css';

export default function AddResourcePage() {
  const [resources, setResources] = useState({});
  const [newResource, setNewResource] = useState({
    title: '',
    updatetime: Date.now(),
    category: ''
  });

  // 模拟从服务器获取数据
  useEffect(() => {
    // 这里应该是从服务器获取数据的逻辑
    const mockData = {
      '453234513524523': {
        title: '哈利波特',
        updatetime: 1726839093,
        category: '软件游戏>游戏>单机游戏'
      },
      // ... 其他资源
    };
    setResources(mockData);
  }, []);

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
    setNewResource({ title: '', updatetime: Date.now(), category: '' });
  };

  const deleteResource = (id) => {
    const updatedResources = { ...resources };
    delete updatedResources[id];
    setResources(updatedResources);
  };

  const updateResource = (id, updatedData) => {
    setResources({
      ...resources,
      [id]: {
        ...resources[id],
        ...updatedData,
        updatetime: Date.now()
      }
    });
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
        {Object.entries(resources).map(([id, resource]) => (
          <div key={id} className={styles.resourceItem}>
            <span>{resource.title}</span>
            <span>{new Date(resource.updatetime).toLocaleString()}</span>
            <span>{resource.category}</span>
            <button onClick={() => deleteResource(id)}>删除</button>
            <button onClick={() => updateResource(id, { title: '更新的标题' })}>更新</button>
          </div>
        ))}
      </div>
    </div>
  );
}