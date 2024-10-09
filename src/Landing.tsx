import './reset.css';

import styles from './Landing.module.css';

interface LandingProps {
  nickname: string;
}

const Landing = ({ nickname }: LandingProps) => {
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.body}>{nickname}</h1>
    </div>
  );
};

export default Landing;
