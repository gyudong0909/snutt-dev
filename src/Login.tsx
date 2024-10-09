import './reset.css';

import { useCallback } from 'react';

import styles from './Login.module.css';

type TokenRequest = {
  id?: string;
  password?: string;
};

type TokenResponse = {
  user_id?: string;
  token?: string;
  message?: string;
};

type NicknameType = {
  nickname: string;
  tag: string;
};

type InfoResponse = {
  id: string;
  isAdmin: boolean;
  regDate: string;
  notificationCheckedAt: string;
  email: string;
  localId: string;
  fbName: string;
  nickname: { nickname: string; tag: string };
};

interface LoginProps {
  setNickname: (nickname: NicknameType) => void;
  onLoginSuccess: () => void;
}

const Login = ({ setNickname, onLoginSuccess }: LoginProps) => {
  const RequestLogin = useCallback(() => {
    const idInputElement = document.getElementById(`id`) as HTMLInputElement;
    const pwInputElement = document.getElementById(`pw`) as HTMLInputElement;

    const requestBody: TokenRequest = {
      id: idInputElement.value,
      password: pwInputElement.value,
    };

    fetch(
      `https://wafflestudio-seminar-2024-snutt-redirect.vercel.app/v1/auth/login_local`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      },
    )
      .then((response) => {
        if (!response.ok) {
          if (response.status === 403) {
            alert(`아이디 또는 비밀번호가 잘못되었습니다.`);
          } else {
            alert(`로그인 요청 오류 발생: ${response.status}`);
          }
          throw new Error('Login failed');
        }
        return response.json() as Promise<TokenResponse>;
      })
      .then((response) => {
        return fetch(
          `https://wafflestudio-seminar-2024-snutt-redirect.vercel.app/v1/users/me`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'x-access-token': response.token ?? '',
            },
          },
        );
      })
      .then((responseInfo) => {
        if (!responseInfo.ok) {
          alert(`정보 불러오기 중 오류 발생: ${responseInfo.status}`);
          throw new Error('Fetching user info failed');
        }
        return responseInfo.json() as Promise<InfoResponse>;
      })
      .then((responseInfo) => {
        setNickname(responseInfo.nickname);
        onLoginSuccess();
      })
      .catch((error: unknown) => {
        if (error instanceof Error) {
          console.error(error.message);
        } else {
          console.error('알 수 없는 오류가 발생했습니다.');
        }
      });
  }, [setNickname, onLoginSuccess]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        {/* 로그인 페이지 */}
        <div>
          <label className={styles.title}>로그인</label>
          <div className={styles.input}>
            <label>아이디</label>
            <input
              type="text"
              id="id"
              placeholder="아이디를 입력하세요"
              className={styles.box}
            />
          </div>
          <div className={styles.input}>
            <label>비밀번호</label>
            <input
              type="password"
              id="pw"
              placeholder="비밀번호를 입력하세요"
              className={styles.box}
            />
            <div className={styles.extra}> 아이디 찾기 | 비밀번호 재설정</div>
          </div>
          <button onClick={RequestLogin} className={styles.bottom}>
            로그인
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
