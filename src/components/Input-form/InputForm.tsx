import Email from "../../assets/icons/Email";
import Eye from "../../assets/icons/Eye";
import styles from "./inputform.module.scss";
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
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
  const hasError = (((touched[field.name] ? true : false) && (errors[field.name] ? true : false)) || errorsServer) ? true : false;

  const inputStyle = {
    flex: 1,
    position: 'relative',
    borderRadius: '7px',
    border: '1px solid #fbc000',
    borderColor: !hasError ? '#fbc000' : '#a83232',
    backGroundColor: '#fff',
    outline: 0,
    lineHeight: 1,
    padding: '1rem 0.5rem',
  };

  return (
    <div
      className={`${styles.formControl} ${column ? styles.fill : ""}`}>
      <label htmlFor={field.name}
        className={styles.label}
      >
        {props.label}
      </label>
      <div
        className={`${styles.formInputContent}`}
      >
        {props.type === "tel" ? (
          <span
            className={`${hasError ? styles.errorColor : styles.defaultColor} ${styles.indicator} `}
          >
            +216
          </span>
        ) : null}

        <input
          className={`${hasError ? styles.errorStyle : styles.defaultColor} ${styles.formInput} `}
          style={
            field.name === "phone"
              ? {
                ...inputStyle,
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                borderLeft: 0,
                borderWidth: "1px 1px 1px 0px",
              }
              : field.name === "email" || props.type === "password"
                ? {
                  ...inputStyle,
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                  borderRight: 0,
                }
                : (field.name === "password" && showPassword) ||
                  (field.name === "confirm_password" && showConfirmPassword)
                  ? {
                    ...inputStyle,
                    borderRight: 0,
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                  }
                  : {
                    ...inputStyle,
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
            className={`${styles.rightIcon} ${hasError ? styles.errorColor : styles.defaultColor
              }`}
          >
            <Email />
          </span>
        ) : field.name === "password" ? (
          <span
            className={`${styles.rightIcon} ${styles.clickable} ${hasError ? styles.errorColor : styles.defaultColor
              }`}
            onClick={ontoggleShowPassword}
          >
            {showPassword ? <Eye /> : <VisibilityOffOutlinedIcon />}
          </span>
        ) : field.name == "confirm_password" ? (
          <span
            className={`${styles.rightIcon} ${hasError ? styles.errorColor : styles.defaultColor
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
