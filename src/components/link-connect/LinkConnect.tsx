import { Link } from "react-router-dom";
import styles from "./linkconnect.module.scss";
const LinkConnect = () => {
  return (
    <div className={styles.linkconnect}>
      <p className={styles.text}>Vous avez déjà un compte</p>
      <Link to="/login" className={styles.link}>
        Se connecter
      </Link>
    </div>
  );
};
export default LinkConnect;
