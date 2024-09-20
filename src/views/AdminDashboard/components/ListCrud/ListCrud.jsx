import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import styles from './ListCrud.module.css';
import { listConfig } from '../ListCrudCategory/listConfig';

function ListCrud() {
  const categories = Object.keys(listConfig);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>首页表管理</h1>
      <nav className={styles.navigation}>
        {categories.map(category => (
          <Link key={category} to={`/sys/listcrud/${category}`} className={styles.categoryLink}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Link>
        ))}
      </nav>
      <Outlet />
    </div>
  );
}

export default ListCrud;