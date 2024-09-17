import React, { useEffect, useRef, useState } from 'react';
import styles from './Test.module.css';

function Test() {
    const [isSticky, setIsSticky] = useState(false);
    const headerRef = useRef(null); // 获取header的引用

    useEffect(() => {
        const handleScroll = () => { // 监听滚动事件
            if (headerRef.current) {
                const headerBottom = headerRef.current.getBoundingClientRect().bottom; // 获取header的底部位置
                setIsSticky(headerBottom <= 100); // 当headerBottom小于100时，设置isSticky为true
            }
        };

        window.addEventListener('scroll', handleScroll); // 监听滚动事件
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div
            ref={headerRef}
            className={`${styles.test} ${isSticky ? styles.sticky : ''}`}
        >
            
            { isSticky.toString() }
        </div>
    );
}

export default Test;