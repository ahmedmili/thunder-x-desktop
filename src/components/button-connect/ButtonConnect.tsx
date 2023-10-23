import { ReactNode } from "react";
import styles from "./buttonconnect.module.scss";
import { userService } from "../../services/api/user.api";
type ButtonConnectProps = {
  icon?: ReactNode;
  text: string;
  provider: string;
};


const ButtonConnect = ({ icon, text, provider }: ButtonConnectProps) => {

  const firebaseLogin = () => {
    switch (provider) {
      case 'google':
        userService.signInWithGoogle();
        break;
      case 'fcb':
        userService.signInWithFacebook();
        break;
      default:
        userService.firebaseSignOut();
        break;
    }
  }
  return (
    <button className={styles.btn}>
      <div className={styles.btnContent} onClick={firebaseLogin}>
        <div className={styles.icon}>{icon}</div>
        <span className={styles.text}> {text} </span>
      </div>
    </button>
  );
};
export default ButtonConnect;
