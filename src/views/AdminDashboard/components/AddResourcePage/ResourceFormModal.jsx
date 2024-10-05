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
    link: '',
    uploaded: Math.floor(Date.now() / 1000),
    update_time: Math.floor(Date.now() / 1000),
    category: '',
    images: [],
    tags: {},
    source_links: {},
    rating: 0,
    comments: 0,
    download_count: 0,
    download_limit: 0,
    score: 0,
    description: '',
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
      const response = await fetch(`https://raw.gitmirror.com/mxrain/404zyt/master/src/db/zyt/${uuid}.json`);
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
    const { name, value } = e.target;
    setUuidData(prev => ({ ...prev, [name]: value }));
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
      ...uuidData,
    };

    const listItem = {
      uuid,
      name: uuidData.name,
      description: uuidData.introduction || '',
      size: uuidData.source_links?.info?.size || '',
      image: uuidData.images[0] || 'https://picsum.photos/220/140',
      updatetime: new Date(currentTime * 1000).toISOString(),
      category: updatedResource.category,
      rating: uuidData.rating,
      comments: uuidData.comments,
      download_count: uuidData.download_count,
      tags: Object.values(uuidData.tags).flat(),
      score: uuidData.rating
    };

    const updatedListOptions = {};
    Object.keys(listOptions).forEach(option => {
      if (listOptions[option]) {
        updatedListOptions[option] = [listItem, ...(updatedListOptions[option] || [])];
      }
    });

    onSave(updatedResource, uuidData, updatedListOptions);
  };

  const generateUUID = () => {
    return Date.now().toString();
  };

  const renderCategoryOptions = (obj, prefix = '') => {
    return Object.entries(obj).flatMap(([key, value]) => {
      const fullPath = prefix ? `${prefix}>${key}` : key;
      if (value.items) {
        return [
          <optgroup key={fullPath} label={fullPath}>
            {Object.entries(value.items).map(([subKey, subValue]) => {
              const subFullPath = `${fullPath}>${subKey}`;
              return <option key={subFullPath} value={subFullPath}>{subFullPath}</option>;
            })}
          </optgroup>
        ];
      }
      return [<option key={fullPath} value={fullPath}>{fullPath}</option>];
    });
  };

  const renderInputField = (type, name, value, onChange, placeholder, className) => (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
    />
  );

  const renderTextareaField = (name, value, onChange, placeholder, className) => (
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
    />
  );

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>{editingId ? '编辑资源' : '添加资源'}</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className={styles.formSection}>
            <h3>基本信息</h3>
            {renderInputField('text', 'title', resource.title, handleInputChange, '标题', styles.input)}
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
            {renderInputField('text', 'name', uuidData.name, handleUuidDataChange, '名称', styles.input)}
            {renderTextareaField('introduction', uuidData.introduction, handleUuidDataChange, '简介', styles.textarea)}
            {renderInputField('text', 'link', uuidData.link, handleUuidDataChange, '链接', styles.input)}
            {renderInputField('number', 'rating', uuidData.rating, handleUuidDataChange, '评分', styles.input)}
            {renderInputField('number', 'comments', uuidData.comments, handleUuidDataChange, '评论数', styles.input)}
            {renderInputField('number', 'download_count', uuidData.download_count, handleUuidDataChange, '下载次数', styles.input)}
            {renderInputField('number', 'download_limit', uuidData.download_limit, handleUuidDataChange, '下载限制', styles.input)}
            {renderInputField('password', 'password', uuidData.password, handleUuidDataChange, '密码', styles.input)}
            {renderTextareaField('description', uuidData.description, handleUuidDataChange, '描述', styles.textarea)}
          </div>

          <div className={styles.formSection}>
            <h3>资源信息</h3>
            {Object.entries(uuidData.resource_information).map(([key, value], index) => (
              <div key={index} className={styles.complexField}>
                {renderInputField('text', key, key, (e) => handleComplexFieldChange('resource_information', e.target.value, value), '键', styles.input)}
                {renderInputField('text', key, value, (e) => handleComplexFieldChange('resource_information', key, e.target.value), '值', styles.input)}
                <button type="button" onClick={() => removeComplexField('resource_information', key)} className={styles.removeButton}>删除</button>
              </div>
            ))}
            <button type="button" onClick={() => addComplexField('resource_information')} className={styles.addButton}>添加资源信息</button>
          </div>

          <div className={styles.formSection}>
            <h3>图片</h3>
            {uuidData.images.map((image, index) => (
              <div key={index} className={styles.arrayField}>
                {renderInputField('text', `image_${index}`, image, (e) => handleArrayFieldChange('images', index, e.target.value), `图片 ${index + 1}`, styles.input)}
                <button type="button" onClick={() => removeArrayField('images', index)} className={styles.removeButton}>删除</button>
              </div>
            ))}
            <button type="button" onClick={() => addArrayField('images')} className={styles.addButton}>添加图片</button>
          </div>

          <div className={styles.formSection}>
            <h3>标签</h3>
            {Object.entries(uuidData.tags).map(([key, value], index) => (
              <div key={index} className={styles.complexField}>
                {renderInputField('text', key, key, (e) => handleComplexFieldChange('tags', e.target.value, value), '键', styles.input)}
                {renderInputField('text', key, value, (e) => handleComplexFieldChange('tags', key, e.target.value), '值', styles.input)}
                <button type="button" onClick={() => removeComplexField('tags', key)} className={styles.removeButton}>删除</button>
              </div>
            ))}
            <button type="button" onClick={() => addComplexField('tags')} className={styles.addButton}>添加标签</button>
          </div>

          <div className={styles.formSection}>
            <h3>来源链接</h3>
            {Object.entries(uuidData.source_links).map(([key, value], index) => (
              <div key={index} className={styles.complexField}>
                {renderInputField('text', key, key, (e) => handleComplexFieldChange('source_links', e.target.value, value), '键', styles.input)}
                {renderInputField('text', key, value, (e) => handleComplexFieldChange('source_links', key, e.target.value), '值', styles.input)}
                <button type="button" onClick={() => removeComplexField('source_links', key)} className={styles.removeButton}>删除</button>
              </div>
            ))}
            <button type="button" onClick={() => addComplexField('source_links')} className={styles.addButton}>添加来源链接</button>
          </div>

          <div className={styles.formSection}>
            <h3>其他信息</h3>
            {Object.entries(uuidData.other_information).map(([key, value], index) => (
              <div key={index} className={styles.complexField}>
                {renderInputField('text', key, key, (e) => handleComplexFieldChange('other_information', e.target.value, value), '键', styles.input)}
                {renderInputField('text', key, value, (e) => handleComplexFieldChange('other_information', key, e.target.value), '值', styles.input)}
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
