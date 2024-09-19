import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { verifyGithubAccess, checkAuthenticationStatus } from '../../features/auth/authSlice';
import Cookies from 'js-cookie';
import styles from './Login.module.css';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, githubApi: storeGithubApi, owner: storeOwner, repo: storeRepo } = useSelector((state) => state.auth);

  const [githubApi, setGithubApi] = useState('');
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    // 从 Redux store 或 cookie 中读取值
    setGithubApi(storeGithubApi || Cookies.get('githubApi') || '');
    setOwner(storeOwner || Cookies.get('owner') || '');
    setRepo(storeRepo || Cookies.get('repo') || '');

    dispatch(checkAuthenticationStatus());
  }, [dispatch, storeGithubApi, storeOwner, storeRepo]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/sys');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await dispatch(verifyGithubAccess({ githubApi, owner, repo })).unwrap();
      navigate('/sys');
    } catch (err) {
      setError('验证失败，请检查您的输入');
    }
  };

  if (isAuthenticated) {
    return <div className={styles.loginContainer}>已登录，正在跳转...</div>;
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <h1 className={styles.loginTitle}>登录</h1>
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.inputGroup}>
            <label htmlFor="githubApi">GitHub API Token</label>
            <input
              id="githubApi"
              type="text"
              value={githubApi}
              onChange={(e) => setGithubApi(e.target.value)}
              placeholder="输入您的 GitHub API Token"
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="owner">仓库所有者</label>
            <input
              id="owner"
              type="text"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              placeholder="输入仓库所有者名称"
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="repo">仓库名称</label>
            <input
              id="repo"
              type="text"
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              placeholder="输入仓库名称"
              required
            />
          </div>
          <button type="submit" className={styles.loginButton}>登录</button>
        </form>
        {error && <p className={styles.errorMessage}>{error}</p>}
      </div>
    </div>
  );
};

export default Login;
