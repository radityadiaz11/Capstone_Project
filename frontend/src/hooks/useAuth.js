import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function useAuth(requiredRoles = []) {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token) {
      navigate('/');
      return;
    }

    if (requiredRoles.length > 0 && !requiredRoles.includes(role)) {
      navigate('/');
      return;
    }
  }, [navigate, requiredRoles]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/', {
      replace: true
    });
  };

  return {
    token: localStorage.getItem('token'),
    role: localStorage.getItem('role'),
    logout
  };
}
