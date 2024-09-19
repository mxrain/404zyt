import React from 'react'
import styled from 'styled-components'
import { Link, useLocation } from 'react-router-dom'
import styles from './Breadcrumb.module.css'

const BreadcrumbLink = styled(Link)`
  color: #007bff;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

export default function Breadcrumb() {
  const location = useLocation()
  const pathnames = location.pathname.split('/').filter((x) => x && x !== 'sys')

  // 如果路径是 "/sys"，则不显示面包屑
  if (location.pathname === '/sys') {
    return <div className={styles.breadcrumbWrapper}></div>
  }

  return (
    <div className={styles.breadcrumbWrapper}>
      <BreadcrumbLink to="/sys">首页</BreadcrumbLink>
      {pathnames.map((name, index) => {
        const routeTo = `/sys/${pathnames.slice(0, index + 1).join('/')}`
        const isLast = index === pathnames.length - 1
        return isLast ? (
          <span key={name} className={styles.breadcrumbItem}> / {name}</span>
        ) : (
          <span key={name} className={styles.breadcrumbItem}>
            {' '}
            / <BreadcrumbLink to={routeTo}>{name}</BreadcrumbLink>
          </span>
        )
      })}
    </div>
  )
}