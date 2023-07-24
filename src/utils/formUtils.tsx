import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import CustomError from "../components/CustomError/CustomError";
import Dash from "../assets/icons/Dash";
import CustomErrorServer from "../components/custom-error-server/CustomErrorServer";
import ButtonPrimary from "../components/button-primary/ButtonPrimary";
import styles from "./formutils.module.scss";
import Spinner from "../components/spinner/Spinner";
export interface FormValues {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirm_password: string;
  phone: string;
}

interface FieldConfig {
  type: string;
  name: string;
  label: string;
  placeholder?: string;
  id: string;
  column?: string;
  errorsServer?: string;
  component: React.ElementType;
}
interface GenerateFormProps {
  initialValues: FormValues;
  validationSchema: Yup.SchemaOf<FormValues>;
  fields: FieldConfig[];
  button: string;
  loading: boolean;
  showPassword: boolean;
  showConfirmPassword: boolean;
  onSubmit: (
    values: FormValues,
    formikHelpers: FormikHelpers<FormValues>
  ) => void | Promise<any>;
  ontoggleShowPassword: () => void;
  ontoggleShowConfirmPassword: () => void;
}

export const generateForm = (props: GenerateFormProps) => {
  const {
    initialValues,
    validationSchema,
    fields,
    button,
    loading,
    showPassword,
    showConfirmPassword,
    onSubmit,
    ontoggleShowPassword,
    ontoggleShowConfirmPassword,
  } = props;

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting }) => (
        <Form className={styles.formWrapper}>
          {fields.map((field) => (
            <div
              key={field.name}
              style={
                field.column
                  ? { gridColumn: "span 2" }
                  : { gridColumn: "span 1" }
              }
            >
              <label htmlFor={field.name}>{field.label}</label>
              <Field
                type={field.type}
                name={field.name}
                id={field.name}
                placeholder={field.placeholder}
                component={field.component}
                showPassword={showPassword}
                showConfirmPassword={showConfirmPassword}
                ontoggleShowPassword={ontoggleShowPassword}
                ontoggleShowConfirmPassword={ontoggleShowConfirmPassword}
              />
              <ErrorMessage name={field.name} component={CustomError} />
              {field.errorsServer && (
                <CustomErrorServer
                  icon={<Dash />}
                  message={field.errorsServer}
                />
              )}
            </div>
          ))}
          <ButtonPrimary type="submit" disabled={isSubmitting}>
            {!loading ? button : <Spinner name={button} />}
          </ButtonPrimary>
        </Form>
      )}
    </Formik>
  );
};
