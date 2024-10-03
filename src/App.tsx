import './reset.css';

import styles from './App.module.css';

export const App = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <div>
          <img src="" />
          <h1 className={styles.title}>TimeTable</h1>
        </div>
        <div>
          <div>
            <button className={styles.loginButton}>로그인</button>
            <button className={styles.signUpButton}>회원가입</button>
          </div>
          <div>
            <div>
              <div>
                <hr />
                SNS 계정으로 계속하기
                <hr />
              </div>

              <div>
                <img src="" /> {/* 카톡 구글 페북 애플 아이콘 */}
                <img src="" />
                <img src="" />
                <img src="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
