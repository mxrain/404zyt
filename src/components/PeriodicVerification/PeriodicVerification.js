import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuthenticationStatus } from '../../features/auth/authSlice';

const PeriodicVerification = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    // 初始检查
    dispatch(checkAuthenticationStatus());

    let interval;
    if (isAuthenticated) {
      interval = setInterval(() => {
        dispatch(checkAuthenticationStatus());
      }, 3000000); // 每10秒检查一次
    }
    return () => clearInterval(interval);
  }, [dispatch, isAuthenticated]);

  return null;
};

export default PeriodicVerification;
