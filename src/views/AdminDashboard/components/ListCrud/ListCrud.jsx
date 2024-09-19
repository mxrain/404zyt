import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Edit, Trash2, Plus, Save} from 'lucide-react';
import styles from './ListCrud.module.css';

function ListCrud() {
  const [data, setData] = useState({});
  const [activeTab, setActiveTab] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({});
  const { githubApi, owner, repo } = useSelector(state => state.auth);

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(`https://raw.githubusercontent.com/${owner}/${repo}/master/src/db/list.json`);
      setData(response.data);
      setActiveTab(Object.keys(response.data)[0]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [owner, repo]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreate = () => {
    setNewItem({});
    setShowAddForm(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const itemWithUuid = { ...newItem, uuid: Date.now().toString() };
    setData(prevData => ({
      ...prevData,
      [activeTab]: [...prevData[activeTab], itemWithUuid]
    }));
    setShowAddForm(false);
  };

  const handleAddFormChange = (key, value) => {
    setNewItem(prev => ({ ...prev, [key]: value }));
  };

  const handleUpdate = (updatedItem) => {
    setData(prevData => ({
      ...prevData,
      [activeTab]: prevData[activeTab].map(item => 
        item.uuid === updatedItem.uuid ? updatedItem : item
      )
    }));
    setEditingId(null);
  };

  const handleDelete = (uuid) => {
    setData(prevData => ({
      ...prevData,
      [activeTab]: prevData[activeTab].filter(item => item.uuid !== uuid)
    }));
  };

  const handleEdit = (uuid) => {
    setEditingId(uuid);
  };

  const handleChange = (uuid, key, value) => {
    setData(prevData => ({
      ...prevData,
      [activeTab]: prevData[activeTab].map(item => 
        item.uuid === uuid ? { ...item, [key]: value } : item
      )
    }));
  };

  const renderTableHeader = (items) => {
    if (items.length === 0) return null;
    const item = items[0];
    return (
      <tr>
        {Object.keys(item).map(key => (
          <th key={key}>{key}</th>
        ))}
        <th>操作</th>
      </tr>
    );
  };

  const renderTableRows = (items) => {
    return items.map(item => (
      <tr key={item.uuid}>  {/* 确保这里有一个唯一的 key */}
        {Object.entries(item).map(([key, value]) => (
          <td key={key}>  {/* 为每个单元格也添加一个 key */}
            {editingId === item.uuid ? (
              key === 'description' || key === 'introduction' ? (
                <textarea
                  className={styles.input}
                  value={value}
                  onChange={(e) => handleChange(item.uuid, key, e.target.value)}
                />
              ) : (
                <input
                  className={styles.input}
                  value={value}
                  onChange={(e) => handleChange(item.uuid, key, e.target.value)}
                />
              )
            ) : (
              key === 'img' || key === 'image' || key === 'imageUrl' || key === 'cover' ? (
                <img src={value} alt={item.title || item.name || 'Item image'} width="100" height="60" />
              ) : (
                JSON.stringify(value)
              )
            )}
          </td>
        ))}
        <td>
          {editingId === item.uuid ? (
            <button className={styles.button} onClick={() => handleUpdate(item)}><Save size={16} /> 保存</button>
          ) : (
            <>
              <button className={styles.button} onClick={() => handleEdit(item.uuid)}><Edit size={16} /> 编辑</button>
              <button className={styles.button} onClick={() => handleDelete(item.uuid)}><Trash2 size={16} /> 删除</button>
            </>
          )}
        </td>
      </tr>
    ));
  };

  const handleSubmit = async () => {
    try {
      const categoriesToMerge = ['recommend', 'hot', 'latest', 'top', 'carousel'];
      const mergedData = {};

      categoriesToMerge.forEach(category => {
        if (data[category]) {
          mergedData[category] = data[category];
        }
      });

      // 获取最新的文件内容和 SHA
      const { sha, content: currentContent } = await getLatestFileContent();

      // 比较当前内容和要保存的内容
      const newContent = JSON.stringify(mergedData, null, 2);
      if (currentContent === newContent) {
        alert('没有变更需要保存');
        return;
      }

      const encodedContent = btoa(unescape(encodeURIComponent(newContent)));

      const response = await axios.put(
        `https://api.github.com/repos/${owner}/${repo}/contents/src/db/list.json`,
        {
          message: 'Update list.json via admin dashboard',
          content: encodedContent,
          sha: sha,
          branch: 'master'
        },
        {
          headers: {
            Authorization: `token ${githubApi}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('File updated successfully:', response.data);
      alert('数据已成功保存到 GitHub 的 master 分支');
    } catch (error) {
      if (error.response && error.response.status === 409) {
        alert('保存失败：文件已被其他人修改。请刷新页面获取最新内容后再试。');
      } else {
        console.error('Error saving data:', error);
        alert('保存数据时出错，请查看控制台以获取更多信息');
      }
    }
  };

  const getLatestFileContent = async () => {
    try {
      const response = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/contents/src/db/list.json?ref=master`,
        {
          headers: {
            Authorization: `token ${githubApi}`
          }
        }
      );
      const content = atob(response.data.content);
      return { sha: response.data.sha, content };
    } catch (error) {
      console.error('Error getting latest file content:', error);
      throw error;
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>列表 CRUD</h1>
      <div className={styles.tabs}>
        <ul className={styles.tabList}>
          {Object.keys(data).map(key => (
            <li
              key={key}
              onClick={() => setActiveTab(key)}
              className={`${styles.tab} ${activeTab === key ? styles.activeTab : ''}`}
            >
              {key}
            </li>
          ))}
        </ul>
        {Object.entries(data).map(([key, items]) => (
          <div key={key} className={`${styles.tabPanel} ${activeTab === key ? styles.activePanel : ''}`}>
            <h2>{key}</h2>
            <button className={styles.button} onClick={handleCreate}><Plus size={16} /> 创建新项目</button>
            <table className={styles.table}>
              <thead>
                {renderTableHeader(items)}
              </thead>
              <tbody>
                {renderTableRows(items)}
              </tbody>
            </table>
          </div>
        ))}
      </div>
      <button className={styles.saveButton} onClick={handleSubmit}>
        <Save size={16} /> 保存到 GitHub
      </button>

      {showAddForm && (
        <div className={styles.formOverlay}>
          <form className={styles.form} onSubmit={handleAddSubmit}>
            <h2>添加新项目</h2>
            {Object.keys(data[activeTab][0] || {}).map(key => (
              key !== 'uuid' && (
                <div key={key} className={styles.formField}>
                  <label htmlFor={key}>{key}</label>
                  <input
                    id={key}
                    type="text"
                    value={newItem[key] || ''}
                    onChange={(e) => handleAddFormChange(key, e.target.value)}
                    required
                  />
                </div>
              )
            ))}
            <div className={styles.formButtons}>
              <button type="submit">添加</button>
              <button type="button" onClick={() => setShowAddForm(false)}>取消</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default ListCrud;