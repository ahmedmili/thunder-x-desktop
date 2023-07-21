import React, { ReactNode } from "react";
import Dash from "../../assets/icons/Dash";
import Style from "./customError.module.scss";
type CustomErrorProps = {
  children?: ReactNode;
};
const CustomError = ({ children }: CustomErrorProps) => {
  return (
    <div className={Style.error}>
      <Dash />
      <p> {children} </p>
    </div>
  );
};
export default CustomError;
