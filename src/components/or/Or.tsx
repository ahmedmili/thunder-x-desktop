import { style } from "@mui/system";
import { ReactNode } from "react";
import styles from "./or.module.scss";
const Or = ({ children }: { children: ReactNode }) => {
  return (
    <div className={styles.or}>
      <span className={styles.bar}></span>
      <span>{children}</span>
      <span className={styles.bar}></span>
    </div>
  );
};
export default Or;
