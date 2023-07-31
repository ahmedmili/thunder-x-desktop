import React, { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./buttontertiary.module.scss";
type ButtonTertiaryProps = {
  children: ReactNode;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  name: string;
  disabled?: boolean;
  style?: any;
};
const ButtonTertiary = ({ children, ...props }: ButtonTertiaryProps) => {
  return (
    <button className={styles.btn} type={props.type} {...props}>
      {children}
    </button>
  );
};
export default ButtonTertiary;
