import { Link } from 'react-router-dom';

const MainPage = () => {
  return (
    <div>
      <h1>메인페이지</h1>
      <Link to="/mypage">마이페이지로 이동</Link>
    </div>
  );
};

export default MainPage;
