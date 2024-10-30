import './reset.css';

import { useState } from 'react';

import Home from './Home';
import Landing from './Landing';
import Login from './Login';
import Menu from './Menu';
export const App = () => {
  const [currentPage, setCurrentPage] = useState<
    'home' | 'login' | 'menu' | 'landing'
  >('home');
  const [token, setToken] = useState<string>();
  const handleLoginButton = () => {
    setCurrentPage('login');
  };
  const handleLoginSuccess = () => {
    setCurrentPage('menu');
  };
  return (
    <>
      {currentPage === 'home' && <Home onLoginButton={handleLoginButton} />}
      {currentPage === 'login' && (
        <Login setToken={setToken} onLoginSuccess={handleLoginSuccess} />
      )}
      {currentPage === 'menu' && <Menu />}
      {currentPage === 'landing' && token !== undefined && (
        <Landing token={token} />
      )}
    </>
  );
};
