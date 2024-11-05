import './reset.css';

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

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
  const [meData, setMeData] = useState<MeResponse>();
  const [name, setName] = useState<string>('');
  useEffect(() => {
    const fetchMeRequest = async () => {
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
      return response;
    };
    const requestMe = async () => {
      const meResponse = await fetchMeRequest();
      if (!meResponse.ok) {
        alert('meRequest fetch 오류 발생');
      }
      const data = (await meResponse.json()) as MeResponse;
      setMeData(data);
    };
    requestMe().catch((e: unknown) => {
      alert(e);
    });
    if (meData !== undefined)
      setName(`${meData.nickname.nickname}#${meData.nickname.tag}`);
  }, [token, setName, meData]);

  return (
    <div className={styles.wrapper}>
      <h1>마이페이지</h1>
      <h2 className={styles.body}>{name}</h2>
      <Link to="/">메인화면으로 이동</Link>
      <button className={styles.button} onClick={onLogout}>
        로그아웃
      </button>
    </div>
  );
};

export default MyPage;
