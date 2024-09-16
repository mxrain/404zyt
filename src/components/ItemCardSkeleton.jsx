import React from 'react';
import styled from 'styled-components';

const SkeletonCard = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background: #f0f0f0;
  animation: pulse 1.5s infinite;

  @keyframes pulse {
    0% {
      opacity: 0.6;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0.6;
    }
  }
`;

const SkeletonImage = styled.div`
  width: 100%;
  height: 200px;
  background: #e0e0e0;
`;

const SkeletonContent = styled.div`
  padding: 15px;
`;

const SkeletonTitle = styled.div`
  height: 24px;
  width: 80%;
  background: #e0e0e0;
  margin-bottom: 10px;
`;

const SkeletonInfo = styled.div`
  height: 16px;
  width: 60%;
  background: #e0e0e0;
  margin: 5px 0;
`;

const ItemCardSkeleton = () => (
  <SkeletonCard>
    <SkeletonImage />
    <SkeletonContent>
      <SkeletonTitle />
      <SkeletonInfo />
      <SkeletonInfo />
      <SkeletonInfo />
    </SkeletonContent>
  </SkeletonCard>
);

export default ItemCardSkeleton;