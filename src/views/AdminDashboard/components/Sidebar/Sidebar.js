import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addTab } from '../../../../features/sysTabs/tabSlice'
import { Users, ShoppingBag, BarChart } from 'lucide-react'

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

export default function Sidebar() {
  const dispatch = useDispatch()

  const handleClick = (path, title) => {
    dispatch(addTab({ path, title }))
  }

  return (
    <SidebarWrapper>
      <SidebarLink to="/sys/users" onClick={() => handleClick('/sys/users', 'Users')}>
        <Users size={18} />
        Users
      </SidebarLink>
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