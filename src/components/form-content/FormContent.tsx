import { ReactNode } from "react";
import styles from "./formContent.module.scss";
const FormContent = ({ children }: { children: ReactNode }) => (
  <div className={styles.formContent}> {children} </div>
);
export default FormContent;
