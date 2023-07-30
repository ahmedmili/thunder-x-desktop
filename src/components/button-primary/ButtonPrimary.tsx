import React, { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./buttonprimary.module.scss";
type ButtonPrimaryProps = {
  children: ReactNode;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  name: string;
  disabled?: boolean;
};
const ButtonPrimary = ({ children, ...props }: ButtonPrimaryProps) => {
  return (
    <button {...props} className={styles.btn} type={props.type}>
      {children}
    </button>
  );
};
export default ButtonPrimary;
