import { Email } from "@mui/icons-material";
import { borderColor } from "@mui/system";
import { ErrorMessage } from "formik";
import Eye from "../../assets/icons/Eye";
import CustomError from "../CustomError/CustomError";
import styles from "./inputform.module.scss";

interface InputFormProps {
  type?: string;
  label?: string;
  error?: string;
  touched?: string;
  column?: string;
}

const InputForm = ({
  field,
  form: { touched, errors },
  column,
  ...props
}: InputFormProps & { field: any; form: any }) => {
  const hasError = touched[field.name] && errors[field.name];
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
            props.type === "tel"
              ? {
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                  borderLeft: 0,
                }
              : props.type === "email" || props.type === "password"
              ? {
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                  borderRight: 0,
                }
              : { borderRadius: "7px" }
          }
          type={props.type}
          error={errors[field.name]}
          touched={touched[field.name] ? "true" : null}
          {...field}
          {...props}
        />
        {props.type === "email" ? (
          <span
            className={`${styles.rightIcon} ${
              hasError ? styles.errorColor : styles.defaultColor
            }`}
          >
            <Email />
          </span>
        ) : props.type === "password" ? (
          <span
            className={`${styles.rightIcon} ${
              hasError ? styles.errorColor : styles.defaultColor
            }`}
          >
            <Eye />
          </span>
        ) : null}
      </div>

      <ErrorMessage name={field.name} component={CustomError} />
    </div>
  );
};
export default InputForm;
