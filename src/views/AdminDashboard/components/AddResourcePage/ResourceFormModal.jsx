import React, { useState, useEffect } from 'react';
import styles from './ResourceFormModal.module.css';

export default function ResourceFormModal({ onClose, onSave, categories, editingId, initialResource }) {
  const [resource, setResource] = useState({
    title: '',
    category: '',
    updatetime: '',
    uuid: '',
  });
  const [uuidData, setUuidData] = useState({
    name: '',
    introduction: '',
    resource_information: {},
    is_tup_up: false,
    quark_link: '',
    uploaded: '',
    update_time: '',
    category: { main: '', sub: { main: '', sub: '' } },
    resource_directory: '',
    images: [],
    tags: {},
    resource_type: '',
    resource_sub_type: '',
    link: '',
    rating: 0,
    comments: [],
    download_count: 0,
    download_limit: 0,
    password: '',
    source_links: {
      '夸克网盘': 'https://pan.quark.cn/s/1234567890',
      
    },
    other_information: {}
  });

  const [listOptions, setListOptions] = useState({
    recommend: false,
    hot: false,
    latest: false,
    top: false,
  });

  useEffect(() => {
    if (editingId && initialResource) {
      setResource(initialResource);
      fetchUuidData(editingId);
    }
  }, [editingId, initialResource]);

  const fetchUuidData = async (uuid) => {
    try {
      const response = await fetch(`https://raw.githubusercontent.com/mxrain/404zyt/master/src/db/zyt/${uuid}.json`);
      if (response.ok) {
        const data = await response.json();
        setUuidData(data);
      }
    } catch (error) {
      console.error('获取 UUID 数据失败:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setResource(prev => ({ ...prev, [name]: value }));
  };

  const handleUuidDataChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUuidData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleComplexFieldChange = (fieldName, key, value) => {
    setUuidData(prev => ({
      ...prev,
      [fieldName]: { ...prev[fieldName], [key]: value }
    }));
  };

  const handleArrayFieldChange = (fieldName, index, value) => {
    setUuidData(prev => ({
      ...prev,
      [fieldName]: prev[fieldName].map((item, i) => i === index ? value : item)
    }));
  };

  const addComplexField = (fieldName) => {
    setUuidData(prev => ({
      ...prev,
      [fieldName]: { ...prev[fieldName], '': '' }
    }));
  };

  const removeComplexField = (fieldName, key) => {
    setUuidData(prev => {
      const newField = { ...prev[fieldName] };
      delete newField[key];
      return { ...prev, [fieldName]: newField };
    });
  };

  const addArrayField = (fieldName) => {
    setUuidData(prev => ({
      ...prev,
      [fieldName]: [...prev[fieldName], '']
    }));
  };

  const removeArrayField = (fieldName, index) => {
    setUuidData(prev => ({
      ...prev,
      [fieldName]: prev[fieldName].filter((_, i) => i !== index)
    }));
  };

  const handleListOptionChange = (e) => {
    const { name, checked } = e.target;
    setListOptions(prev => ({ ...prev, [name]: checked }));
  };

  const handleSave = () => {
    const currentTime = Math.floor(Date.now() / 1000);
    const uuid = editingId || generateUUID();

    const updatedResource = {
      ...resource,
      uuid,
      updatetime: currentTime,
    };

    const updatedUuidData = {
      ...uuidData,
      uuid,
      uploaded: uuidData.uploaded || currentTime,
      update_time: currentTime,
    };

    // 准备添加到各个列表的数据
    const listItem = {
      uuid,
      title: updatedResource.title,
      name: updatedUuidData.name || updatedResource.title,
      description: updatedUuidData.introduction || '',
      size: updatedUuidData.resource_information.size || '',
      image: updatedUuidData.images[0] || 'https://picsum.photos/220/140',
      updatetime: new Date(currentTime * 1000).toISOString(),
      link: updatedUuidData.link,
      category: updatedResource.category,
      rating: updatedUuidData.rating,
      comments: updatedUuidData.comments,
      download_count: updatedUuidData.download_count,
      tags: Object.values(updatedUuidData.tags),
      score: updatedUuidData.rating,
      introduction: updatedUuidData.introduction,
      resource_type: updatedUuidData.resource_type,
      resource_sub_type: updatedUuidData.resource_sub_type,
      is_tup_up: updatedUuidData.is_tup_up,
      download_limit: updatedUuidData.download_limit,
      password: updatedUuidData.password,
      source_links: updatedUuidData.source_links,
      other_information: updatedUuidData.other_information
    };

    // 根据 listOptions 决定添加到哪些列表
    const updatedListOptions = {};
    Object.keys(listOptions).forEach(option => {
      if (listOptions[option]) {
        updatedListOptions[option] = [listItem, ...(updatedListOptions[option] || [])];
      }
    });

    onSave(updatedResource, updatedUuidData, updatedListOptions);
  };

  const generateUUID = () => {
    return Date.now().toString();
  };

  const renderCategoryOptions = (obj, prefix = '') => {
    return Object.entries(obj).map(([key, value]) => {
      const fullPath = prefix ? `${prefix}>${key}` : key;
      if (value.items) {
        return (
          <optgroup key={fullPath} label={fullPath}>
            {renderCategoryOptions(value.items, fullPath)}
          </optgroup>
        );
      }
      return <option key={fullPath} value={fullPath}>{fullPath}</option>;
    });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>{editingId ? '编辑资源' : '添加资源'}</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className={styles.formSection}>
            <h3>基本信息</h3>
            <input
              type="text"
              name="title"
              value={resource.title}
              onChange={handleInputChange}
              placeholder="标题"
              className={styles.input}
            />
            <select
              name="category"
              value={resource.category}
              onChange={handleInputChange}
              className={styles.select}
            >
              <option value="">选择分类</option>
              {renderCategoryOptions(categories)}
            </select>
          </div>

          <div className={styles.formSection}>
            <h3>UUID 数据</h3>
            <input
              type="text"
              name="name"
              value={uuidData.name}
              onChange={handleUuidDataChange}
              placeholder="名称"
              className={styles.input}
            />
            <textarea
              name="introduction"
              value={uuidData.introduction}
              onChange={handleUuidDataChange}
              placeholder="简介"
              className={styles.textarea}
            />
            <input
              type="text"
              name="resource_type"
              value={uuidData.resource_type}
              onChange={handleUuidDataChange}
              placeholder="资源类型"
              className={styles.input}
            />
            <input
              type="text"
              name="resource_sub_type"
              value={uuidData.resource_sub_type}
              onChange={handleUuidDataChange}
              placeholder="资源子类型"
              className={styles.input}
            />
            <input
              type="text"
              name="link"
              value={uuidData.link}
              onChange={handleUuidDataChange}
              placeholder="链接"
              className={styles.input}
            />
            <div className={styles.checkboxGroup}>
              <input
                type="checkbox"
                name="is_tup_up"
                checked={uuidData.is_tup_up}
                onChange={handleUuidDataChange}
                id="is_tup_up"
              />
              <label htmlFor="is_tup_up">是否置顶</label>
            </div>
            <input
              type="text"
              name="quark_link"
              value={uuidData.quark_link}
              onChange={handleUuidDataChange}
              placeholder="夸克链接"
              className={styles.input}
            />
            <input
              type="text"
              name="resource_directory"
              value={uuidData.resource_directory}
              onChange={handleUuidDataChange}
              placeholder="资源目录"
              className={styles.input}
            />
            <input
              type="number"
              name="rating"
              value={uuidData.rating}
              onChange={handleUuidDataChange}
              placeholder="评分"
              className={styles.input}
            />
            <input
              type="number"
              name="download_count"
              value={uuidData.download_count}
              onChange={handleUuidDataChange}
              placeholder="下载次数"
              className={styles.input}
            />
            <input
              type="number"
              name="download_limit"
              value={uuidData.download_limit}
              onChange={handleUuidDataChange}
              placeholder="下载限制"
              className={styles.input}
            />
            <input
              type="password"
              name="password"
              value={uuidData.password}
              onChange={handleUuidDataChange}
              placeholder="密码"
              className={styles.input}
            />
            <textarea
              name="description"
              value={uuidData.description}
              onChange={handleUuidDataChange}
              placeholder="描述"
              className={styles.textarea}
            />
          </div>

          <div className={styles.formSection}>
            <h3>资源信息</h3>
            {Object.entries(uuidData.resource_information).map(([key, value], index) => (
              <div key={index} className={styles.complexField}>
                <input
                  type="text"
                  value={key}
                  onChange={(e) => handleComplexFieldChange('resource_information', e.target.value, value)}
                  placeholder="键"
                  className={styles.input}
                />
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleComplexFieldChange('resource_information', key, e.target.value)}
                  placeholder="值"
                  className={styles.input}
                />
                <button type="button" onClick={() => removeComplexField('resource_information', key)} className={styles.removeButton}>删除</button>
              </div>
            ))}
            <button type="button" onClick={() => addComplexField('resource_information')} className={styles.addButton}>添加资源信息</button>
          </div>

          <div className={styles.formSection}>
            <h3>图片</h3>
            {uuidData.images.map((image, index) => (
              <div key={index} className={styles.arrayField}>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => handleArrayFieldChange('images', index, e.target.value)}
                  placeholder={`图片 ${index + 1}`}
                  className={styles.input}
                />
                <button type="button" onClick={() => removeArrayField('images', index)} className={styles.removeButton}>删除</button>
              </div>
            ))}
            <button type="button" onClick={() => addArrayField('images')} className={styles.addButton}>添加图片</button>
          </div>

          <div className={styles.formSection}>
            <h3>标签</h3>
            {Object.entries(uuidData.tags).map(([key, value], index) => (
              <div key={index} className={styles.complexField}>
                <input
                  type="text"
                  value={key}
                  onChange={(e) => handleComplexFieldChange('tags', e.target.value, value)}
                  placeholder="键"
                  className={styles.input}
                />
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleComplexFieldChange('tags', key, e.target.value)}
                  placeholder="值"
                  className={styles.input}
                />
                <button type="button" onClick={() => removeComplexField('tags', key)} className={styles.removeButton}>删除</button>
              </div>
            ))}
            <button type="button" onClick={() => addComplexField('tags')} className={styles.addButton}>添加标签</button>
          </div>

          <div className={styles.formSection}>
            <h3>来源链接</h3>
            {Object.entries(uuidData.source_links).map(([key, value], index) => (
              <div key={index} className={styles.complexField}>
                <input
                  type="text"
                  value={key}
                  onChange={(e) => handleComplexFieldChange('source_links', e.target.value, value)}
                  placeholder="键"
                  className={styles.input}
                />
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleComplexFieldChange('source_links', key, e.target.value)}
                  placeholder="值"
                  className={styles.input}
                />
                <button type="button" onClick={() => removeComplexField('source_links', key)} className={styles.removeButton}>删除</button>
              </div>
            ))}
            <button type="button" onClick={() => addComplexField('source_links')} className={styles.addButton}>添加来源链接</button>
          </div>

          <div className={styles.formSection}>
            <h3>其他信息</h3>
            {Object.entries(uuidData.other_information).map(([key, value], index) => (
              <div key={index} className={styles.complexField}>
                <input
                  type="text"
                  value={key}
                  onChange={(e) => handleComplexFieldChange('other_information', e.target.value, value)}
                  placeholder="键"
                  className={styles.input}
                />
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleComplexFieldChange('other_information', key, e.target.value)}
                  placeholder="值"
                  className={styles.input}
                />
                <button type="button" onClick={() => removeComplexField('other_information', key)} className={styles.removeButton}>删除</button>
              </div>
            ))}
            <button type="button" onClick={() => addComplexField('other_information')} className={styles.addButton}>添加其他信息</button>
          </div>

          <div className={styles.formSection}>
            <h3>添加到排行榜</h3>
            {Object.keys(listOptions).map((option) => (
              <div key={option} className={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  id={option}
                  name={option}
                  checked={listOptions[option]}
                  onChange={handleListOptionChange}
                />
                <label htmlFor={option}>{option.charAt(0).toUpperCase() + option.slice(1)}</label>
              </div>
            ))}
          </div>

          <div className={styles.buttonGroup}>
            <button type="button" onClick={handleSave} className={styles.saveButton}>
              保存
            </button>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              取消
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
