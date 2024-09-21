import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import ResourceCard from './ResourceCard/ResourceCard';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Controls = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const Select = styled.select`
  padding: 8px;
  border-radius: 4px;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;

function ResourceCardList() {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [category, setCategory] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [categories, setCategories] = useState(['all']);

  const fetchResources = useCallback(async () => {
    try {
      const response = await axios.get('https://raw.githubusercontent.com/mxrain/404zyt/master/src/db/uuid_resource_curd.json');
      const resourceArray = Object.entries(response.data).map(([id, data]) => ({
        id,
        ...data
      }));
      setResources(resourceArray);
      setFilteredResources(resourceArray);
      
      // 提取所有唯一的顶级分类
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
    <Container>
      <Controls>
        <Select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat === 'all' ? '所有分类' : cat}</option>
          ))}
        </Select>
        <Select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="newest">最新优先</option>
          <option value="oldest">最早优先</option>
        </Select>
      </Controls>
      <CardGrid>
        {filteredResources.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </CardGrid>
    </Container>
  );
}

export default ResourceCardList;