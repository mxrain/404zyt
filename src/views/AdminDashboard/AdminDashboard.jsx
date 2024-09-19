import React from 'react';
import { useSelector } from 'react-redux';
import { selectGithubInfo } from '../../features/githubApi/githubApiSlice';

const AdminDashboard = () => {
    const { githubApi, githubUsername, repoUrl } = useSelector(selectGithubInfo);

    return (
        <div>
            <h1>管理面板</h1>
            <p>GitHub API: {githubApi}</p>
            <p>GitHub 用户名: {githubUsername}</p>
            <p>仓库地址: {repoUrl}</p>
            {/* 其他管理面板内容 */}
        </div>
    );
};

export default AdminDashboard;

