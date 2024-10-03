import './reset.css';

import styles from './Login.module.css';

const Login = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        {' '}
        {/* 로그인 페이지 */}
        <div>
          <div className={styles.input}>
            <label>아이디</label>
            <input type="text" placeholder="아이디를 입력하세요" />
          </div>
          <div className={styles.input}>
            <label>비밀번호</label>
            <input type="text" placeholder="비밀번호를 입력하세요" />
          </div>
          <div>아이디 찾기 | 비밀번호 재설정</div>
        </div>
        <button>로그인</button>
      </div>
    </div>
  );
};

export default Login;
