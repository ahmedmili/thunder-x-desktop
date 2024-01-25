import { NavLink } from "react-router-dom";
import styles from "./checkboxform.module.scss";
import { t } from "i18next";

interface CheckboxFormProps {
  type?: string;
  label?: string;
}

const CheckboxForm = ({
  field,
  ...props
}: CheckboxFormProps & { field: any; form: any }) => {
  return (
    <div className={`${styles.formControl}`}>
      <input
        className={`${styles.formInput}`}
        type={props.type}
        {...field}
        {...props}
      />
      <label htmlFor={field.name} className={styles.label}>
        {props.label}
      </label>
      <NavLink
        to="/forgotpassword"
        style={{
          color: "var(--primaryColor)",
          marginLeft: "auto",
          fontSize: "1.4rem",
        }}
      >
        {t('forgetPassword.forgetPassword')}
      </NavLink>
    </div>
  );
};
export default CheckboxForm;
