import { ErrorMessage } from "formik";
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
        {props.type === "tel" ? <span>+216</span> : null}
        <input
          className={`${styles.formInput} ${
            hasError ? styles.errorStyle : ""
          } ${field.name === "phone" ? styles.phone : ""}`}
          type={props.type}
          error={errors[field.name]}
          touched={touched[field.name] ? "true" : null}
          {...field}
          {...props}
        />
      </div>

      <ErrorMessage name={field.name} component={CustomError} />
    </div>
  );
};
export default InputForm;
