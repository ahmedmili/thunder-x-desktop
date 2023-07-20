import { ReactNode } from "react";
import styles from "./cardpagetitle.module.scss";
const CardPageTitle = ({ children }: { children: ReactNode }) => (
  <h1 className={styles.title}> {children} </h1>
);
export default CardPageTitle;
