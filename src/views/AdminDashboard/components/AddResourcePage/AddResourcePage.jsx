import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import styles from './AddResourcePage.module.css';
import ResourceFormModal from './ResourceFormModal';

export default function AddResourcePage() {
  const [resources, setResources] = useState({});
  const [categories, setCategories] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [listData, setListData] = useState({});
  const [modifiedResources, setModifiedResources] = useState(new Set());
  const [deletedResources, setDeletedResources] = useState(new Set());
  const [newResources, setNewResources] = useState(new Set());
  const [selectedResources, setSelectedResources] = useState(new Set());

  const { githubApi, owner, repo } = useSelector(state => state.auth);

  const fetchData = useCallback(async (url, setter) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      setter(data);
    } catch (error) {
      console.error(`从 ${url} 获取数据失败:`, error);
    }
  }, []);

  const getLatestFileContent = useCallback(async (path) => {
    try {
      const response = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=master`,
        { headers: { Authorization: `token ${githubApi}` } }
      );
      return { sha: response.data.sha, content: atob(response.data.content) };
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return { sha: null, content: null };
      }
      console.error(`获取文件内容时出错 (${path}):`, error);
      throw error;
    }
  }, [owner, repo, githubApi]);

  const prepareUpdates = useCallback(async () => {
    const updates = [];

    // 需要更新的文件
    const filesToUpdate = [
      { path: 'src/db/uuid_resource_curd.json', content: JSON.stringify(resources, null, 2), isNew: false },
      { path: 'src/db/list.json', content: JSON.stringify(listData, null, 2), isNew: false },
      ...Array.from(modifiedResources).map(uuid => ({
        path: `src/db/zyt/${uuid}.json`,
        content: JSON.stringify(resources[uuid], null, 2),
        isNew: false
      }))
    ];

    // 准备需要创建的新文件
    const filesToCreate = Array.from(newResources).map(uuid => ({
      path: `src/db/zyt/${uuid}.json`,
      content: JSON.stringify(resources[uuid], null, 2),
      isNew: true
    }));

    // 合并更新和创建的文件
    const allFiles = [...filesToUpdate, ...filesToCreate];

    for (const file of allFiles) {
      const { sha, content } = await getLatestFileContent(file.path);
      if (file.isNew) {
        updates.push({ ...file, sha: null });
      } else if (content !== file.content) {
        updates.push({ ...file, sha });
      }
    }

    // 准备需要删除的文件
    for (const uuid of deletedResources) {
      const { sha } = await getLatestFileContent(`src/db/zyt/${uuid}.json`);
      if (sha) {
        updates.push({ path: `src/db/zyt/${uuid}.json`, sha, delete: true });
      }
    }

    return updates;
  }, [resources, listData, modifiedResources, newResources, deletedResources, getLatestFileContent]);

  const createFile = useCallback(async (path, content) => {
    await axios.put(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        message: `创建 ${path} 通过管理后台`,
        content: btoa(unescape(encodeURIComponent(content))),
        branch: 'master'
      },
      { headers: { Authorization: `token ${githubApi}`, 'Content-Type': 'application/json' } }
    );
  }, [githubApi, owner, repo]);

  const updateFile = useCallback(async (path, content, sha) => {
    await axios.put(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        message: `更新 ${path} 通过管理后台`,
        content: btoa(unescape(encodeURIComponent(content))),
        sha: sha,
        branch: 'master'
      },
      { headers: { Authorization: `token ${githubApi}`, 'Content-Type': 'application/json' } }
    );
  }, [githubApi, owner, repo]);

  const deleteFile = useCallback(async (path, sha) => {
    await axios.delete(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        data: {
          message: `删除 ${path} 通过管理后台`,
          sha: sha,
          branch: 'master'
        },
        headers: { Authorization: `token ${githubApi}`, 'Content-Type': 'application/json' }
      }
    );
  }, [githubApi, owner, repo]);

  const refreshData = useCallback(async () => {
    try {
      await Promise.all([
        fetchData('https://raw.githubusercontent.com/mxrain/404zyt/master/src/db/uuid_resource_curd.json', setResources),
        fetchData('https://raw.githubusercontent.com/mxrain/404zyt/master/src/db/db.json', setCategories),
        fetchData('https://raw.githubusercontent.com/mxrain/404zyt/master/src/db/list.json', setListData),
      ]);
      setSelectedResources(new Set());
    } catch (error) {
      console.error('刷新数据时出错:', error);
    }
  }, [fetchData]);

  const handleSubmitToGitHub = useCallback(async () => {
    try {
      const updates = await prepareUpdates();

      if (updates.length === 0) {
        alert('没有变更需要保存');
        return;
      }

      for (const update of updates) {
        if (update.delete) {
          await deleteFile(update.path, update.sha);
        } else if (update.sha) {
          await updateFile(update.path, update.content, update.sha);
        } else {
          await createFile(update.path, update.content);
        }
      }

      setModifiedResources(new Set());
      setDeletedResources(new Set());
      setNewResources(new Set());

      await refreshData();

      alert('数据已成功提交到 GitHub 并刷新');
    } catch (error) {
      console.error('提交到 GitHub 时出错:', error);
      alert('保存数据时出错，请查看控制台以获取更多信息');
    }
  }, [prepareUpdates, deleteFile, updateFile, createFile, refreshData]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const handleAddResource = () => {
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEditResource = (id) => {
    setEditingId(id);
    setIsModalOpen(true);
  };

  const deleteResource = (id) => {
    setDeletedResources(prev => new Set(prev).add(id));
    setResources(prev => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
    setSelectedResources(prev => {
      const newSelected = new Set(prev);
      newSelected.delete(id);
      return newSelected;
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSaveResource = (updatedResource, updatedUuidData, updatedListOptions) => {
    if (editingId) {
      setResources(prev => ({
        ...prev,
        [editingId]: { ...prev[editingId], ...updatedResource }
      }));
      setModifiedResources(prev => new Set(prev).add(editingId));
    } else {
      const newId = updatedResource.uuid;
      setResources(prev => ({
        ...prev,
        [newId]: updatedResource
      }));
      setNewResources(prev => new Set(prev).add(newId));
    }
    setIsModalOpen(false);
  };

  const handleAddToList = (listType) => {
    if (selectedResources.size === 0) {
      alert('请先选择至少一个资源');
      return;
    }

    setResources(prev => {
      const updated = { ...prev };
      selectedResources.forEach(id => {
        updated[id] = {
          ...updated[id],
          listOptions: {
            ...updated[id].listOptions,
            [listType]: true,
          },
        };
        setModifiedResources(prevMods => new Set(prevMods).add(id));
      });
      return updated;
    });
    alert(`已将选中的资源添加到${listType === 'recommend' ? '推荐' : listType === 'hot' ? '热门' : listType === 'latest' ? '最新' : '置顶'}排行榜`);
  };

  // 选择单个资源
  const handleSelectResource = (id) => {
    setSelectedResources(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return newSelected;
    });
  };

  // 全选/取消全选
  const handleSelectAll = () => {
    if (selectedResources.size === Object.keys(resources).length) {
      setSelectedResources(new Set());
    } else {
      setSelectedResources(new Set(Object.keys(resources)));
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>资源管理</h1>
      <div className={styles.buttonGroup}>
        <button onClick={handleAddResource} className={`${styles.baseButton} ${styles.addButton}`}>添加资源</button>
        <button onClick={() => handleAddToList('recommend')} className={`${styles.baseButton} ${styles.listButton}`}>添加到推荐</button>
        <button onClick={() => handleAddToList('hot')} className={`${styles.baseButton} ${styles.listButton}`}>添加到热门</button>
        <button onClick={() => handleAddToList('latest')} className={`${styles.baseButton} ${styles.listButton}`}>添加到最新</button>
        <button onClick={() => handleAddToList('top')} className={`${styles.baseButton} ${styles.listButton}`}>添加到置顶</button>
      </div>

      <div className={styles.resourceList}>
        <h2>资源列表</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedResources.size === Object.keys(resources).length && Object.keys(resources).length > 0}
                />
              </th>
              <th>标题</th>
              <th>分类</th>
              <th>更新时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(resources).map(([id, resource]) => (
              <tr key={id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedResources.has(id)}
                    onChange={() => handleSelectResource(id)}
                  />
                </td>
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

      <button onClick={handleSubmitToGitHub} className={styles.submitButton}>提交到 GitHub</button>

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