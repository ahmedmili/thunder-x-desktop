import { ReactNode } from "react";
import styles from "./cardpage.module.scss";
const CardPage = ({ children }: { children: ReactNode }) => (
  <div className={styles.cardpage}> {children} </div>
);
export default CardPage;
