import './reset.css';

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
  const RequestLogin = () => {
    const idInputElement = document.getElementById(`id`) as HTMLInputElement;
    const pwInputElement = document.getElementById(`pw`) as HTMLInputElement;

    const requestBody: TokenRequest = {
      id: idInputElement.value,
      password: pwInputElement.value,
    };

    let ignore = false;
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
          if (response.status === 403)
            alert(`아이디 또는 비밀번호가 잘못되었습니다.`);
          else alert(`로그인 요청 오류 발생: ${response.status}`);
        }
        return response.json() as Promise<TokenResponse>;
      })
      .then((response) => {
        if (ignore) return;

        fetch(
          `https://wafflestudio-seminar-2024-snutt-redirect.vercel.app/v1/users/me`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'x-access-token': response.token ?? '',
            },
          },
        )
          .then((responseInfo) => {
            if (!responseInfo.ok) {
              alert(`정보 불러오기 중 오류 발생: ${responseInfo.status}`);
              return;
            }
            return responseInfo.json() as Promise<InfoResponse>;
          })
          .then((responseInfo) => {
            if (responseInfo !== undefined) setNickname(responseInfo.nickname);
            onLoginSuccess();
          })
          .catch(() => {
            window.alert();
          });
      })
      .catch(() => {
        window.alert();
      });

    return () => {
      ignore = true;
    };
  };

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
            <div className={styles.extra}>아이디 찾기 | 비밀번호 재설정</div>
          </div>
          <button onClick={RequestLogin}>로그인</button>
        </div>
      </div>
    </div>
  );
};
export default Login;
