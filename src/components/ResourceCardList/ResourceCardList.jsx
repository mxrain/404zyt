import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ResourceCard from './ResourceCard/ResourceCard';
import styles from './ResourceCardList.module.css';

function ResourceCardList() {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [category, setCategory] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [categories, setCategories] = useState(['all']);

  const fetchResources = useCallback(async () => {
    try {
      const response = await axios.get('https://raw.gitmirror.com/mxrain/404zyt/master/src/db/uuid_resource_curd.json');
      const resourceArray = Object.entries(response.data).map(([id, data]) => ({
        id,
        ...data
      }));
      setResources(resourceArray);
      setFilteredResources(resourceArray);
      

      const uniqueCategories = ['all', ...new Set(resourceArray.map(r => r.category.split('>')[0]))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
  }, []);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  useEffect(() => {
    let filtered = [...resources];

    if (category !== 'all') {
      filtered = filtered.filter(resource => resource.category.startsWith(category));
    }

    filtered.sort((a, b) => {
      if (sortOrder === 'newest') {
        return b.updatetime - a.updatetime;
      } else {
        return a.updatetime - b.updatetime;
      }
    });

    setFilteredResources(filtered);
  }, [category, sortOrder, resources]);

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <select className={styles.select} value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat === 'all' ? '所有分类' : cat}</option>
          ))}
        </select>
        <select className={styles.select} value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="newest">最新优先</option>
          <option value="oldest">最早优先</option>
        </select>
      </div>
      <div className={styles.cardGrid}>
        {filteredResources.map((resource) => (
          <ResourceCard key={resource.id} resource={{...resource, id: resource.id || resource.uuid}} />
        ))}
      </div>
    </div>
  );
}

export default ResourceCardList;