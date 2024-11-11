import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface LectureProps {
  token: string | undefined;
}

const Lecture = ({ token }: LectureProps) => {
  const [savedToken, setSavedToken] = useState<string | undefined>(() => {
    // 초기 상태를 localStorage에서 가져옴
    return token ?? localStorage.getItem('token') ?? undefined;
  });

  const { lectureId } = useParams<{ lectureId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (token != null) {
      // 전달된 token이 있으면 localStorage에 저장하고 상태 업데이트
      localStorage.setItem('token', token);
      setSavedToken(token);
    }
  }, [token]);

  const handleBackToMainPage = () => {
    navigate(-1);
  };

  return (
    <div>
      <button
        onClick={handleBackToMainPage}
        style={{ position: 'absolute', top: '10px', left: '10px' }}
      >
        뒤로가기
      </button>
      <h1>.............강의 상세보기</h1>
      <p>강의 ID: {lectureId}</p>
      <p>Token: {savedToken}</p>
    </div>
  );
};

export default Lecture;
