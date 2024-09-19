import React from 'react'
import styled from 'styled-components'
import { Link, useLocation } from 'react-router-dom'

const BreadcrumbWrapper = styled.div`
  margin-bottom: 20px;
`

const BreadcrumbLink = styled(Link)`
  color: #007bff;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

export default function Breadcrumb() {
  const location = useLocation()
  const pathnames = location.pathname.split('/').filter((x) => x)

  return (
    <BreadcrumbWrapper>
      <BreadcrumbLink to="/">Home</BreadcrumbLink>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`
        const isLast = index === pathnames.length - 1
        return isLast ? (
          <span key={name}> / {name}</span>
        ) : (
          <span key={name}>
            {' '}
            / <BreadcrumbLink to={routeTo}>{name}</BreadcrumbLink>
          </span>
        )
      })}
    </BreadcrumbWrapper>
  )
}