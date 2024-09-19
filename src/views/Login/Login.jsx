import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setGithubInfo } from '../../features/githubApi/githubApiSlice';
import { setAuthCookie } from '../../utils/auth';
import styles from './Login.module.css';
import axios from 'axios';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    githubApi: '',
    githubUsername: '',
    repoUrl: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.githubApi) newErrors.githubApi = '请输入GitHub API密钥!';
    if (!formData.githubUsername) newErrors.githubUsername = '请输入GitHub用户名!';
    if (!formData.repoUrl) newErrors.repoUrl = '请输入仓库地址!';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateGithubCredentials = async (githubApi, githubUsername, repoUrl) => {
    try {
      // 验证 API 密钥和用户名
      const userResponse = await axios.get(`https://api.github.com/user`, {
        headers: { Authorization: `token ${githubApi}` }
      });
      if (userResponse.data.login !== githubUsername) {
        throw new Error('GitHub API密钥与用户名不匹配');
      }

      // 验证仓库访问权限
      const repoName = repoUrl.split('/').slice(-2).join('/');
      await axios.get(`https://api.github.com/repos/${repoName}`, {
        headers: { Authorization: `token ${githubApi}` }
      });

      return true;
    } catch (error) {
      console.error('GitHub验证失败:', error);
      return false;
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const isValid = await validateGithubCredentials(formData.githubApi, formData.githubUsername, formData.repoUrl);
      if (!isValid) {
        throw new Error('GitHub凭证验证失败');
      }

      dispatch(setGithubInfo(formData));
      setAuthCookie(formData);
      alert('信息已保存!');
      navigate('/admin');
    } catch (error) {
      alert(`保存失败：${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <form className={styles.loginForm} onSubmit={onSubmit}>
        <div>
          <input
            type="text"
            name="githubApi"
            value={formData.githubApi}
            onChange={handleChange}
            placeholder="GitHub API密钥"
          />
          {errors.githubApi && <span className={styles.error}>{errors.githubApi}</span>}
        </div>
        <div>
          <input
            type="text"
            name="githubUsername"
            value={formData.githubUsername}
            onChange={handleChange}
            placeholder="GitHub用户名"
          />
          {errors.githubUsername && <span className={styles.error}>{errors.githubUsername}</span>}
        </div>
        <div>
          <input
            type="text"
            name="repoUrl"
            value={formData.repoUrl}
            onChange={handleChange}
            placeholder="仓库地址"
          />
          {errors.repoUrl && <span className={styles.error}>{errors.repoUrl}</span>}
        </div>
        <button type="submit" className={styles.loginFormButton} disabled={loading}>
          {loading ? '保存中...' : '保存'}
        </button>
      </form>
    </div>
  );
};

export default Login;
