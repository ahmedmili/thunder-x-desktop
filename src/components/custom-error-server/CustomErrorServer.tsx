import { ReactNode } from "react";
import styles from "./customerrorserver.module.scss";
type CustomErrorServerProps = {
  icon: ReactNode;
  message: string;
};
const CustomErrorServer = ({ icon, message }: CustomErrorServerProps) => {
  return (
    <div className={styles.error}>
      {icon}
      <span> {message} </span>
    </div>
  );
};
export default CustomErrorServer;
