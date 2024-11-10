import './reset.css';

import { useEffect, useState } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';

import friendIcon from './icons/friend.png';
import reviewIcon from './icons/review.png';
import searchIcon from './icons/search.png';
import threedotsIcon from './icons/threedots.png';
import threedotsIconActive from './icons/threedots_active.png';
import timetableIcon from './icons/timetable.png';
import timetableIconActive from './icons/timetable_active.png';
import MainPage from './Mainpage';
import MyPage from './Mypage';

interface MenuProps {
  token: string;
  onLogout: () => void;
}

const Menu = ({ token, onLogout }: MenuProps) => {
  const location = useLocation();
  const [activePath, setActivePath] = useState(location.pathname);

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <div style={{ flex: 1, overflowY: 'hidden' }}>
        <Routes>
          <Route element={<MainPage token={token} />} path="/" />
          <Route
            element={<MyPage token={token} onLogout={onLogout} />}
            path="/mypage"
          />
        </Routes>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginLeft: '30px',
          marginRight: '30px',
          marginBottom: '10px',
          marginTop: '10px',
        }}
      >
        <Link to="/">
          <img
            src={activePath === '/' ? timetableIconActive : timetableIcon}
            alt="timetable"
            style={{
              width: '30px',
              height: '30px',
              border: '2px dashed #808080',
            }}
          />
        </Link>
        <img
          src={searchIcon}
          alt="search"
          style={{
            width: '30px',
            height: '30px',
            border: '2px dashed #808080',
          }}
        />
        <img
          src={reviewIcon}
          alt="review"
          style={{
            width: '30px',
            height: '30px',
            border: '2px dashed #808080',
          }}
        />
        <img
          src={friendIcon}
          alt="friend"
          style={{
            width: '30px',
            height: '30px',
            border: '2px dashed #808080',
          }}
        />
        <Link to="/mypage">
          <img
            src={activePath === '/mypage' ? threedotsIconActive : threedotsIcon}
            alt="threedots"
            style={{
              width: '30px',
              height: '30px',
              border: '2px dashed #808080',
            }}
          />
        </Link>
      </div>
    </div>
  );
};

export default Menu;
