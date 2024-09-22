import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addTab } from '../../../../features/sysTabs/tabSlice'
import { Home,FilePlus,Users, ShoppingBag, BarChart, Database, ChevronDown, ChevronRight } from 'lucide-react'
import styles from './Sidebar.module.css'

export default function Sidebar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isListCrudOpen, setIsListCrudOpen] = useState(false)

  const handleClick = (path, title) => {
    dispatch(addTab({ path, title }))
  }

  const handleListCrudClick = () => {
    setIsListCrudOpen(!isListCrudOpen)
    navigate('/sys/listcrud')
    dispatch(addTab({ path: '/sys/listcrud', title: '首页列表' }))
  }

  return (
    <nav className={styles.sidebarWrapper}>
      {/* 插入图标 */}

      <h1 className={styles.title}>
        404后台
      </h1>
      <Link to="/sys/addReasourcePage" className={styles.sidebarLink} onClick={() => handleClick('/sys/addReasourcePage', '数据上传')}>
        <FilePlus size={18} />
        数据上传
      </Link>
      <Link to="/sys/dbcrud" className={styles.sidebarLink} onClick={() => handleClick('/sys/dbcrud', '分类')}>
        <Database size={18} />
        分类
      </Link>
      <div className={`${styles.sidebarLink} ${styles.expandableLink}`} onClick={handleListCrudClick}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Database size={18} />
          首页列表
        </div>
        {isListCrudOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
      </div>
      <div className={styles.subLinksContainer} style={{ maxHeight: isListCrudOpen ? '1000px' : '0' }}>
        <Link to="/sys/listcrud/recommend" className={`${styles.sidebarLink} ${styles.subLink}`} onClick={() => handleClick('/sys/listcrud/recommend', '推荐')}>
          推荐
        </Link>
        <Link to="/sys/listcrud/hot" className={`${styles.sidebarLink} ${styles.subLink}`} onClick={() => handleClick('/sys/listcrud/hot', '热门')}>
          热门
        </Link>
        <Link to="/sys/listcrud/latest" className={`${styles.sidebarLink} ${styles.subLink}`} onClick={() => handleClick('/sys/listcrud/latest', '最新')}>
          最新
        </Link>
        <Link to="/sys/listcrud/top" className={`${styles.sidebarLink} ${styles.subLink}`} onClick={() => handleClick('/sys/listcrud/top', '置顶')}>
          置顶
        </Link>
        <Link to="/sys/listcrud/carousel" className={`${styles.sidebarLink} ${styles.subLink}`} onClick={() => handleClick('/sys/listcrud/carousel', '轮播')}>
          轮播
        </Link>
      </div>
      <Link to="/sys/products" className={styles.sidebarLink} onClick={() => handleClick('/sys/products', 'Products')}>
        <ShoppingBag size={18} />
        Products
      </Link>
      <Link to="/sys/analytics" className={styles.sidebarLink} onClick={() => handleClick('/sys/analytics', 'Analytics')}>
        <BarChart size={18} />
        Analytics
      </Link>
      <Link to="/sys/users" className={styles.sidebarLink} onClick={() => handleClick('/sys/users', '用户')}>
        <Users size={18} />
        用户
      </Link>
      <Link to="/" className={styles.goHome} onClick={()=>{handleClick("/","前台首页") }}>
        <Home size={16} />
        前台首页
      </Link>
    </nav>
  )
}