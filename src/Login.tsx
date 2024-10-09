import './reset.css';

import styles from './Login.module.css';

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login = ({ onLoginSuccess }: LoginProps) => {
  const handleLogin = () => {
    // 로그인 로직 수행 후 성공 시 호출
    onLoginSuccess();
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
          </div>
          <div className={styles.extra}>아이디 찾기 | 비밀번호 재설정</div>
        </div>
        <button onClick={handleLogin} className={styles.bottom}>
          로그인
        </button>
      </div>
    </div>
  );
};

export default Login;
