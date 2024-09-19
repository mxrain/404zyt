import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { checkAuthenticationStatus, setAuthStatus } from '../../features/auth/authSlice';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      const cookieAuth = Cookies.get('isAuthenticated') === 'true';
      if (cookieAuth) {
        dispatch(setAuthStatus(true));
      } else {
        dispatch(checkAuthenticationStatus());
      }
    }
  }, [dispatch, isAuthenticated]);

  if (!isAuthenticated && !location.pathname.startsWith('/sys')) {
    return children;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;