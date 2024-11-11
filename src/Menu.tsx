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
import Lecture from './Lecture';
import Lecturelist from './Lecturelist';
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

  //timetables 로 시작하는 경우 하단 네비게이션 바 없게
  if (activePath.startsWith('/timetables/')) {
    return (
      <Routes>
        <Route
          element={<Lecture token={token} />}
          path="/timetables/:id/lectures/:lectureId"
        />
        <Route
          element={<Lecturelist token={token} />}
          path="/timetables/:id/lectures"
        />
      </Routes>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <div style={{ flex: 1, overflowY: 'auto' }}>
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
          marginBottom: '15px',
          marginTop: '15px',
        }}
      >
        <Link to="/">
          <img
            src={activePath === '/' ? timetableIconActive : timetableIcon}
            alt="timetable"
            style={{
              width: '23px',
              height: '23px',
            }}
          />
        </Link>
        <img
          src={searchIcon}
          alt="search"
          style={{
            width: '30px',
            height: '30px',
          }}
        />
        <img
          src={reviewIcon}
          alt="review"
          style={{
            width: '30px',
            height: '30px',
          }}
        />
        <img
          src={friendIcon}
          alt="friend"
          style={{
            width: '30px',
            height: '30px',
          }}
        />
        <Link to="/mypage">
          <img
            src={activePath === '/mypage' ? threedotsIconActive : threedotsIcon}
            alt="threedots"
            style={{
              width: '30px',
              height: '30px',
            }}
          />
        </Link>
      </div>
    </div>
  );
};

export default Menu;
