import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

const ItemCard = () => {
    const { item } = useParams();
  return (
    <Card>
      <Title>{item.title}</Title>
      <Description>{item.introduction}</Description>
    </Card>
  );
};

const Card = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 16px;
`;

const Title = styled.h3`
  margin: 0 0 8px 0;
`;

const Description = styled.p`
  margin: 0;
`;

export default ItemCard;
