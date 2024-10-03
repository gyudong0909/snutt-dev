import './reset.css';

import { useEffect, useState } from 'react';

import Home from './Home.tsx';
import Login from './Login.tsx';

export const App = () => {
  const [isLoginPage, setIsLoginPage] = useState(false);

  useEffect(() => {
    setIsLoginPage(true);
  }, []);
  return isLoginPage ? <Login /> : <Home />;
};
