import './reset.css';

import { useEffect, useState } from 'react';

import Home from './Home';
import Login from './Login';

export const App = () => {
  const [isLoginPage, setIsLoginPage] = useState(false);

  useEffect(() => {
    setIsLoginPage(false);
  }, []);

  const handleLoginButton = () => {
    setIsLoginPage(true);
  };

  return isLoginPage ? <Login /> : <Home onLoginButton={handleLoginButton} />;
};
