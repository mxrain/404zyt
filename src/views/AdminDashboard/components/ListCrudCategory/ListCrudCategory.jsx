import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Edit, Trash2, Plus, Save, X, Loader } from 'lucide-react';
import styles from './ListCrudCategory.module.css';
import { listConfig } from './listConfig';

export default function ListCrudCategory() {
  const { category } = useParams();
  const [data, setData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { githubApi, owner, repo } = useSelector(state => state.auth);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`https://raw.githubusercontent.com/${owner}/${repo}/master/src/db/list.json`);
      setData(response.data[category] || []);
    } catch (error) {
      console.error('获取数据时出错:', error);
      setError('获取数据失败，请稍后重试。');
    } finally {
      setIsLoading(false);
    }
  }, [owner, repo, category]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreate = (e) => {
    e.preventDefault();
    const idField = listConfig[category].fields.find(field => !field.editable);
    const newItemWithId = { 
      ...newItem, 
      [idField.name]: Date.now().toString() 
    };
    setData([...data, newItemWithId]);
    setNewItem({});
    setShowAddForm(false);
  };

  const handleEdit = (id) => {
    const itemToEdit = data.find(item => item[listConfig[category].fields.find(field => !field.editable).name] === id);
    setEditingId(id);
    setEditingItem({...itemToEdit});
  };

  const handleUpdate = (id) => {
    setData(data.map(item => item[listConfig[category].fields.find(field => !field.editable).name] === id ? editingItem : item));
    setEditingId(null);
    setEditingItem(null);
  };

  const handleDelete = (id) => {
    setItemToDelete(id);
    setShowConfirmDialog(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      setData(data.filter(item => item[listConfig[category].fields.find(field => !field.editable).name] !== itemToDelete));
      setItemToDelete(null);
    }
    setShowConfirmDialog(false);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 获取最新的文件内容和 SHA
      const { sha, content: currentContent } = await getLatestFileContent();

      // 比较当前内容和要保存的内容
      const updatedListData = { ...JSON.parse(currentContent), [category]: data };
      const newContent = JSON.stringify(updatedListData, null, 2);
      
      if (currentContent === newContent) {
        alert('没有变更需要保存');
        setIsLoading(false);
        return;
      }

      const encodedContent = btoa(unescape(encodeURIComponent(newContent)));

      const response = await axios.put(
        `https://api.github.com/repos/${owner}/${repo}/contents/src/db/list.json`,
        {
          message: `更新 ${category} 列表`,
          content: encodedContent,
          sha: sha,
          branch: 'master'  // 指定提交到 master 分支
        },
        {
          headers: {
            Authorization: `token ${githubApi}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('文件更新成功:', response.data);
      alert('数据已成功保存到GitHub的master分支');
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setError('保存失败：文件已被其他人修改。请刷新页面获取最新内容后再试。');
      } else {
        console.error('保存数据时出错:', error);
        setError('保存数据失败，请稍后重试。');
      }
    } finally {
      setIsLoading(false);
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
      console.error('获取最新文件内容时出错:', error);
      throw error;
    }
  };

  const renderFormField = (field, item, onChange, isEditing = false) => {
    const value = item[field.name] || '';
    const props = {
      id: field.name,
      name: field.name,
      value: field.type === 'array' ? (Array.isArray(value) ? value.join(', ') : value) : value,
      onChange: (e) => {
        const newValue = field.type === 'array' ? e.target.value.split(', ') : e.target.value;
        onChange({ ...item, [field.name]: newValue });
      },
      required: field.editable,
      disabled: !field.editable && !isEditing,
      className: styles.input
    };

    switch (field.type) {
      case 'number':
        return <input type="number" {...props} />;
      case 'datetime':
        return <input type="datetime-local" {...props} />;
      case 'array':
        return <input type="text" {...props} placeholder="用逗号分隔多个值" />;
      case 'image':
        return <input type="url" {...props} placeholder="输入图片URL" />;
      case 'text':
      default:
        return <input type="text" {...props} />;
    }
  };

  const renderTableRows = () => {  
    return data.map(item => {
      const id = item[listConfig[category].fields.find(field => !field.editable).name];
      const isEditing = editingId === id;
      return (
        <tr key={id}>
          {listConfig[category].fields.map(field => (
            <td key={field.name}>
              {isEditing
                ? renderFormField(field, editingItem, (updatedItem) => setEditingItem(updatedItem), true)
                : field.type === 'image'
                  ? <img src={item[field.name]} alt={item[field.name]} width="50" height="50" />
                  : item[field.name]}
            </td>
          ))}
          <td>
            {isEditing ? (
              <>
                <button className={`${styles.button} ${styles.saveButton}`} onClick={() => handleUpdate(id)}>
                  <Save size={16} /> 保存
                </button>
                <button className={`${styles.button} ${styles.cancelButton}`} onClick={() => setEditingId(null)}>
                  <X size={16} /> 取消
                </button>
              </>
            ) : (
              <button className={`${styles.button} ${styles.editButton}`} onClick={() => handleEdit(id)}>
                <Edit size={16} /> 编辑
              </button>
            )}
            <button className={`${styles.button} ${styles.deleteButton}`} onClick={() => handleDelete(id)}>
              <Trash2 size={16} /> 删除
            </button>
          </td>
        </tr>
      );
    });
  };

  if (isLoading) {
    return <div className={styles.loading}><Loader size={24} /> 加载中...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{category} 列表管理</h1>
      <button className={`${styles.button} ${styles.addButton}`} onClick={() => setShowAddForm(true)}>
        <Plus size={16} /> 创建新项目
      </button>
      <table className={styles.table}>
        <thead>
          <tr>
            {listConfig[category].fields.map(field => (
              <th key={field.name}>{field.label}</th>
            ))}
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {renderTableRows()}
        </tbody>
      </table>
      <button className={`${styles.button} ${styles.submitButton}`} onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? <Loader size={16} /> : <Save size={16} />} 保存到 GitHub
      </button>
      {showAddForm && (
        <div className={styles.formOverlay}>
          <form className={styles.form} onSubmit={handleCreate}>
            <h2>添加新项目</h2>
            {listConfig[category].fields.map(field => (
              <div key={field.name} className={styles.formField}>
                <label htmlFor={field.name}>{field.label}</label>
                {renderFormField(field, newItem, setNewItem, true)}
              </div>
            ))}
            <div className={styles.formButtons}>
              <button type="submit" className={styles.submitButton}>创建</button>
              <button type="button" className={styles.cancelButton} onClick={() => setShowAddForm(false)}>取消</button>
            </div>
          </form>
        </div>
      )}
      {showConfirmDialog && (
        <div className={styles.formOverlay}>
          <div className={styles.confirmDialog}>
            <p>确定要删除这个项目吗？</p>
            <div className={styles.formButtons}>
              <button onClick={confirmDelete} className={styles.deleteButton}>确定</button>
              <button onClick={() => setShowConfirmDialog(false)} className={styles.cancelButton}>取消</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}