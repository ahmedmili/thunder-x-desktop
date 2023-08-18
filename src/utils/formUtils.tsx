import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import CustomError from "../components/CustomError/CustomError";
import Dash from "../assets/icons/Dash";
import CustomErrorServer from "../components/custom-error-server/CustomErrorServer";
import ButtonPrimary from "../components/button-primary/ButtonPrimary";
import ButtonSecondary from "../components/button-secondary/ButtonSecondary";

import styles from "./formutils.module.scss";
import Spinner from "../components/spinner/Spinner";
export interface FormValues {
  firstname?: string;
  lastname?: string;
  email?: string;
  password?: string;
  confirm_password?: string;
  phone?: string;
  num1?: string;
  num2?: string;
  num3?: string;
  num4?: string;
  num5?: string;
  num6?: string;
}
export interface LocationFormValues {

  appEnt: number,
  codePost: number,
  appNum: number,
  selectedOption: number,
  intitule: string,
  
}

interface FieldConfig {
  type: string;
  name: string;
  label: string;
  placeholder?: string;
  id: string;
  next?: string;
  column?: string;
  errorsServer?: string;
  component: React.ElementType;
}
interface GenerateFormProps {
  initialValues: FormValues;
  validationSchema: Yup.SchemaOf<any>;
  fields: FieldConfig[];
  button: string;
  buttonAnnuler?: string;
  loading: boolean;
  showPassword?: boolean;
  showConfirmPassword?: boolean;
  onSubmit: (
    values: FormValues,
    formikHelpers: FormikHelpers<FormValues>
  ) => void | Promise<any>;
  ontoggleShowPassword?: () => void;
  ontoggleShowConfirmPassword?: () => void;
}

export const generateForm = (props: GenerateFormProps) => {
  const {
    initialValues,
    validationSchema,
    fields,
    button,
    buttonAnnuler,
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
          {fields.map((field) => {
            return field.type === "code" ? (
              <div
                key={field.name}
                style={{
                  gridColumn: "span 2",
                  display: "grid",
                  gridTemplateColumns: "40px 40px 40px 40px 40px 40px",
                  justifyContent: "center",
                  gap: "10px",
                  padding: "0 4rem",
                }}
              >
                <Field
                  type={"text"}
                  name={field.name + "1"}
                  id={field.name + "1"}
                  next={field.name + "2"}
                  placeholder={field.placeholder}
                  component={field.component}
                />
                <Field
                  type={"text"}
                  name={field.name + "2"}
                  id={field.name + "2"}
                  next={field.name + "3"}
                  placeholder={field.placeholder}
                  component={field.component}
                />
                <Field
                  type={"text"}
                  name={field.name + "3"}
                  id={field.name + "3"}
                  next={field.name + "4"}
                  placeholder={field.placeholder}
                  component={field.component}
                />
                <Field
                  type={"text"}
                  name={field.name + "4"}
                  id={field.name + "4"}
                  next={field.name + "5"}
                  placeholder={field.placeholder}
                  component={field.component}
                />
                <Field
                  type={"text"}
                  name={field.name + "5"}
                  id={field.name + "5"}
                  next={field.name + "6"}
                  placeholder={field.placeholder}
                  component={field.component}
                />
                <Field
                  type={"text"}
                  name={field.name + "6"}
                  id={field.name + "6"}
                  next={"btn"}
                  placeholder={field.placeholder}
                  component={field.component}
                />
                <div
                  style={{
                    gridColumn: "span 6",
                    justifySelf: "end",
                    color: "#958E8E",
                    fontSize: "1.2rem",
                    fontFamily: "var(--fontPrimary)",
                    display: "flex",
                    gap: "1rem",
                  }}
                >
                  <span>Non reçu</span>
                  <a href="" style={{ color: "var(--primaryColor)" }}>
                    Renvoyer le code
                  </a>
                </div>
              </div>
            ) : field.type === "checkbox" ? (
              <div key={field.name} style={{ gridColumn: "span 2" }}>
                <Field
                  type={field.type}
                  name={field.name}
                  label={field.label}
                  id={field.name}
                  component={field.component}
                />
              </div>
            ) : (
              <div
                key={field.name}
                style={
                  field.column
                    ? { gridColumn: "span 2" }
                    : { gridColumn: "span 1" }
                }
              >
                <Field
                  type={field.type}
                  name={field.name}
                  id={field.name}
                  placeholder={field.placeholder}
                  label={field.label}
                  errorsServer={field.errorsServer}
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
            );
          })}
          {buttonAnnuler && (
            <ButtonSecondary name="annuler">Annuler</ButtonSecondary>
          )}
          <ButtonPrimary
            name="btn"
            type="submit"
            disabled={isSubmitting}
            style={
              buttonAnnuler ? { gidColumn: "span 1" } : { gridColumn: "span 2" }
            }
          >
            {!loading ? button : <Spinner name={button} />}
          </ButtonPrimary>
        </Form>
      )}
    </Formik>
  );
};
