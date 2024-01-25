import React, { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./buttonprimary.module.scss";
type ButtonPrimaryProps = {
  children: ReactNode;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  name: string;
  disabled?: boolean;
  style?: any;
};
const ButtonPrimary = ({ children, ...props }: ButtonPrimaryProps) => {
  return (
    <button className={styles.btn} type={props.type} {...props}>
      {children}
    </button>
  );
};
export default ButtonPrimary;
