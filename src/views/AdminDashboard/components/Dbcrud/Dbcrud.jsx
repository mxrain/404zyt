import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Edit, Trash2, Plus, ChevronDown, ChevronRight, Save } from 'lucide-react';
import * as LucideIcons from 'lucide-react';  // 导入所有 Lucide 图标
import styles from './Dbcrud.module.css';

// 新增 AddItemForm 组件
const AddItemForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({ key: '', icon: '', link: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className={styles.formOverlay}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>添加新项目</h2>
        <input
          type="text"
          name="key"
          value={formData.key}
          onChange={handleChange}
          placeholder="类别名称"
          required
        />
        <input
          type="text"
          name="icon"
          value={formData.icon}
          onChange={handleChange}
          placeholder="图标路径"
        />
        <input
          type="text"
          name="link"
          value={formData.link}
          onChange={handleChange}
          placeholder="链接"
        />
        <div className={styles.formButtons}>
          <button type="submit">添加</button>
          <button type="button" onClick={onCancel}>取消</button>
        </div>
      </form>
    </div>
  );
};

const RecursiveTableRow = ({ data, path, onEdit, onDelete, onAdd, onKeyEdit }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(data);
  const [editedKey, setEditedKey] = useState(path[path.length - 1]);

  const handleToggle = () => setIsExpanded(!isExpanded);

  const handleEdit = () => setIsEditing(true);

  const handleSave = () => {
    onEdit(path, editedData);
    onKeyEdit(path, editedKey);
    setIsEditing(false);
  };

  const handleChange = (field, value) => {
    setEditedData(prev => ({ ...prev, [field]: value }));
  };

  const hasChildren = data.items && Object.keys(data.items).length > 0;

  return (
    <>
      <tr data-level={path.length - 1}>
        <td>
          <div className={styles.nestedRow} style={{ marginLeft: `${path.length * 20}px` }}>
            {hasChildren && (
              <button className={styles.toggleButton} onClick={handleToggle}>
                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
            )}
            {!hasChildren && <span className={styles.spacer}></span>}
            {isEditing ? (
              <input
                className={styles.input}
                value={editedKey}
                onChange={(e) => setEditedKey(e.target.value)}
              />
            ) : (
              path[path.length - 1]
            )}
          </div>
        </td>
        <td>
          {isEditing ? (
            <input
              className={styles.input}
              value={editedData.icon}
              onChange={(e) => handleChange('icon', e.target.value)}
            />
          ) : (
            data.icon && LucideIcons[data.icon] && React.createElement(LucideIcons[data.icon])
          )}
        </td>
        <td>
          {isEditing ? (
            <input
              className={styles.input}
              value={editedData.link}
              onChange={(e) => handleChange('link', e.target.value)}
            />
          ) : (
            data.link
          )}
        </td>
        <td>
          {isEditing ? (
            <button className={styles.button} onClick={handleSave}>保存</button>
          ) : (
            <button className={styles.button} onClick={handleEdit}><Edit size={16} /></button>
          )}
          <button className={styles.button} onClick={() => onDelete(path)}><Trash2 size={16} /></button>
          <button className={styles.button} onClick={() => onAdd(path)}><Plus size={16} /></button>
        </td>
      </tr>
      {isExpanded && hasChildren && Object.entries(data.items).map(([key, value]) => (
        <RecursiveTableRow
          key={key}
          data={value}
          path={[...path, key]}
          onEdit={onEdit}
          onDelete={onDelete}
          onAdd={onAdd}
          onKeyEdit={onKeyEdit}
        />
      ))}
    </>
  );
};

const CRUDTable = () => {
  const [data, setData] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [currentPath, setCurrentPath] = useState([]);
  const { githubApi, owner, repo } = useSelector(state => state.auth);

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(`https://raw.githubusercontent.com/${owner}/${repo}/master/src/db/db.json`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [owner, repo]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleEdit = (path, newData) => {
    setData(prevData => {
      const updatedData = { ...prevData };
      let current = updatedData;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]].items || current[path[i]];
      }
      current[path[path.length - 1]] = newData;
      return updatedData;
    });
  };

  const handleKeyEdit = (path, newKey) => {
    setData(prevData => {
      const updatedData = { ...prevData };
      let current = updatedData;
      for (let i = 0; i < path.length - 1; i++) {
        if (current[path[i]] && current[path[i]].items) {
          current = current[path[i]].items;
        } else {
          // 如果路径不存在，直接返回之前的数据
          return prevData;
        }
      }
      if (current[path[path.length - 1]] && path[path.length - 1] !== newKey) {
        current[newKey] = current[path[path.length - 1]];
        delete current[path[path.length - 1]];
      }
      return updatedData;
    });
  };

  const handleDelete = (path) => {
    setData(prevData => {
      const updatedData = { ...prevData };
      let current = updatedData;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]].items || current[path[i]];
      }
      delete current[path[path.length - 1]];
      return updatedData;
    });
  };

  const handleAdd = (path) => {
    setCurrentPath(path);
    setShowAddForm(true);
  };

  const handleAddSubmit = (formData) => {
    setData(prevData => {
      const updatedData = { ...prevData };
      let current = updatedData;
      for (let i = 0; i < currentPath.length; i++) {
        if (!current[currentPath[i]]) {
          current[currentPath[i]] = {};
        }
        if (!current[currentPath[i]].items) {
          current[currentPath[i]].items = {};
        }
        current = current[currentPath[i]].items;
      }
      current[formData.key] = { icon: formData.icon, link: formData.link };
      return updatedData;
    });
    setShowAddForm(false);
  };

  const handleSave = async () => {
    try {
      // 获取最新的文件内容和 SHA
      const { sha, content: currentContent } = await getLatestFileContent();

      // 比较当前内容和要保存的内容
      const newContent = JSON.stringify(data, null, 2);
      if (currentContent === newContent) {
        alert('没有变更需要保存');
        return;
      }

      const encodedContent = btoa(unescape(encodeURIComponent(newContent)));

      const response = await axios.put(
        `https://api.github.com/repos/${owner}/${repo}/contents/src/db/db.json`,
        {
          message: 'Update db.json via admin dashboard',
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
        `https://api.github.com/repos/${owner}/${repo}/contents/src/db/db.json?ref=master`,  // 指定从 master 分支获取内容
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
      <h1 className={styles.title}>CRUD 表格</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>类别</th>
            <th>图标</th>
            <th>链接</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(data).map(([key, value]) => (
            <RecursiveTableRow
              key={key}
              data={value}
              path={[key]}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAdd={handleAdd}
              onKeyEdit={handleKeyEdit}
            />
          ))}
        </tbody>
      </table>
      <button className={styles.saveButton} onClick={handleSave}>
        <Save size={16} /> 保存到 GitHub
      </button>
      {showAddForm && (
        <AddItemForm
          onSubmit={handleAddSubmit}
          onCancel={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
};

export default CRUDTable;