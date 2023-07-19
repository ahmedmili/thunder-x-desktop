import * as Yup from "yup";
import { Field, Form, Formik } from "formik";
import styles from "./register.module.scss";
import InputForm from "../../components/Input-form/InputForm";
import ButtonPrimary from "../../components/button-primary/ButtonPrimary";
import TitleForm from "../../components/title-form/TitleForm";
import FormContent from "../../components/form-content/FormContent";
import Or from "../../components/or/Or";
import ButtonConnect from "../../components/button-connect/ButtonConnect";
import Apple from "../../assets/icons/Apple";
import Google from "../../assets/icons/Google";
import Facebook from "../../assets/icons/Facebook";
import { Link } from "react-router-dom";
import LinkConnect from "../../components/link-connect/LinkConnect";

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
}
const registerSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(3, "firstname must be more than 3")
    .max(20, "firstname must be less than 20 characters")
    .required("firstname is required")
    .label("Firstname"),
  lastName: Yup.string()
    .min(3, "lastname must be more than 3")
    .max(20, "lastname must be less than 20 characters")
    .required("lastname is required")
    .label("Lastname"),
  email: Yup.string().required().email().label("Email"),
  password: Yup.string()
    .min(6, "password must be more than 6")
    .max(20, "password must be less than 20 characters")
    .required("password is required")
    .label("Password"),
  confirmPassword: Yup.string()
    .max(20, "password must be less than 20 characters")
    .required("password is required")
    .label("Confirm password")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
  phone: Yup.string()
    .min(10, "phone must be more than 10")
    .max(10, "phone must be less than 10 numbers")
    .label("Phone"),
});
const RegisterPage = () => {
  return (
    <div className={styles.pageContent}>
      <FormContent>
        <TitleForm>S'inscrire</TitleForm>
        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
            phone: "",
          }}
          validationSchema={registerSchema}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              alert(JSON.stringify(values, null, 2));
              setSubmitting(false);
            }, 400);
          }}
        >
          {({ isSubmitting }) => (
            <Form className={styles.formWrapper}>
              <Field
                type="text"
                name="firstName"
                label="Nom"
                placeholder="Enter ici"
                id="firstName"
                component={InputForm}
              />
              <Field
                type="text"
                name="lastName"
                label="Prénom"
                placeholder="Enter ici"
                id="lastName"
                component={InputForm}
              />
              <Field
                type="text"
                name="email"
                label="Email"
                placeholder="Enter ici"
                id="email"
                column="fill"
                component={InputForm}
              />
              <Field
                type="password"
                name="password"
                label="Mot de passe"
                placeholder="Enter ici"
                id="password"
                column="fill"
                component={InputForm}
              />
              <Field
                type="password"
                name="confirmPassword"
                label="Confirmer le mot de passe"
                placeholder="Enter ici"
                id="confirmPassword"
                column="fill"
                component={InputForm}
              />
              <Field
                type="tel"
                name="phone"
                label="Numéro de téléphone"
                placeholder=""
                id="confirmPassword"
                column="fill"
                component={InputForm}
              />
              <ButtonPrimary type="submit" disabled={isSubmitting}>
                S'inscrire
              </ButtonPrimary>
            </Form>
          )}
        </Formik>
        <Or>Or</Or>
        <ButtonConnect icon={<Apple />} text="Continue avec Apple" />
        <ButtonConnect icon={<Google />} text="Continue avec Google" />
        <ButtonConnect icon={<Facebook />} text="Continue avec Facebook" />

        <LinkConnect />
      </FormContent>
      <div>Image</div>
    </div>
  );
};
export default RegisterPage;
/* const RegisterPage = () => {
  const formik = useFormik<FormValues>({
    initialValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
    },
    validationSchema: registerSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <form className="form-wrapper" onSubmit={formik.handleSubmit}>
      <label htmlFor="firstname">Firstname</label>
      <input
        id="firstname"
        type="text"
        value={formik.values.firstname}
        onChange={formik.handleChange("firstname")}
        onBlur={formik.handleBlur("firstname")}
      />
      {formik.touched.firstname && (
        <span className="error"> {formik.errors.firstname} </span>
      )}

      <label htmlFor="lastname"> LastName </label>
      <input
        id="lastname"
        type="text"
        value={formik.values.lastname}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      {formik.touched.lastname && (
        <span className="error"> {formik.errors.lastname} </span>
      )}
      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        value={formik.values.email}
        onChange={formik.handleChange("email")}
        onBlur={formik.handleBlur("email")}
      />
      {formik.touched.email && (
        <span className="error"> {formik.errors.email} </span>
      )}
      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        value={formik.values.password}
        onChange={formik.handleChange("password")}
        onBlur={formik.handleBlur("password")}
      />
      {formik.touched.password && (
        <span className="error"> {formik.errors.password} </span>
      )}
      <label htmlFor="confirmPassword">Confirm password</label>
      <input
        id="confirmPassword"
        type="password"
        value={formik.values.confirmPassword}
        onChange={formik.handleChange("confirmPassword")}
        onBlur={formik.handleBlur("confirmPassword")}
      />
      {formik.touched.confirmPassword && (
        <span className="error">{formik.errors.confirmPassword}</span>
      )}
      <label htmlFor="phone">Phone</label>
      <input
        id="phone"
        type="text"
        value={formik.values.phone}
        onChange={formik.handleChange("phone")}
        onBlur={formik.handleBlur("phone")}
      />
      {formik.touched.phone && (
        <span className="error"> {formik.errors.phone} </span>
      )}

      <button type="button" onClick={() => formik.handleSubmit()}>
        S'inscrire
      </button>
    </form>
  );
};

export default RegisterPage; */

