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

  return (
    <div className={styles.container}>
      <div className={styles.upperBar}>
        <div className={styles.sideSection}></div>
        <div className={styles.topSection}>마이페이지</div>
        <div className={styles.sideSection}></div>
      </div>
      <div className={styles.content}>
        <button className={styles.button} style={{ marginTop: '20px' }}>
          <div className={styles.buttonLeft}>내 계정</div>
          <div className={styles.buttonRight}>
            {meData != null
              ? `${meData.nickname.nickname}#${meData.nickname.tag} `
              : 'Error'}
            &nbsp; {'〉'}
          </div>
        </button>
        <div className={styles.subtitle}></div>
        <button className={styles.button}>
          <div className={styles.buttonLeft}>화면 모드</div>
          <div className={styles.buttonRight}>자동 &nbsp; {'〉'}</div>
        </button>
        <button className={styles.button}>
          <div className={styles.buttonLeft}>시간표 설정</div>
          <div className={styles.buttonRight}>&nbsp; {'〉'}</div>
        </button>
        <button className={styles.button}>
          <div className={styles.buttonLeft}>시간표 테마</div>
          <div className={styles.buttonRight}>&nbsp; {'〉'}</div>
        </button>

        <div className={styles.subtitle}></div>
        <button className={styles.button}>
          <div className={styles.buttonLeft}>빈자리 알림</div>
          <div className={styles.buttonRight}>&nbsp; {'〉'}</div>
        </button>

        <div className={styles.subtitle}></div>
        <button className={styles.button}>
          <div className={styles.buttonLeft}>버전 정보</div>
          <div className={styles.buttonRight}>3.8.2 &nbsp;</div>
        </button>
        <button className={styles.button}>
          <div className={styles.buttonLeft}>개발자 정보</div>
          <div className={styles.buttonRight}>&nbsp; {'〉'}</div>
        </button>

        <div className={styles.subtitle}></div>
        <button className={styles.button}>
          <div className={styles.buttonLeft}>개발자 괴롭히기</div>
          <div className={styles.buttonRight}>&nbsp; {'〉'}</div>
        </button>

        <div className={styles.subtitle}></div>
        <button className={styles.button}>
          <div className={styles.buttonLeft}>오픈소스 라이선스</div>
          <div className={styles.buttonRight}>&nbsp; {'〉'}</div>
        </button>
        <button className={styles.button}>
          <div className={styles.buttonLeft}>서비스 약관</div>
          <div className={styles.buttonRight}>&nbsp; {'〉'}</div>
        </button>
        <button className={styles.button}>
          <div className={styles.buttonLeft}>개인정보처리방침</div>
          <div className={styles.buttonRight}>&nbsp; {'〉'}</div>
        </button>

        <div className={styles.subtitle}></div>
        <button className={styles.button} onClick={onLogout}>
          <div
            className={styles.buttonLeft}
            style={{ color: 'red', fontWeight: 'bold' }}
          >
            로그아웃
          </div>
          <div className={styles.buttonRight}>&nbsp; {'〉'}</div>
        </button>
        <div className={styles.subtitle}></div>
      </div>
    </div>
  );
};

export default MyPage;
