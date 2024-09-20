import React, { useState } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addTab } from '../../../../features/sysTabs/tabSlice'
import { Users, ShoppingBag, BarChart, Database, ChevronDown, ChevronRight } from 'lucide-react'

const SidebarWrapper = styled.nav`
  width: 200px;
  background-color: #333;
  color: white;
  padding: 20px;
`

const SidebarLink = styled(Link)`
  display: flex;
  align-items: center;
  color: white;
  text-decoration: none;
  padding: 10px;
  margin-bottom: 10px;

  &:hover {
    background-color: #444;
  }

  svg {
    margin-right: 10px;
  }
`

const ExpandableLink = styled(SidebarLink)`
  justify-content: space-between;
`

const SubLinksContainer = styled.div`
  overflow: hidden;
  max-height: ${props => (props.isOpen ? '1000px' : '0')};
  transition: max-height 0.3s ease-in-out;
`

const SubLink = styled(SidebarLink)`
  padding-left: 30px;
  font-size: 0.9em;
`

export default function Sidebar() {
  const dispatch = useDispatch()
  const [isListCrudOpen, setIsListCrudOpen] = useState(false)

  const handleClick = (path, title) => {
    dispatch(addTab({ path, title }))
  }

  return (
    <SidebarWrapper>
      <h1 style={{ fontSize: '40px', marginBottom: '20px', paddingLeft: '10px' }}>管理面板</h1>
      <SidebarLink to="/sys/users" onClick={() => handleClick('/sys/users', '用户')}>
        <Users size={18} />
        用户
      </SidebarLink>
      <SidebarLink to="/sys/dbcrud" onClick={() => handleClick('/sys/dbcrud', '分类')}>
        <Database size={18} />
        分类
      </SidebarLink>
      <ExpandableLink as="div" onClick={() => setIsListCrudOpen(!isListCrudOpen)}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Database size={18} />
          首页4大列表
        </div>
        {isListCrudOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
      </ExpandableLink>
      <SubLinksContainer isOpen={isListCrudOpen}>
        <SubLink to="/sys/listcrud/recommend" onClick={() => handleClick('/sys/listcrud/recommend', '推荐')}>
          推荐
        </SubLink>
        <SubLink to="/sys/listcrud/hot" onClick={() => handleClick('/sys/listcrud/hot', '热门')}>
          热门
        </SubLink>
        <SubLink to="/sys/listcrud/latest" onClick={() => handleClick('/sys/listcrud/latest', '最新')}>
          最新
        </SubLink>
        <SubLink to="/sys/listcrud/top" onClick={() => handleClick('/sys/listcrud/top', '置顶')}>
          置顶
        </SubLink>
        <SubLink to="/sys/listcrud/carousel" onClick={() => handleClick('/sys/listcrud/carousel', '轮播')}>
          轮播
        </SubLink>
      </SubLinksContainer>
      <SidebarLink to="/sys/products" onClick={() => handleClick('/sys/products', 'Products')}>
        <ShoppingBag size={18} />
        Products
      </SidebarLink>
      <SidebarLink to="/sys/analytics" onClick={() => handleClick('/sys/analytics', 'Analytics')}>
        <BarChart size={18} />
        Analytics
      </SidebarLink>
    </SidebarWrapper>
  )
}