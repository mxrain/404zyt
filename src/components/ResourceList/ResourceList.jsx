import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Book, GameController, FileText, Image, Link as LinkIcon } from 'lucide-react';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px;
`;

const Card = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
`;

const Controls = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 0 20px;
`;

const Select = styled.select`
  padding: 5px 10px;
  border-radius: 4px;
`;

const ResourceList = () => {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await axios.get('https://raw.gitmirror.com/mxrain/404zyt/master/src/db/uuid_resource_curd.json');
      const data = response.data;
      const resourceArray = Object.entries(data).map(([uuid, info]) => ({
        uuid,
        ...info
      }));
      setResources(resourceArray);
      setFilteredResources(resourceArray);

      const uniqueCategories = [...new Set(resourceArray.map(item => item.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
  };

  useEffect(() => {
    let filtered = [...resources];
    if (selectedCategory) {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    filtered.sort((a, b) => {
      return sortOrder === 'desc' 
        ? b.updatetime - a.updatetime 
        : a.updatetime - b.updatetime;
    });
    setFilteredResources(filtered);
  }, [selectedCategory, sortOrder, resources]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const getIcon = (resourceType) => {
    switch(resourceType) {
      case '图书': return <Book />;
      case '软件游戏': return <GameController />;
      case '文档': return <FileText />;
      default: return <Image />;
    }
  };

  return (
    <div>
      <Controls>
        <Select onChange={handleCategoryChange} value={selectedCategory}>
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </Select>
        <Select onChange={handleSortChange} value={sortOrder}>
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </Select>
      </Controls>
      <Grid>
        {filteredResources.map(item => (
          <Card key={item.uuid}>
            <Link to={`/resource/${item.uuid}`}>
              <h3>{item.title}</h3>
              <p>Category: {item.category}</p>
              <p>Updated: {new Date(item.updatetime * 1000).toLocaleDateString()}</p>
              {getIcon(item.category.split('>')[0])}
            </Link>
          </Card>
        ))}
      </Grid>
    </div>
  );
};

const ResourceDetail = ({ match }) => {
  const [resource, setResource] = useState(null);

  useEffect(() => {
    fetchResourceDetail();
  }, []);

  const fetchResourceDetail = async () => {
    try {
      const response = await axios.get(`https://raw.gitmirror.com/mxrain/404zyt/master/src/db/zyt/${match.params.uuid}.json`);
      setResource(response.data);
    } catch (error) {
      console.error('Error fetching resource detail:', error);
    }
  };

  if (!resource) return <div>Loading...</div>;

  return (
    <div>
      <h2>{resource.name}</h2>
      <p>{resource.introduction.substring(0, 100)}...</p>
      <p>Category: {resource.category}</p>
      <div>
        Tags: {Object.values(resource.tags).flat().join(', ')}
      </div>
      <div>
        {resource.images && resource.images.map((img, index) => (
          <img key={index} src={img} alt={resource.name} style={{width: '100px', height: '100px', objectFit: 'cover'}} />
        ))}
      </div>
      <div>
        Source Links:
        {Object.entries(resource.source_links).map(([name, link]) => (
          <a key={name} href={link} target="_blank" rel="noopener noreferrer">
            <LinkIcon /> {name}
          </a>
        ))}
      </div>
    </div>
  );
};

export { ResourceList, ResourceDetail };