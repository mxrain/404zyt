import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectGithubInfo, setGithubInfo, fetchUserData } from '../../features/githubApi/githubApiSlice';
import { getAuthCookie } from '../../utils/auth';

const AdminDashboard = () => {
    const { githubApi, githubUsername, repoUrl } = useSelector(selectGithubInfo);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const authData = getAuthCookie();
        if (!authData) {
            navigate('/login');
            return;
        }

        if (!githubApi || !githubUsername || !repoUrl) {
            dispatch(setGithubInfo(authData));
        }

        dispatch(fetchUserData());
    }, [dispatch, navigate, githubApi, githubUsername, repoUrl]);

    return (
        <div>
            <h1>管理面板</h1>
            <p>GitHub API: {githubApi ? '已设置' : '未设置'}</p>
            <p>GitHub 用户名: {githubUsername}</p>
            <p>仓库地址: {repoUrl}</p>
            {/* 其他管理面板内容 */}
        </div>
    );
};

export default AdminDashboard;

