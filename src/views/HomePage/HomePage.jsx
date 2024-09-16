import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="home-page">
      <h1>欢迎来到我们的游戏资源网站</h1>
      <p>在这里，您可以找到各种精彩的游戏资源。</p>
      
      <h2>热门分类</h2>
      <ul>
        <li>
          <Link to="/软件游戏">软件游戏</Link>
        </li>
        <li>
          <Link to="/软件游戏/游戏">游戏</Link>
        </li>
        <li>
          <Link to="/软件游戏/游戏/单机游戏">单机游戏</Link>
        </li>
      </ul>
      
      <h2>最新更新</h2>
      <ul>
        <li>游戏1</li>
        <li>游戏2</li>
        <li>游戏3</li>
      </ul>
      
      <h2>关于我们</h2>
      <p>我们致力于为玩家提供最新、最全面的游戏资源。</p>
    </div>
  );
};

export default HomePage;
