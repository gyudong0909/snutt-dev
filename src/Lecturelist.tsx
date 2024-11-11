import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LectureListProps {
  token: string | undefined;
}

const LectureList = ({ token }: LectureListProps) => {
  const [savedToken, setSavedToken] = useState<string | undefined>(() => {
    // 초기 상태를 localStorage에서 가져옴
    return token ?? localStorage.getItem('token') ?? undefined;
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (token != null) {
      // 전달된 token이 있으면 localStorage에 저장하고 상태 업데이트
      localStorage.setItem('token', token);
      setSavedToken(token);
    }
  }, [token, savedToken, navigate]);

  return (
    <div>
      <h1>강의 목록 페이지 {savedToken}</h1>
      {/* 여기에 강의 목록을 표시하는 로직을 추가하세요 */}
    </div>
  );
};

export default LectureList;
