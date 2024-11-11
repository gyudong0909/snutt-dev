import './reset.css';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Home from './Home';
import Landing from './Landing';
import Login from './Login';
import Menu from './Menu';
type PageName = 'home' | 'login' | 'menu' | 'landing';

export const App = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<PageName>(() => {
    const savedPage = localStorage.getItem('currentPage');
    return savedPage != null ? (savedPage as PageName) : 'home';
  });

  const [token, setToken] = useState<string>();

  const handleLoginButton = () => {
    setCurrentPage('login');
  };
  const handleLoginSuccess = () => {
    setCurrentPage('menu');
  };
  const handleLogout = () => {
    setToken(undefined);
    localStorage.removeItem('token');
    setCurrentPage('login');
    localStorage.removeItem('currentPage');
    navigate('/');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
  };

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken !== null) {
      setToken(savedToken);
      setCurrentPage('menu');
    }
  }, []);

  useEffect(() => {
    if (token != null) {
      localStorage.setItem('token', token);
    }
  }, [token]);

  useEffect(() => {
    localStorage.setItem('currentPage', currentPage);
  }, [currentPage]);

  return (
    <>
      {currentPage === 'home' && <Home onLoginButton={handleLoginButton} />}
      {currentPage === 'login' && (
        <Login
          setToken={setToken}
          onLoginSuccess={handleLoginSuccess}
          onBackToHome={handleBackToHome}
        />
      )}
      {currentPage === 'menu' && token !== undefined && (
        <Menu token={token} onLogout={handleLogout} />
      )}
      {currentPage === 'landing' && token !== undefined && (
        <Landing token={token} />
      )}
    </>
  );
};
