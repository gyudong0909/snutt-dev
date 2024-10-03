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
        <button className={styles.loginButton}>로그인</button>
      </div>
    </div>
  );
};
