import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { Clock, Grid, ExternalLink } from 'lucide-react';

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

const Card = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const CardImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 12px;
`;

const CardTitle = styled.h3`
  margin: 0 0 8px 0;
`;

const CardInfo = styled.p`
  margin: 4px 0;
  font-size: 14px;
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 8px;
`;

const TagItem = styled.span`
  background-color: #f0f0f0;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
`;

const SourceLinks = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

const IconLink = styled.a`
  color: #333;
  text-decoration: none;
`;

function ResourceCard({ resource }) {
  const [details, setDetails] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(`https://raw.githubusercontent.com/mxrain/404zyt/master/src/db/zyt/${resource.id}.json`);
        setDetails(response.data);
      } catch (error) {
        console.error('Error fetching resource details:', error);
      }
    };

    fetchDetails();
  }, [resource.id]);

  if (!details) return <Card>Loading...</Card>;

  return (
    <Card>
      {details.images && details.images.length > 0 && (
        <CardImage src={details.images[0]} alt={details.name} />
      )}
      <CardTitle>{details.name}</CardTitle>
      <CardInfo>{details.introduction.substring(0, 100)}...</CardInfo>
      <CardInfo>
        <Clock size={16} /> Updated: {new Date(resource.updatetime * 1000).toLocaleDateString()}
      </CardInfo>
      <CardInfo>
        <Grid size={16} /> {details.category}
      </CardInfo>
      <TagContainer>
        {Object.values(details.tags).flat().slice(0, 5).map((tag, index) => (
          <TagItem key={index}>{tag}</TagItem>
        ))}
      </TagContainer>
      <SourceLinks>
        {Object.keys(details.source_links).map((source) => (
          <IconLink key={source} href={details.source_links[source]} target="_blank" rel="noopener noreferrer">
            <ExternalLink size={20} />
          </IconLink>
        ))}
      </SourceLinks>
    </Card>
  );
}

function TestResourceCardList() {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [category, setCategory] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axios.get('https://raw.githubusercontent.com/mxrain/404zyt/master/src/db/uuid_resource_curd.json');
        const resourceArray = Object.entries(response.data).map(([id, data]) => ({
          id,
          ...data
        }));
        setResources(resourceArray);
        setFilteredResources(resourceArray);
      } catch (error) {
        console.error('Error fetching resources:', error);
      }
    };

    fetchResources();
  }, []);

  useEffect(() => {
    let filtered = [...resources];

    if (category !== 'all') {
      filtered = filtered.filter(resource => resource.category.startsWith(category));
    }

    if (sortOrder === 'newest') {
      filtered.sort((a, b) => b.updatetime - a.updatetime);
    } else {
      filtered.sort((a, b) => a.updatetime - b.updatetime);
    }

    setFilteredResources(filtered);
  }, [category, sortOrder, resources]);

  const categories = ['all', ...new Set(resources.map(r => r.category.split('>')[0]))];

  return (
    <Container>
      <Controls>
        <Select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
          ))}
        </Select>
        <Select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
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

export default TestResourceCardList;