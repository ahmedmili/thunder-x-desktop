import { ReactNode } from "react";
import styles from "./cardpagetextcontent.module.scss";
const CardPageTextContent = ({ children }: { children: ReactNode }) => (
  <div className={styles.content}> {children} </div>
);
export default CardPageTextContent;
