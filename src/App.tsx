import './reset.css';

import { useState } from 'react';

import Home from './Home';
import Landing from './Landing';
import Login from './Login';
export const App = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'login' | 'landing'>(
    'home',
  );
  const [nickname, setNickname] = useState<{
    nickname: string;
    tag: string;
  }>();
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
        <Login setNickname={setNickname} onLoginSuccess={handleLoginSuccess} />
      )}
      {currentPage === 'landing' && nickname !== undefined && (
        <Landing nickname={`${nickname.nickname}#${nickname.tag}`} />
      )}
    </>
  );
};
