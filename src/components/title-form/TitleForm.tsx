import { ReactNode } from "react";
import styles from "./titleform.module.scss";
const TitleForm = ({ children }: { children: ReactNode }) => (
  <h1 className={styles.titleForm}> {children} </h1>
);
export default TitleForm;
