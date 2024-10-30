import './reset.css';

import { useState } from 'react';

import Home from './Home';
import Landing from './Landing';
import Login from './Login';
export const App = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'login' | 'landing'>(
    'home',
  );
  const [token, setToken] = useState<string>();
  const handleLoginButton = () => {
    setCurrentPage('login');
  };
  const handleLoginSuccess = () => {
    setCurrentPage('landing');
  };
  return (
    <>
      {currentPage === 'home' && <Home onLoginButton={handleLoginButton} />}
      {currentPage === 'login' && (
        <Login setToken={setToken} onLoginSuccess={handleLoginSuccess} />
      )}
      {currentPage === 'landing' && token !== undefined && (
        <Landing token={token} />
      )}
    </>
  );
};
