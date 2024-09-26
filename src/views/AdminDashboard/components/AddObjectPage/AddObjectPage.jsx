import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { X, Edit, Plus, Save, Trash2 } from 'lucide-react';
import styles from './AddObjectPage.module.css'; // 导入CSS模块

const ResourceTable = () => {
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
    link: '',
    category: '',
    images: [''],
    tags: {
      '文学类型': [],
      '主题': [],
      '作者': [],
      '特色': []
    },
    source_links: {
      '阿里云盘': { link: '', psw: '' },
      '夸克网盘': { link: '', psw: '' },
      '百度网盘': { link: '', psw: '' },
      '迅雷云盘': { link: '', psw: '' },
      'UC云盘': { link: '', psw: '' },
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
  const [newTag, setNewTag] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // 控制模态窗口的状态

  const fetchResources = useCallback(async () => {
    try {
      const response = await axios.get(`https://raw.githubusercontent.com/${owner}/${repo}/master/src/db/uuid_resource_curd.json`);
      setResources(response.data);
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
  }, [owner, repo]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const handleEdit = (id) => {
    setEditingId(id);
  };

  const handleSave = async (id) => {
    if (id === 'new') {
      const newId = uuidv4();
      const { name, introduction, link, category, images, tags, source_links, rating, comments, download_count, download_limit, score, description, other_information } = newResource;
      setResources(prev => ({
        ...prev,
        [newId]: {
          name,
          introduction,
          link,
          category,
          images,
          tags,
          source_links,
          rating,
          comments,
          download_count,
          download_limit,
          score,
          description,
          other_information,
          update_time: Date.now()
        }
      }));
      setNewResource({
        name: '',
        introduction: '',
        link: '',
        category: '',
        images: [''],
        tags: {
          '文学类型': [],
          '主题': [],
          '作者': [],
          '特色': []
        },
        source_links: {
          '阿里云盘': { link: '', psw: '' },
          '夸克网盘': { link: '', psw: '' },
          '百度网盘': { link: '', psw: '' },
          '迅雷云盘': { link: '', psw: '' },
          'UC云盘': { link: '', psw: '' },
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
    setIsModalOpen(false); // 关闭模态窗口
  };

  const handleDelete = (id) => {
    setResources(prev => {
      const newResources = { ...prev };
      delete newResources[id];
      return newResources;
    });
  };

  const handleInputChange = (e, id) => {
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

  const handleViewDetails = async (id) => {
    try {
      const response = await axios.get(`https://raw.githubusercontent.com/${owner}/${repo}/master/src/db/zyt/${id}.json`);
      setDetailedResource(response.data);
    } catch (error) {
      console.error('Error fetching resource details:', error);
    }
  };

  const handleSyncToGithub = async () => {
    console.log('Syncing data to GitHub...');
    alert('Data synced to GitHub successfully!');
  };

  const handleAddToList = (listType) => {
    console.log(`Adding resource to ${listType} list...`);
    alert(`Resource added to ${listType} list successfully!`);
  };

  const handleAddTag = () => {
    if (newTag.trim() !== '') {
      setNewResource(prev => ({
        ...prev,
        tags: {
          ...prev.tags,
          '文学类型': [...prev.tags['文学类型'], newTag]
        }
      }));
      setNewTag('');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className="text-2xl font-bold mb-4">Resource Management</h1>
      <button
        className={`${styles.bgBlue500} mb-4`}
        onClick={() => setIsModalOpen(true)} // 打开模态窗口
      >
        <Plus className="inline-block mr-2" />
        Add New Resource
      </button>

      {/* 模态窗口 */}
      {isModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <span className={styles.close} onClick={() => setIsModalOpen(false)}>&times;</span>
            <h2>Add New Resource</h2>
            <form className="mb-4">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={newResource.name}
                onChange={(e) => handleInputChange(e, 'new')}
                className="border rounded px-2 py-1 w-full mb-2"
              />
              <textarea
                name="introduction"
                placeholder="Introduction"
                value={newResource.introduction}
                onChange={(e) => handleInputChange(e, 'new')}
                className="border rounded px-2 py-1 w-full mb-2"
              />
              <input
                type="text"
                name="link"
                placeholder="Link"
                value={newResource.link}
                onChange={(e) => handleInputChange(e, 'new')}
                className="border rounded px-2 py-1 w-full mb-2"
              />
              <input
                type="text"
                name="category"
                placeholder="Category"
                value={newResource.category}
                onChange={(e) => handleInputChange(e, 'new')}
                className="border rounded px-2 py-1 w-full mb-2"
              />
              <input
                type="text"
                name="images"
                placeholder="Image URL"
                value={newResource.images[0]}
                onChange={(e) => handleInputChange(e, 'new')}
                className="border rounded px-2 py-1 w-full mb-2"
              />
              <div className="mb-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                  className="border rounded px-2 py-1 w-full"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className={`${styles.bgBlue500} mt-2`}
                >
                  Add Tag
                </button>
              </div>
              <div className="mb-2">
                <h3 className="font-bold">Tags:</h3>
                <ul>
                  {newResource.tags['文学类型'].map((tag, index) => (
                    <li key={index}>{tag}</li>
                  ))}
                </ul>
              </div>
              <button
                type="button"
                className={`${styles.bgGreen500} mr-2`}
                onClick={() => handleSave('new')}
              >
                <Save className="inline-block" />
              </button>
              <button
                type="button"
                className={`${styles.bgRed500}`}
                onClick={() => setIsModalOpen(false)}
              >
                <X className="inline-block" />
              </button>
            </form>
          </div>
        </div>
      )}

      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Category</th>
            <th className="py-2 px-4 border-b">Update Time</th>
            <th className="py-2 px-4 border-b">Actions</th>
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
              <td className="py-2 px-4 border-b">
                {editingId === id ? (
                  <input
                    type="text"
                    name="category"
                    value={resource.category}
                    onChange={(e) => handleInputChange(e, id)}
                    className="border rounded px-2 py-1 w-full"
                  />
                ) : (
                  resource.category
                )}
              </td>
              <td className="py-2 px-4 border-b">
                {new Date(resource.update_time).toLocaleString()}
              </td>
              <td className="py-2 px-4 border-b">
                {editingId === id ? (
                  <>
                    <button
                      className={`${styles.bgGreen500} mr-2`}
                      onClick={() => handleSave(id)}
                    >
                      <Save className="inline-block" />
                    </button>
                    <button
                      className={`${styles.bgRed500}`}
                      onClick={() => setEditingId(null)}
                    >
                      <X className="inline-block" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className={`${styles.bgYellow500} mr-2`}
                      onClick={() => handleEdit(id)}
                    >
                      <Edit className="inline-block" />
                    </button>
                    <button
                      className={`${styles.bgRed500} mr-2`}
                      onClick={() => handleDelete(id)}
                    >
                      <Trash2 className="inline-block" />
                    </button>
                    <button
                      className={`${styles.bgBlue500}`}
                      onClick={() => handleViewDetails(id)}
                    >
                      View
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4">
        <button
          className={`${styles.bgPurple500} mr-2`}
          onClick={handleSyncToGithub}
        >
          Sync to GitHub
        </button>
        <button
          className={`${styles.bgGreen500} mr-2`}
          onClick={() => handleAddToList('recommend')}
        >
          Add to Recommend
        </button>
        <button
          className={`${styles.bgRed500} mr-2`}
          onClick={() => handleAddToList('hot')}
        >
          Add to Hot
        </button>
        <button
          className={`${styles.bgYellow500} mr-2`}
          onClick={() => handleAddToList('latest')}
        >
          Add to Latest
        </button>
        <button
          className={`${styles.bgIndigo500}`}
          onClick={() => handleAddToList('top')}
        >
          Add to Top
        </button>
      </div>
      {detailedResource && (
        <div className="mt-4 p-4 border rounded">
          <h2 className="text-xl font-bold mb-2">Resource Details</h2>
          <pre>{JSON.stringify(detailedResource, null, 2)}</pre>
          <button
            className={`${styles.bgGray500} mt-2`}
            onClick={() => setDetailedResource(null)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default ResourceTable;