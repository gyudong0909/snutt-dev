import './reset.css';

import styles from './Home.module.css';
import appleIcon from './icons/apple.png';
import facebookIcon from './icons/facebook.png';
import googleIcon from './icons/google.png';
import kakaoIcon from './icons/kakao.png';
import logo from './icons/logo.png';

const Home = ({ onLoginButton }: { onLoginButton: () => void }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <div className={styles.frame205}>
          <img src={logo} alt="Logo" />
          {styles.title}
        </div>
        <div className={styles.frame206}>
          <div className={styles.frame214}>
            <div className={styles.frame201}>
              <button className={styles.loginButton} onClick={onLoginButton}>
                로그인
              </button>
              <button disabled className={styles.signUpButton}>
                회원가입
              </button>
            </div>
            <div className={styles.frame215}>
              <div className={styles.frame204}>
                <div className={styles.frame200}>
                  <hr className={styles.line} />
                  <span className={styles.snsText}>SNS 계정으로 계속하기</span>
                  <hr className={styles.line} />
                </div>

                <div className={styles.frame203}>
                  {/* 
                  나중에 이미지에 onclick 함수 추가
                  hover 구현은 일단 완료해놓음.
                  */}
                  <img
                    src={kakaoIcon}
                    alt="Kakao"
                    className={styles.disabled}
                  />
                  <div className={styles.frame202}>
                    <img
                      src={googleIcon}
                      alt="Google"
                      className={styles.disabled}
                    />
                  </div>
                  <img
                    src={facebookIcon}
                    alt="Facebook"
                    className={styles.disabled}
                  />
                  <img
                    src={appleIcon}
                    alt="Apple"
                    className={styles.disabled}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
