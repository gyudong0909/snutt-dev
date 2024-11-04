import { Link } from 'react-router-dom';

const MyPage = () => {
  return (
    <div>
      <h1>마이페이지</h1>
      <Link to="/">메인화면으로 이동</Link>
    </div>
  );
};

export default MyPage;