/* import {
  Box,
  Container,
  Divider,
  IconButton,
  InputAdornment,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { object, string, TypeOf } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "../../components/FormInput/FormInput";
import { Link, useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";
import backPic from "../../assets/backPic.jpg";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { useAppDispatch } from "../../Redux/store";
import { registerUser, setUser } from "../../Redux/slices/user/userSlice";
import { HomeOutlined, Visibility, VisibilityOff } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { useFormik } from "formik";
import "./register.page.css";

const ApiEndpoint = import.meta.env.VITE_SERVER_ENDPOINT;
const API_URL = `${ApiEndpoint}/signupclient`;
import { userService } from "../../services/api/user.api";
import { localStorageService } from "../../services/localStorageService";

const registerSchema = object({
  firstname: string().min(1, "Full name is required").max(100),
  lastname: string().min(1, "Full last name is required").max(100),
  email: string()
    .min(1, "Email address is required")
    .email("Email Address is invalid"),
  password: string()
    .min(1, "Password is required")
    .min(6, "Password must be more than 6 characters")
    .max(32, "Password must be less than 32 characters"),
  passwordConfirm: string().min(1, "Please confirm your password"),
  phone: string().min(8).max(8),
}).refine((data) => data.password === data.passwordConfirm, {
  path: ["passwordConfirm"],
  message: "Passwords do not match",
});

const HomePageLink = () => {
  const { t } = useTranslation();
  return (
    <Link className="Link home" to="/">
      <HomeOutlined sx={{ position: "relative", top: "5px" }} />
      {t("home")}
    </Link>
  );
};

export type RegisterInput = TypeOf<typeof registerSchema>;

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: registerSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  const methods = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { handleSubmit } = methods;

  const handleRegister: SubmitHandler<RegisterInput> = async (values) => {
    console.log("Form submitted");
    try {
      const { token, user } = await userService.registerUser(values);
      localStorageService.setUserCredentials(user, token);
      dispatch(registerUser(user)); // dispatch the registerUser action with the user object
      // dispatch(setUser(user));
      toast.success("You successfully registered");
      navigate("/"); // Redirect to the home page
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 422) {
          error.response.data.errors.forEach((err: any) =>
            toast.error(err.message, {
              position: "top-right",
            })
          );
        } else {
          toast.error("Network error occurred. Please try again.", {
            position: "top-right",
          });
        }
      } else {
        toast.error("Something went wrong. Please try again.", {
          position: "top-right",
        });
      }
    }
  };

  useEffect(() => {
    // Disable scrolling when the component mounts
    document.body.style.overflow = "hidden";

    // Enable scrolling when the component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <Container maxWidth={false} className="containerr">
      <Box className="form-container">
        <FormProvider {...methods}>
          <Box
            className="form"
            component="form"
            onSubmit={handleSubmit(handleRegister)}
            noValidate
            autoComplete="off"
          >
            <HomePageLink />
            <Typography
              className="createAcc-text"
              textAlign="center"
              component="h1"
            >
              {t("createAcc")}
            </Typography>
            <Typography className="submessage" component="h2">
              {t("createAccSubtitle")}
            </Typography>
            <FormInput
              name="firstname"
              placeholder={t("firstName") || "First Name"}
              label={""}
              className="input-form"
            />
            <FormInput
              className="input-form"
              name="lastname"
              placeholder={t("Last Name") || "Last Name"}
              label={""}
            />
            <FormInput
              className="input-form"
              name="email"
              placeholder={t("emailAddress") || "Email Adress"}
              type="email"
              label={""}
            />
            <FormInput
              className="input-form"
              name="password"
              placeholder={t("password") || "Password"}
              type={showPassword ? "text" : "password"}
              label={""}
              inputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      sx={{
                        marginRight: "1%",
                      }}
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <FormInput
              className="input-form"
              name="passwordConfirm"
              placeholder={t("confirmPassword") || undefined}
              type={showPassword ? "text" : "password"}
              label={""}
            />

            <FormInput
              className="input-form"
              name="phone"
              placeholder={t("cartPage.phoneNumber") || undefined}
              type="text"
              label={""}
            />
            <LoadingButton
              className="LoadingButton"
              variant="contained"
              sx={{ mt: 1 }}
              fullWidth
              disableElevation
              type="submit"
              loading={methods.formState.isSubmitting}
            >
              {t("signup")}
            </LoadingButton>
            <Divider sx={{ padding: "5px" }} />
            <Typography sx={{ fontSize: "0.9rem", mb: "1rem" }}>
              {t("haveAcc")}
              <Link className="Link" to="/login">
                {t("connectHere")}
              </Link>
            </Typography>
          </Box>
        </FormProvider>
      </Box>
    </Container>
  );
};

export default RegisterPage; */
