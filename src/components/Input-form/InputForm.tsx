import { useState } from "react";
import Email from "../../assets/icons/Email";
import Eye from "../../assets/icons/Eye";
import styles from "./inputform.module.scss";

interface InputFormProps {
  type?: string;
  label?: string;
  error?: string;
  touched?: string;
  column?: string;
  errorsServer?: any;
  showPassword: boolean;
  showConfirmPassword: boolean;
  ontoggleShowPassword: () => void;
  ontoggleShowConfirmPassword: () => void;
}

const InputForm = ({
  field,
  form: { touched, errors },
  column,
  errorsServer,
  showPassword,
  showConfirmPassword,
  ontoggleShowPassword,
  ontoggleShowConfirmPassword,
  ...props
}: InputFormProps & { field: any; form: any }) => {
  const hasError = touched[field.name] && errors[field.name] && errorsServer;
  return (
    <div className={`${styles.formControl} ${column ? styles.fill : null}`}>
      <label htmlFor={field.name} className={styles.label}>
        {props.label}
      </label>
      <div className={styles.formInputContent}>
        {props.type === "tel" ? (
          <span
            className={`${styles.indicator} ${
              hasError ? styles.errorColor : ""
            }`}
          >
            +216
          </span>
        ) : null}

        <input
          className={`${styles.formInput} ${hasError ? styles.errorStyle : ""}`}
          style={
            field.name === "phone"
              ? {
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                  borderLeft: 0,
                }
              : field.name === "email" || props.type === "password"
              ? {
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                  borderRight: 0,
                }
              : (field.name === "password" && showPassword) ||
                (field.name === "confirm_password" && showConfirmPassword)
              ? {
                  borderRight: 0,
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                }
              : {
                  borderRadius: "7px",
                }
          }
          type={props.type}
          error={errors[field.name]}
          touched={touched[field.name] ? "true" : null}
          {...field}
          {...props}
        />
        {field.name === "email" ? (
          <span
            className={`${styles.rightIcon} ${
              hasError ? styles.errorColor : styles.defaultColor
            }`}
          >
            <Email />
          </span>
        ) : field.name === "password" ? (
          <span
            className={`${styles.rightIcon} ${
              hasError ? styles.errorColor : styles.defaultColor
            }`}
            onClick={ontoggleShowPassword}
          >
            <Eye />
          </span>
        ) : field.name == "confirm_password" ? (
          <span
            className={`${styles.rightIcon} ${
              hasError ? styles.errorColor : styles.defaultColor
            }`}
            onClick={ontoggleShowConfirmPassword}
          >
            <Eye />
          </span>
        ) : null}
      </div>
    </div>
  );
};
export default InputForm;
