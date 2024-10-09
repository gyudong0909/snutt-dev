import './reset.css';

import { useState } from 'react';

import Home from './Home';
import Landing from './Landing';
import Login from './Login';

export const App = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'login' | 'landing'>(
    'home',
  );

  const handleLoginButton = () => {
    setCurrentPage('login');
  };

  const handleLoginSuccess = () => {
    setCurrentPage('landing');
  };

  return (
    <>
      {currentPage === 'home' && <Home onLoginButton={handleLoginButton} />}
      {currentPage === 'login' && <Login onLoginSuccess={handleLoginSuccess} />}
      {currentPage === 'landing' && <Landing nickname="박규동#0000" />}
    </>
  );
};

export default App;
