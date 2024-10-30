import './reset.css';

import { Link, Route, Routes } from 'react-router-dom';

import friendIcon from './icons/friend.png';
import reviewIcon from './icons/review.png';
import searchIcon from './icons/search.png';
import threedotsIcon from './icons/threedots.png';
import timetableIcon from './icons/timetable.png';

const Menu = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ flex: 1 }}>
        <Routes>
          <Route element={<MainPage />} path="/" />
          <Route element={<MyPage />} path="/mypage" />
        </Routes>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '10px',
        }}
      >
        <Link to="/">
          <img src={timetableIcon} alt="timetable" />
        </Link>
        <img src={searchIcon} alt="search" />
        <img src={reviewIcon} alt="review" />
        <img src={friendIcon} alt="friend" />
        <Link to="/mypage">
          <img src={threedotsIcon} alt="threedots" />
        </Link>
      </div>
    </div>
  );
};
const MainPage = () => {
  return (
    <div>
      <h1>메인</h1>
      <Link to="/mypage">메인화면</Link>
    </div>
  );
};
const MyPage = () => {
  return (
    <div>
      <h1>마이페이지</h1>
      <Link to="/">메인화면</Link>
    </div>
  );
};
export default Menu;
