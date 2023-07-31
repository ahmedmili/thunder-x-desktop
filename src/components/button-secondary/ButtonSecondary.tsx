import React, { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./buttonsecondary.module.scss";
type ButtonSecondaryProps = {
  children: ReactNode;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  name: string;
  disabled?: boolean;
};
const ButtonSecondary = ({ children, ...props }: ButtonSecondaryProps) => {
  return (
    <button className={styles.btn} type={props.type} {...props}>
      {children}
    </button>
  );
};
export default ButtonSecondary;
