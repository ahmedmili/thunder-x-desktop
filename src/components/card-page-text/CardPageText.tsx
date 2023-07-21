import { ReactNode } from "react";
import styles from "./cardpagetext.module.scss";
const CardPageText = ({ children }: { children: ReactNode }) => (
  <div className={styles.content}> {children} </div>
);
export default CardPageText;
