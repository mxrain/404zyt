import React, { useState, useEffect } from 'react';
import styles from './AddResourcePage.module.css';
import ResourceFormModal from './ResourceFormModal'; // 新创建的组件

export default function AddResourcePage() {
  const [resources, setResources] = useState({});
  const [categories, setCategories] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [listData, setListData] = useState({});

  useEffect(() => {
    fetchResources();
    fetchCategories();
    fetchListData();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await fetch('https://raw.githubusercontent.com/mxrain/404zyt/master/src/db/uuid_resource_curd.json');
      const data = await response.json();
      setResources(data);
    } catch (error) {
      console.error('Failed to fetch resources:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://raw.githubusercontent.com/mxrain/404zyt/master/src/db/db.json');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchListData = async () => {
    try {
      const response = await fetch('https://raw.githubusercontent.com/mxrain/404zyt/master/src/db/list.json');
      const data = await response.json();
      setListData(data);
    } catch (error) {
      console.error('获取列表数据失败:', error);
    }
  };

  const handleAddResource = () => {
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEditResource = (id) => {
    setEditingId(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSaveResource = async (resourceData, uuidData, listOptions) => {
    if (editingId) {
      // 更新现有资源
      const updatedResources = {
        ...resources,
        [editingId]: resourceData,
      };
      setResources(updatedResources);
      await uploadToGitHub(updatedResources, 'uuid_resource_curd.json');
      await uploadToGitHub(uuidData, `zyt/${editingId}.json`);
    } else {
      // 添加新资源
      const uuid = generateUUID();
      const newResourceData = {
        ...resourceData,
        uuid,
        updatetime: Math.floor(Date.now() / 1000),
      };
      const updatedResources = {
        ...resources,
        [uuid]: newResourceData,
      };
      setResources(updatedResources);
      await uploadToGitHub(updatedResources, 'uuid_resource_curd.json');
      await uploadToGitHub(uuidData, `zyt/${uuid}.json`);
    }
    // 更新 listData
    const updatedListData = { ...listData };
    Object.keys(listOptions).forEach(option => {
      if (listOptions[option]) {
        updatedListData[option] = [
          ...(updatedListData[option] || []),
          {
            uuid: resourceData.uuid,
            title: resourceData.title,
            // ... 根据需要添加其他字段
          }
        ];
      }
    });
    setListData(updatedListData);

    setIsModalOpen(false);
  };

  const deleteResource = async (id) => {
    const { [id]: _, ...updatedResources } = resources;
    setResources(updatedResources);
    await uploadToGitHub(updatedResources, 'uuid_resource_curd.json');
    // 可能还需要删除对应的 UUID 文件
    // await deleteFromGitHub(`zyt/${id}.json`);
  };

  const uploadToGitHub = async (data, filename) => {
    // This is a placeholder function. In a real application, you would implement
    // the GitHub API calls here to update the file in the repository.
    console.log(`Uploading ${filename} to GitHub:`, data);
    // You'll need to implement the actual GitHub API calls here
  };

  const generateUUID = () => {
    return Math.random().toString().slice(2, 15);
  };

  const handleSubmitToGitHub = () => {
    console.log('提交到 GitHub 的 list.json 数据:', listData);
    console.log('提交到 GitHub 的 uuid_resource_curd.json 数据:', resources);
    Object.keys(resources).forEach(uuid => {
      console.log(`提交到 GitHub 的 ${uuid}.json 数据:`, resources[uuid]);
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>资源管理</h1>
      <button onClick={handleAddResource} className={styles.addButton}>
        添加资源
      </button>

      <div className={styles.resourceList}>
        <h2>资源列表</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>标题</th>
              <th>分类</th>
              <th>更新时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(resources).map(([id, resource]) => (
              <tr key={id}>
                <td>{resource.title}</td>
                <td>{resource.category}</td>
                <td>{new Date(resource.updatetime * 1000).toLocaleString()}</td>
                <td>
                  <button onClick={() => handleEditResource(id)} className={styles.editButton}>编辑</button>
                  <button onClick={() => deleteResource(id)} className={styles.deleteButton}>删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button onClick={handleSubmitToGitHub} className={styles.submitButton}>
        提交到 GitHub
      </button>

      {isModalOpen && (
        <ResourceFormModal
          onClose={handleCloseModal}
          onSave={handleSaveResource}
          categories={categories}
          editingId={editingId}
          initialResource={editingId ? resources[editingId] : null}
        />
      )}
    </div>
  );
}