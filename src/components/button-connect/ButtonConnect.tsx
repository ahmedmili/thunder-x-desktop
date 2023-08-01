import { ReactNode } from "react";
import styles from "./buttonconnect.module.scss";
type ButtonConnectProps = {
  icon: ReactNode;
  text: string;
};
const ButtonConnect = ({ icon, text }: ButtonConnectProps) => {
  return (
    <button className={styles.btn}>
      <div className={styles.btnContent}>
        <div className={styles.icon}>{icon}</div>
        <span className={styles.text}> {text} </span>
      </div>
    </button>
  );
};
export default ButtonConnect;
