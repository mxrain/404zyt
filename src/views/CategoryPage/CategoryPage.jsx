import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import ItemCardSkeleton from '../../components/ItemCardSkeleton';

const BASE_URL = 'https://raw.githubusercontent.com/mxrain/404zyt/master/src/db/';
const DEFAULT_IMAGE = 'https://picsum.photos/200/300';

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [categoryData, setCategoryData] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}${encodeURIComponent(categoryName)}.json`);
        const data = await response.json();
        setCategoryData(data);
      } catch (error) {
        console.error('获取分类数据时出错:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [categoryName]);

  const sortedData = React.useMemo(() => {
    if (!categoryData) return [];
    return [...categoryData].sort((a, b) => {
      const dateA = new Date(a.update_time);
      const dateB = new Date(b.update_time);
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });
  }, [categoryData, sortOrder]);

  return (
    <Container>
      <h1>{categoryName}</h1>
      <SortButton onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}>
        {sortOrder === 'desc' ? '最新排序' : '最早排序'}
      </SortButton>
      <ItemList>
        {loading ? (
          // 加载占位框架
          Array.from({ length: 6 }).map((_, index) => (
            <ItemCardSkeleton key={index} />
          ))
        ) : (
          sortedData.map((item, index) => (
            <ItemCard key={index} item={item} index={index} />
          ))
        )}
      </ItemList>
    </Container>
  );
};

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const SortButton = styled.button`
  margin-bottom: 20px;
  padding: 10px 20px;
  background-color: #1f6a99;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #15527a;
  }
`;

const ItemList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const ItemCard = ({ item, index }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState(item.images && item.images.length > 0 ? item.images[0] : DEFAULT_IMAGE);

  const handleImageError = () => {
    setImageSrc(DEFAULT_IMAGE + `?${index}`);
  };

  return (
    <ItemCardWrapper>
      <ItemImage 
        src={imageSrc} 
        alt={item.name} 
        onLoad={() => setImageLoaded(true)}
        onError={handleImageError}
        style={{ display: imageLoaded ? 'block' : 'none' }}
      />
      {!imageLoaded && <ImagePlaceholder />}
      <ItemContent>
        <ItemTitle>{item.name}</ItemTitle>
        <ItemInfo><InfoLabel>更新时间:</InfoLabel> {new Date(item.update_time).toLocaleString()}</ItemInfo>
        <ItemInfo><InfoLabel>资源信息:</InfoLabel> {item.resource_information.slice(0, 10)}...</ItemInfo>
        <ItemInfo><InfoLabel>所属分类:</InfoLabel> {`${item.category.main} > ${item.category.sub.main} > ${item.category.sub.sub}`}</ItemInfo>
      </ItemContent>
    </ItemCardWrapper>
  );
};

const ItemCardWrapper = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  height: 200px;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 14px;
`;

const ItemImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const ItemContent = styled.div`
  padding: 15px;
  background-color: #f9f9f9;
`;

const ItemTitle = styled.h2`
  margin: 0 0 10px 0;
  font-size: 1.2em;
  color: #1f6a99;
`;

const ItemInfo = styled.p`
  margin: 5px 0;
  font-size: 0.9em;
  color: #666;
`;

const InfoLabel = styled.span`
  font-weight: bold;
  color: #333;
`;

export default CategoryPage;
