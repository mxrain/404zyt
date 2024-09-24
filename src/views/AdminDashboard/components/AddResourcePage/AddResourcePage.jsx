import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import styles from './AddResourcePage.module.css';
import ResourceFormModal from './ResourceFormModal';

export default function AddResourcePage() {
  const [resources, setResources] = useState({}); // 资源数据
  const [categories, setCategories] = useState({}); // 分类数据
  const [isModalOpen, setIsModalOpen] = useState(false); // 是否打开资源表单
  const [editingId, setEditingId] = useState(null); // 编辑的资源ID
  const [listData, setListData] = useState({}); // 列表数据
  const [modifiedResources, setModifiedResources] = useState(new Set()); // 修改的资源ID集合

  const { githubApi, owner, repo } = useSelector(state => state.auth); // 获取GitHub API、仓库所有者和仓库名

  useEffect(() => { 
    fetchResources(); // 获取资源数据
    fetchCategories(); // 获取分类数据
    fetchListData(); // 获取列表数据
  }, []);

  const fetchResources = async () => {  // 获取资源数据
    try {
      const response = await fetch('https://raw.githubusercontent.com/mxrain/404zyt/master/src/db/uuid_resource_curd.json');
      const data = await response.json();
      setResources(data);
    } catch (error) {
      console.error('Failed to fetch resources:', error);
    }
  };

  const fetchCategories = async () => { // 获取分类数据
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

  const handleAddResource = () => { // 添加资源
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEditResource = (id) => { // 编辑资源
    setEditingId(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => { // 关闭资源
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSaveResource = async (resourceData, uuidData, listOptions) => { // 保存资源 
    let uuid;
    if (editingId) { // 编辑的资源ID
      uuid = editingId;
      const updatedResources = {
        ...resources,
        [editingId]: resourceData,
      };
      setResources(updatedResources);
      await uploadToGitHub(updatedResources, 'uuid_resource_curd.json');
      await uploadToGitHub(uuidData, `zyt/${editingId}.json`);
    } else {
      uuid = generateUUID();
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
    
    setModifiedResources(prev => new Set(prev).add(uuid));

    const updatedListData = { ...listData };
    Object.keys(listOptions).forEach(option => {
      if (listOptions[option]) {
        let newListItem;
        switch (option) {
          case 'recommend':
            newListItem = {
              uuid: uuid,
              name: resourceData.title,
              description: uuidData.introduction || '',
              size: uuidData.resource_information.size || '',
              image: uuidData.images[0] || 'https://picsum.photos/220/140',
              updatetime: new Date(resourceData.updatetime * 1000).toISOString()
            };
            break;
          case 'hot':
            newListItem = {
              uuid: uuid,
              title: resourceData.title,
              image: uuidData.images[0] || 'https://picsum.photos/220/140',
              description: uuidData.introduction || '',
              rating: uuidData.rating,
              category: resourceData.category
            };
            break;
          case 'latest':
            newListItem = {
              uuid: uuid,
              description: uuidData.introduction || '',
              image: uuidData.images[0] || 'https://picsum.photos/220/140',
              title: resourceData.title,
              updateTime: new Date(resourceData.updatetime * 1000).toISOString(),
              tags: Object.values(uuidData.tags)
            };
            break;
          case 'top':
            newListItem = {
              uuid: uuid,
              title: resourceData.title,
              link: uuidData.link,
              image: uuidData.images[0] || 'https://picsum.photos/220/140',
              introduction: uuidData.introduction || '',
              score: uuidData.rating
            };
            break;
          default:
            newListItem = {};
        }
        updatedListData[option] = [newListItem, ...(updatedListData[option] || [])];
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

    const uploadToGitHub = async (data, path) => {
    try {
      let fileData;
      try {
        const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contents/src/db/${path}`, {
          headers: { Authorization: `token ${githubApi}` }
        });
        fileData = response.data;
      } catch (error) {
        if (error.response && error.response.status === 404) {
          // 文件不存在，创建新文件
          fileData = null;
        } else {
          throw error;
        }
      }

      const content = btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2))));

      const requestData = {
        message: `Update ${path}`,
        content,
        branch: 'master' // 确保指定正确的分支
      };

      if (fileData) {
        requestData.sha = fileData.sha;
      }

      await axios.put(`https://api.github.com/repos/${owner}/${repo}/contents/src/db/${path}`,
        requestData,
        {
          headers: { Authorization: `token ${githubApi}` }
        }
      );

      console.log(`成功更新 ${path}`);
    } catch (error) {
      console.error(`更新 ${path} 时出错:`, error);
      throw error;
    }
  };
  const generateUUID = () => {
    return Math.random().toString().slice(2, 15);
  };

  const handleSubmitToGitHub = async () => {
    console.log('提交到 GitHub 的 list.json 数据:', listData);
    console.log('提交到 GitHub 的 uuid_resource_curd.json 数据:', resources);
    
    try {
      // 获取当前的 commit SHA
      const { data: refData } = await axios.get(`https://api.github.com/repos/${owner}/${repo}/git/ref/heads/master`, {
        headers: { Authorization: `token ${githubApi}` }
      });
      const currentCommitSha = refData.object.sha;

      // 准备树结构
      const tree = [
        {
          path: 'src/db/uuid_resource_curd.json',
          mode: '100644',
          type: 'blob',
          content: JSON.stringify(resources, null, 2)
        },
        {
          path: 'src/db/list.json',
          mode: '100644',
          type: 'blob',
          content: JSON.stringify(listData, null, 2)
        }
      ];

      // 添加修改过的单个资源文件
      for (const uuid of modifiedResources) {
        tree.push({
          path: `src/db/zyt/${uuid}.json`,
          mode: '100644',
          type: 'blob',
          content: JSON.stringify(resources[uuid], null, 2)
        });
      }

      // 创建树
      const { data: treeData } = await axios.post(`https://api.github.com/repos/${owner}/${repo}/git/trees`, {
        base_tree: currentCommitSha,
        tree: tree
      }, {
        headers: { Authorization: `token ${githubApi}` }
      });

      // 创建提交
      const { data: commitData } = await axios.post(`https://api.github.com/repos/${owner}/${repo}/git/commits`, {
        message: 'Update resources and list data',
        tree: treeData.sha,
        parents: [currentCommitSha]
      }, {
        headers: { Authorization: `token ${githubApi}` }
      });

      // 更新 master 分支指向新的提交
      await axios.patch(`https://api.github.com/repos/${owner}/${repo}/git/refs/heads/master`, {
        sha: commitData.sha
      }, {
        headers: { Authorization: `token ${githubApi}` }
      });

      // 清空修改列表
      setModifiedResources(new Set());

      // 重新获取数据
      await fetchResources();
      await fetchCategories();
      await fetchListData();

      alert('数据已成功提交到GitHub并刷新');
    } catch (error) {
      console.error('提交到GitHub时出错:', error);
      alert('提交到GitHub时出错，请查看控制台以获取更多信息');
    }
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