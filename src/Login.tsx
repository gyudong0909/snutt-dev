import './reset.css';

import { useState } from 'react';

import styles from './Login.module.css';

type TokenRequest = {
  id: string;
  password: string;
};

type TokenResponse = {
  user_id: string;
  token: string;
  message: string;
};

interface LoginProps {
  setToken: (token: string) => void;
  onLoginSuccess: () => void;
  onBackToHome: () => void;
}

const Login = ({ setToken, onLoginSuccess, onBackToHome }: LoginProps) => {
  const [idInput, setIdInput] = useState('');
  const [pwInput, setPwInput] = useState('');

  const onChangeId = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIdInput(e.target.value);
  };
  const onChangePw = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPwInput(e.target.value);
  };

  const fetchLoginRequest = async (id: string, password: string) => {
    const requestBody: TokenRequest = {
      id: id,
      password: password,
    };

    const response = await fetch(
      `https://wafflestudio-seminar-2024-snutt-redirect.vercel.app/v1/auth/login_local`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      },
    );
    return response;
  };
  const requestLogin = async () => {
    const loginResponse = await fetchLoginRequest(idInput, pwInput);
    if (loginResponse.type === 'error') {
      alert('LoginRequest fetch 오류 발생');
      return;
    }
    const data = (await loginResponse.json()) as TokenResponse;
    setToken(data.token);
    onLoginSuccess();
    return;
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        {/* 로그인 페이지 */}
        <div>
          <button onClick={onBackToHome} className={styles.backbutton}>
            뒤로가기
          </button>
          <label className={styles.title}>로그인</label>
          <div className={styles.input}>
            <label>아이디</label>
            <input
              type="text"
              onChange={onChangeId}
              placeholder="아이디를 입력하세요"
              className={styles.box}
            />
          </div>
          <div className={styles.input}>
            <label>비밀번호</label>
            <input
              type="password"
              onChange={onChangePw}
              placeholder="비밀번호를 입력하세요"
              className={styles.box}
            />
            <div className={styles.extra}> 아이디 찾기 | 비밀번호 재설정</div>
          </div>
          <button
            onClick={() => {
              requestLogin().catch((e: unknown) => {
                alert(e);
              });
            }}
            className={styles.bottom}
          >
            로그인
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
