import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { X, Edit, Plus, Save, Trash2 } from 'lucide-react';
import styles from './AddObjectPage.module.css'; // 导入CSS模块

const CategorySelector = ({ onSelect }) => {
  const [categories, setCategories] = useState({});
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://raw.githubusercontent.com/mxrain/404zyt/master/src/db/db.json');
        setCategories(response.data);
      } catch (error) {
        console.error('获取分类数据失败:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategories.length > 0) {
      const path = selectedCategories.join('>');
      onSelect(path);
    }
  }, [selectedCategories, onSelect]);

  const getSubcategories = (level) => {
    let currentCategories = categories;
    for (let i = 0; i < level; i++) {
      if (currentCategories && selectedCategories[i]) {
        currentCategories = currentCategories[selectedCategories[i]]?.items;
      } else {
        return [];
      }
    }
    return currentCategories ? Object.keys(currentCategories) : [];
  };

  const handleCategorySelect = (level, value) => {
    const newSelectedCategories = [...selectedCategories.slice(0, level), value];
    setSelectedCategories(newSelectedCategories);
  };

  const renderSelect = (level) => {
    const subcategories = getSubcategories(level);
    if (subcategories.length === 0 && level > 0) return null;

    return (
      <select
        key={level}
        value={selectedCategories[level] || ''}
        onChange={(e) => handleCategorySelect(level, e.target.value)}
        className={styles.select}
        disabled={level > 0 && !selectedCategories[level - 1]}
      >
        <option value="">请选择</option>
        {subcategories.map(category => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    );
  };

  return (
    <div className={styles.categorySelector}>
      {selectedCategories.map((_, index) => renderSelect(index))}
      {renderSelect(selectedCategories.length)}
    </div>
  );
};

const AddObjectPage = () => {
  // 从cookie中获取owner和repo
  const getCookieValue = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  const owner = getCookieValue('owner');
  const repo = getCookieValue('repo');

  const [resources, setResources] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [newResource, setNewResource] = useState({
    name: '',
    introduction: '',
    resource_information: {},
    link: '',
    uploaded: Date.now(),
    update_time: Date.now(),
    category: '',
    images: [''],
    tags: {},
    source_links: {
      info: { size: '' }
    },
    rating: 0,
    comments: 0,
    download_count: 0,
    download_limit: 0,
    score: 0,
    description: '',
    other_information: {}
  });
  const [detailedResource, setDetailedResource] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // 控制模态窗口的状态
  const [newTagCategory, setNewTagCategory] = useState('');
  const [newTagValues, setNewTagValues] = useState({});
  const [newPlatform, setNewPlatform] = useState('');
  const [newOtherInfoKey, setNewOtherInfoKey] = useState('');
  const [newOtherInfoValue, setNewOtherInfoValue] = useState('');

  const fetchResources = useCallback(async () => {
    try {
      const response = await axios.get(`https://raw.githubusercontent.com/${owner}/${repo}/master/src/db/uuid_resource_curd.json`);
      setResources(response.data);
    } catch (error) {
      console.error('获取资源时出错:', error);
    }
  }, [owner, repo]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const handleEdit = (id) => {
    setEditingId(id);
    setIsModalOpen(true);
  };

  const handleSave = async (id) => {
    if (id === 'new') {
      const newId = uuidv4();
      setResources(prev => ({
        ...prev,
        [newId]: {
          ...newResource,
          update_time: Date.now(),
          uploaded: Date.now()
        }
      }));
      setNewResource({
        name: '',
        introduction: '',
        resource_information: {},
        link: '',
        uploaded: Date.now(),
        update_time: Date.now(),
        category: '',
        images: [''],
        tags: {},
        source_links: {
          info: { size: '' }
        },
        rating: 0,
        comments: 0,
        download_count: 0,
        download_limit: 0,
        score: 0,
        description: '',
        other_information: {}
      });
    } else {
      setResources(prev => ({
        ...prev,
        [id]: { ...prev[id], update_time: Date.now() }
      }));
    }
    setEditingId(null);
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    setResources(prev => {
      const newResources = { ...prev };
      delete newResources[id];
      return newResources;
    });
  };

  const handleInputChange = (e, id) => { // 处理输入变化
    const { name, value } = e.target;
    if (id === 'new') {
      setNewResource(prev => ({ ...prev, [name]: value }));
    } else {
      setResources(prev => ({
        ...prev,
        [id]: { ...prev[id], [name]: value }
      }));
    }
  };

  const handleViewDetails = async (id) => { // 查看资源详情
    try {
      const response = await axios.get(`https://raw.githubusercontent.com/${owner}/${repo}/master/src/db/zyt/${id}.json`);
      setDetailedResource(response.data);
    } catch (error) {
      console.error('获取资源详情时出错:', error);
    }
  };

  const handleSyncToGithub = async () => { // 同步到GitHub
    console.log('Syncing data to GitHub...');
    alert('Data synced to GitHub successfully!');
  };

  const handleAddToList = (listType) => { // 添加到列表
    console.log(`Adding resource to ${listType} list...`);
    alert(`Resource added to ${listType} list successfully!`);
  };


  const handleTagChange = (e, category) => {
    const tags = e.target.value.split(',').map(tag => tag.trim());
    setNewResource(prev => ({
      ...prev,
      tags: {
        ...prev.tags,
        [category]: tags
      }
    }));
  };

  const handleSourceLinkChange = (e, platform, field) => {
    setNewResource(prev => ({
      ...prev,
      source_links: {
        ...prev.source_links,
        [platform]: {
          ...prev.source_links[platform],
          [field]: e.target.value
        }
      }
    }));
  };

  const handleAddTagCategory = () => {
    if (newTagCategory.trim() !== '') {
      setNewResource(prev => ({
        ...prev,
        tags: {
          ...prev.tags,
          [newTagCategory]: []
        }
      }));
      setNewTagCategory('');
    }
  };

  const handleNewTagValueChange = (category, value) => {
    setNewTagValues(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleAddTagValue = (category) => {
    if (newTagValues[category]?.trim()) {
      setNewResource(prev => ({
        ...prev,
        tags: {
          ...prev.tags,
          [category]: [...prev.tags[category], newTagValues[category]]
        }
      }));
      setNewTagValues(prev => ({
        ...prev,
        [category]: ''
      }));
    }
  };

  const handleAddPlatform = () => {
    if (newPlatform.trim() !== '') {
      setNewResource(prev => ({
        ...prev,
        source_links: {
          ...prev.source_links,
          [newPlatform]: { link: '', psw: '' }
        }
      }));
      setNewPlatform('');
    }
  };
  const handleAddOtherInformation = () => {
    if (newOtherInfoKey.trim() !== '' && newOtherInfoValue.trim() !== '') {
      setNewResource(prev => ({
        ...prev,
        other_information: {
          ...prev.other_information,
          [newOtherInfoKey]: newOtherInfoValue
        }
      }));
      setNewOtherInfoKey('');
      setNewOtherInfoValue('');
    }
  };

  const handleCategorySelect = useCallback((categoryPath) => {
    setNewResource(prev => ({
      ...prev,
      category: categoryPath
    }));
  }, []);

  return (
    <div className={styles.container}>
    <h1 className="text-2xl font-bold mb-4">资源管理</h1>
    <button
        className={`${styles.bgBlue500} mb-4 px-4 py-2 rounded`}
        onClick={() => setIsModalOpen(true)} // 打开模态窗口
    >
        <Plus className="inline-block mr-2" />
        添加新资源
    </button>

    {/* 模态窗口 */}
    {isModalOpen && (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <span className={styles.close} onClick={() => setIsModalOpen(false)}>&times;</span>
                <h2>{editingId ? '编辑资源' : '添加新资源'}</h2>
                <form className="mb-4">
                    {/* 名称 */}
                    <label className="block mb-2">
                        名称:
                        <input
                            type="text"
                            name="name"
                            placeholder="请输入名称"
                            value={editingId ? resources[editingId].name : newResource.name}
                            onChange={(e) => handleInputChange(e, editingId || 'new')}
                            className="border rounded px-2 py-1 w-full"
                        />
                    </label>
                    {/* 简介 */}
                    <label className="block mb-2">
                        简介:
                        <textarea
                            name="introduction"
                            placeholder="请输入简介"
                            value={editingId ? resources[editingId].introduction : newResource.introduction}
                            onChange={(e) => handleInputChange(e, editingId || 'new')}
                            className="border rounded px-2 py-1 w-full"
                        />
                    </label>
                    {/* 分类 */}
                    <div className="mb-2">
                      <label className="block font-bold mb-1">分类:</label>
                      <CategorySelector onSelect={handleCategorySelect} />
                    </div>
                    {/* 链接 */}
                    <label className="block mb-2">
                        链接:
                        <input
                            type="text"
                            name="link"
                            placeholder="请输入链接"
                            value={editingId ? resources[editingId].link : newResource.link}
                            onChange={(e) => handleInputChange(e, editingId || 'new')}
                            className="border rounded px-2 py-1 w-full"
                        />
                    </label>
                    {/* 图片链接 */}
                    <label className="block mb-2">
                        图片链接:
                        {(editingId ? resources[editingId].images : newResource.images).map((img, index) => (
                            <div key={index} className="flex items-center mb-1">
                                <input
                                    type="text"
                                    placeholder="请输入图片链接"
                                    value={img}
                                    onChange={(e) => {
                                        const newImages = [...(editingId ? resources[editingId].images : newResource.images)];
                                        newImages[index] = e.target.value;
                                        if (editingId) {
                                            setResources(prev => ({
                                                ...prev,
                                                [editingId]: { ...prev[editingId], images: newImages }
                                            }));
                                        } else {
                                            setNewResource(prev => ({ ...prev, images: newImages }));
                                        }
                                    }}
                                    className="border rounded px-2 py-1 w-full"
                                />
                                {index === (editingId ? resources[editingId].images.length : newResource.images.length) - 1 && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newImages = [...(editingId ? resources[editingId].images : newResource.images), ''];
                                            if (editingId) {
                                                setResources(prev => ({
                                                    ...prev,
                                                    [editingId]: { ...prev[editingId], images: newImages }
                                                }));
                                            } else {
                                                setNewResource(prev => ({ ...prev, images: newImages }));
                                            }
                                        }}
                                        className={`${styles.bgBlue500} ml-2 p-2 rounded`}
                                    >
                                        <Plus />
                                    </button>
                                )}
                                {(editingId ? resources[editingId].images.length : newResource.images.length) > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newImages = [...(editingId ? resources[editingId].images : newResource.images)];
                                            newImages.splice(index, 1);
                                            if (editingId) {
                                                setResources(prev => ({
                                                    ...prev,
                                                    [editingId]: { ...prev[editingId], images: newImages }
                                                }));
                                            } else {
                                                setNewResource(prev => ({ ...prev, images: newImages }));
                                            }
                                        }}
                                        className={`${styles.bgRed500} ml-2 p-2 rounded`}
                                    >
                                        <Trash2 />
                                    </button>
                                )}
                            </div>
                        ))}
                    </label>
                    {/* 标签部分 */}
                    <div className="mb-2">
                        <h3 className="font-bold">标签:</h3>
                        {Object.entries(editingId ? resources[editingId].tags : newResource.tags).map(([category, tags]) => (
                            <div key={category} className="mb-2">
                                <h4>{category}:</h4>
                                <div className="flex items-center mb-1">
                                    <input
                                        type="text"
                                        value={tags.join(', ')}
                                        onChange={(e) => handleTagChange(e, category)}
                                        placeholder={`编辑 ${category} 的标签，使用逗号分隔`}
                                        className="border rounded px-2 py-1 w-full"
                                    />
                                </div>
                                <div className="flex items-center mb-1">
                                    <input
                                        type="text"
                                        value={newTagValues[category] || ''}
                                        onChange={(e) => handleNewTagValueChange(category, e.target.value)}
                                        placeholder={`添加新的 ${category} 标签`}
                                        className="border rounded px-2 py-1 w-full mr-2"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleAddTagValue(category)}
                                        className={`${styles.bgBlue500} px-4 py-1 rounded`}
                                    >
                                        添加
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const updatedTags = { ...(editingId ? resources[editingId].tags : newResource.tags) };
                                            delete updatedTags[category];
                                            if (editingId) {
                                                setResources(prev => ({
                                                    ...prev,
                                                    [editingId]: { ...prev[editingId], tags: updatedTags }
                                                }));
                                            } else {
                                                setNewResource(prev => ({ ...prev, tags: updatedTags }));
                                            }
                                        }}
                                        className={`${styles.bgRed500} px-4 py-1 rounded ml-2`}
                                    >
                                        删除
                                    </button>
                                </div>
                            </div>
                        ))}
                        {/* 添加新标签类别 */}
                        <div className="flex items-center mb-1">
                            <input
                                type="text"
                                value={newTagCategory}
                                onChange={(e) => setNewTagCategory(e.target.value)}
                                placeholder="新标签类别"
                                className="border rounded px-2 py-1 w-full mr-2"
                            />
                            <button
                                type="button"
                                onClick={handleAddTagCategory}
                                className={`${styles.bgBlue500} px-4 py-1 rounded`}
                            >
                                添加类别
                            </button>
                        </div>
                    </div>
                    {/* 网盘链接部分 */}
                    <div className="mb-2">
                        <h3 className="font-bold">网盘链接:</h3>
                        {Object.entries(editingId ? resources[editingId].source_links : newResource.source_links).map(([platform, data]) => (
                            platform !== 'info' && (
                                <div key={platform} className="mb-2">
                                    <h4>{platform}:</h4>
                                    <div className="flex items-center mb-1">
                                        <input
                                            type="text"
                                            placeholder="链接"
                                            value={data.link}
                                            onChange={(e) => handleSourceLinkChange(e, platform, 'link')}
                                            className="border rounded px-2 py-1 w-full mr-2"
                                        />
                                        <input
                                            type="text"
                                            placeholder="密码"
                                            value={data.psw}
                                            onChange={(e) => handleSourceLinkChange(e, platform, 'psw')}
                                            className="border rounded px-2 py-1 w-full mr-2"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const updatedSourceLinks = { ...(editingId ? resources[editingId].source_links : newResource.source_links) };
                                                delete updatedSourceLinks[platform];
                                                if (editingId) {
                                                    setResources(prev => ({
                                                        ...prev,
                                                        [editingId]: { ...prev[editingId], source_links: updatedSourceLinks }
                                                    }));
                                                } else {
                                                    setNewResource(prev => ({ ...prev, source_links: updatedSourceLinks }));
                                                }
                                            }}
                                            className={`${styles.bgRed500} px-4 py-1 rounded`}
                                        >
                                            删除
                                        </button>
                                    </div>
                                </div>
                            )
                        ))}
                        {/* 添加新平台 */}
                        <div className="flex items-center mb-1">
                            <input
                                type="text"
                                value={newPlatform}
                                onChange={(e) => setNewPlatform(e.target.value)}
                                placeholder="新网盘平台"
                                className="border rounded px-2 py-1 w-full mr-2"
                            />
                            <button
                                type="button"
                                onClick={handleAddPlatform}
                                className={`${styles.bgBlue500} px-4 py-1 rounded`}
                            >
                                添加平台
                            </button>
                        </div>
                        {/* 文件大小 */}
                        <h4>文件大小:</h4>
                        <input
                            type="text"
                            placeholder="请输入文件大小"
                            value={editingId ? resources[editingId].source_links.info.size : newResource.source_links.info.size}
                            onChange={(e) => handleSourceLinkChange(e, 'info', 'size')}
                            className="border rounded px-2 py-1 w-full mb-1"
                        />
                    </div>
                    {/* 评分和其他数值字段 */}
                    <label className="block mb-2">
                        评分:
                        <input
                            type="number"
                            name="rating"
                            placeholder="请输入评分"
                            value={editingId ? resources[editingId].rating : newResource.rating}
                            onChange={(e) => handleInputChange(e, editingId || 'new')}
                            className="border rounded px-2 py-1 w-full"
                        />
                    </label>
                    <label className="block mb-2">
                        评论数:
                        <input
                            type="number"
                            name="comments"
                            placeholder="请输入评论数"
                            value={editingId ? resources[editingId].comments : newResource.comments}
                            onChange={(e) => handleInputChange(e, editingId || 'new')}
                            className="border rounded px-2 py-1 w-full"
                        />
                    </label>
                    <label className="block mb-2">
                        下载次数:
                        <input
                            type="number"
                            name="download_count"
                            placeholder="请输入下载次数"
                            value={editingId ? resources[editingId].download_count : newResource.download_count}
                            onChange={(e) => handleInputChange(e, editingId || 'new')}
                            className="border rounded px-2 py-1 w-full"
                        />
                    </label>
                    <label className="block mb-2">
                        下载限制:
                        <input
                            type="number"
                            name="download_limit"
                            placeholder="请输入下载限制"
                            value={editingId ? resources[editingId].download_limit : newResource.download_limit}
                            onChange={(e) => handleInputChange(e, editingId || 'new')}
                            className="border rounded px-2 py-1 w-full"
                        />
                    </label>
                    <label className="block mb-2">
                        分数:
                        <input
                            type="number"
                            name="score"
                            placeholder="请输入分数"
                            value={editingId ? resources[editingId].score : newResource.score}
                            onChange={(e) => handleInputChange(e, editingId || 'new')}
                            className="border rounded px-2 py-1 w-full"
                        />
                    </label>
                    <label className="block mb-2">
                        描述:
                        <textarea
                            name="description"
                            placeholder="请输入描述"
                            value={editingId ? resources[editingId].description : newResource.description}
                            onChange={(e) => handleInputChange(e, editingId || 'new')}
                            className="border rounded px-2 py-1 w-full"
                        />
                    </label>
                    {/* 其他信息部分 */}
                    <div className="mb-2">
                        <h3 className="font-bold">其他信息:</h3>
                        {Object.entries(editingId ? resources[editingId].other_information : newResource.other_information).map(([key, value]) => (
                            <div key={key} className="flex items-center mb-1">
                                <span className="mr-2">{key}:</span>
                                <span>{value}</span>
                            </div>
                        ))}
                        <div className="flex items-center mb-1">
                            <input
                                type="text"
                                value={newOtherInfoKey}
                                onChange={(e) => setNewOtherInfoKey(e.target.value)}
                                placeholder="新信息键"
                                className="border rounded px-2 py-1 w-1/2 mr-2"
                            />
                            <input
                                type="text"
                                value={newOtherInfoValue}
                                onChange={(e) => setNewOtherInfoValue(e.target.value)}
                                placeholder="新信息值"
                                className="border rounded px-2 py-1 w-1/2 mr-2"
                            />
                            <button
                                type="button"
                                onClick={handleAddOtherInformation}
                                className={`${styles.bgBlue500} px-4 py-1 rounded`}
                            >
                                添加
                            </button>
                        </div>
                    </div>
                    {/* 保存和关闭按钮 */}
                    <div className="flex justify-end">
                        <button
                            type="button"
                            className={`${styles.bgGreen500} mr-2 px-4 py-2 rounded`}
                            onClick={() => handleSave(editingId || 'new')}
                        >
                            <Save className="inline-block mr-1" />
                            保存
                        </button>
                        <button
                            type="button"
                            className={`${styles.bgRed500} px-4 py-2 rounded`}
                            onClick={() => setIsModalOpen(false)}
                        >
                            <X className="inline-block mr-1" />
                            关闭
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )}

    {/* 资源列表表格 */}
    <table className="min-w-full bg-white">
        <thead>
            <tr>
                <th className="py-2 px-4 border-b">名称</th>
                <th className="py-2 px-4 border-b">分类</th>
                <th className="py-2 px-4 border-b">更新时间</th>
                <th className="py-2 px-4 border-b">操作</th>
            </tr>
        </thead>
        <tbody>
            {Object.entries(resources).map(([id, resource]) => (
                <tr key={id}>
                    <td className="py-2 px-4 border-b">
                        {editingId === id ? (
                            <input
                                type="text"
                                name="name"
                                value={resource.name}
                                onChange={(e) => handleInputChange(e, id)}
                                className="border rounded px-2 py-1 w-full"
                            />
                        ) : (
                            resource.name
                        )}
                    </td>
                    <td className="py-2 px-4 border-b">{resource.category}</td>
                    <td className="py-2 px-4 border-b">
                        {new Date(resource.update_time).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}
                    </td>
                    <td className="py-2 px-4 border-b">
                        {editingId === id ? (
                            <>
                                <button
                                    className={`${styles.bgGreen500} mr-2 px-4 py-2 rounded`}
                                    onClick={() => handleSave(id)}
                                >
                                    <Save className="inline-block mr-1" />
                                    保存
                                </button>
                                <button
                                    className={`${styles.bgRed500} px-4 py-2 rounded`}
                                    onClick={() => setEditingId(null)}
                                >
                                    <X className="inline-block mr-1" />
                                    关闭
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    className={`${styles.bgYellow500} mr-2 px-4 py-2 rounded`}
                                    onClick={() => handleEdit(id)}
                                >
                                    <Edit className="inline-block mr-1" />
                                    编辑
                                </button>
                                <button
                                    className={`${styles.bgRed500} mr-2 px-4 py-2 rounded`}
                                    onClick={() => handleDelete(id)}
                                >
                                    <Trash2 className="inline-block mr-1" />
                                    删除
                                </button>
                                <button
                                    className={`${styles.bgBlue500} px-4 py-2 rounded`}
                                    onClick={() => handleViewDetails(id)}
                                >
                                    查看
                                </button>
                            </>
                        )}
                    </td>
                </tr>
            ))}
        </tbody>
    </table>

    {/* 操作按钮 */}
    <div className="mt-4">
        <button
            className={`${styles.bgPurple500} mr-2 px-4 py-2 rounded`}
            onClick={handleSyncToGithub}
        >
            同步到GitHub
        </button>
        <button
            className={`${styles.bgGreen500} mr-2 px-4 py-2 rounded`}
            onClick={() => handleAddToList('推荐')}
        >
            添加到推荐
        </button>
        <button
            className={`${styles.bgRed500} mr-2 px-4 py-2 rounded`}
            onClick={() => handleAddToList('热门')}
        >
            添加到热门
        </button>
        <button
            className={`${styles.bgYellow500} mr-2 px-4 py-2 rounded`}
            onClick={() => handleAddToList('最新')}
        >
            添加到最新
        </button>
        <button
            className={`${styles.bgIndigo500} px-4 py-2 rounded`}
            onClick={() => handleAddToList('顶部')}
        >
            添加到顶部
        </button>
    </div>

    {/* 资源详情弹窗 */}
    {detailedResource && (
        <div className="mt-4 p-4 border rounded">
            <h2 className="text-xl font-bold mb-2">资源详情</h2>
            <pre>{JSON.stringify(detailedResource, null, 2)}</pre>
            <button
                className={`${styles.bgGray500} mt-2 px-4 py-2 rounded`}
                onClick={() => setDetailedResource(null)}
            >
                关闭
            </button>
        </div>
    )}
</div>
  );
};

export default AddObjectPage;