import './reset.css';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './Mypage.module.css';

interface MyPageProps {
  token: string;
  onLogout: () => void;
}

type MeResponse = {
  id: string;
  isAdmin: boolean;
  regDate: string;
  notificationCheckedAt: string;
  email: string;
  localId: string;
  fbName: string;
  nickname: { nickname: string; tag: string };
};

const MyPage = ({ token, onLogout }: MyPageProps) => {
  const [meData, setMeData] = useState<MeResponse | null>(null);
  const [name, setName] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    if (token.length === 0) {
      navigate('/login');
      return;
    }

    const fetchMeData = async (retryCount = 3) => {
      while (retryCount > 0) {
        try {
          const response = await fetch(
            `https://wafflestudio-seminar-2024-snutt-redirect.vercel.app/v1/users/me`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'x-access-token': token,
              },
            },
          );

          if (!response.ok) {
            throw new Error('사용자 정보를 가져오는 데 실패했습니다.');
          }

          const data = (await response.json()) as MeResponse;
          setMeData(data);
          return;
        } catch (error) {
          retryCount -= 1;

          if (retryCount === 0) {
            console.error(error);
            alert(
              '사용자 정보를 가져오는 도중 오류가 발생했습니다. 나중에 다시 시도해주세요.',
            );
          }
        }
      }
    };

    void fetchMeData();
  }, [token, navigate]);

  useEffect(() => {
    if (meData != null) {
      setName(`${meData.nickname.nickname}#${meData.nickname.tag}`);
    }
  }, [meData]);

  return (
    <div className={styles.wrapper}>
      <h1>마이페이지</h1>
      <h2 className={styles.body}>{name}</h2>
      <button className={styles.button} onClick={onLogout}>
        로그아웃
      </button>
    </div>
  );
};

export default MyPage;
