import { FormikHelpers } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import { useAppDispatch } from "../../Redux/store";
import Apple from "../../assets/icons/Apple";
import Facebook from "../../assets/icons/Facebook";
import Google from "../../assets/icons/Google";
import InputForm from "../../components/Input-form/InputForm";
import ButtonConnect from "../../components/button-connect/ButtonConnect";
import CardPage from "../../components/card-page/CardPage";
import CheckboxForm from "../../components/checkbox-form/CheckboxForm";
import LinkConnect from "../../components/link-connect/LinkConnect";
import Or from "../../components/or/Or";
import PicturesList from "../../components/picture-list/PicturesList";
import { FormValues, generateForm } from "../../utils/formUtils";

import { useNavigate } from "react-router-dom";

import { useTranslation } from "react-i18next";
import { setUser } from "../../Redux/slices/userSlice";
import { userService } from "../../services/api/user.api";
import { localStorageService } from "../../services/localStorageService";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [errorsServer, setErrorServer] = useState<string>("")

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { t } = useTranslation()

  const handlePasswordToggle = () => {
    setShowPassword((password) => !password)
  }


  const fields = [
    {
      type: "email",
      name: "email",
      label: t('email'),
      placeholder: t('tapeHere'),
      id: "email",
      column: "fill",
      component: InputForm,
    },
    {
      type: !showPassword ? "password" : "text",
      name: "password",
      label: t('password'),
      placeholder: t('tapeHere'),
      id: "password",
      column: "fill",
      showPassword: showPassword,
      ontoggleShowPassword: handlePasswordToggle,
      component: InputForm,
      errorsServer: errorsServer.length ? errorsServer : "",
    },
    {
      type: "checkbox",
      name: "remember",
      label: t('forgetPassword.rememberMe'),
      id: "remember",
      component: CheckboxForm,

    },
  ];

  const loginSchema = Yup.object().shape({
    email: Yup.string().
      required(`${t('auth.email.required')}`)
      .email(`${t('auth.email.type')}`)
      .label("Email"),
    password: Yup.string()
      .min(8, `${t('auth.password.length.min')}`)
      .max(20, `${t('auth.password.length.max')}`)
      .required(`${t('auth.password.required')}`)
      .label("Password"),
  });


  const onSubmitHandler = async (values: any) => {
    try {
      const { token, user } = await userService.loginUser(values);
      localStorageService.setUserCredentials(user, token);
      dispatch(setUser(user));
      navigate("/"); // Redirect to the home page
    } catch (error: any) {
      if (error.response) {
        if (Array.isArray(error.response.data.error)) {
          error.response.data.error.forEach((el: any) => {
          });
        } else {
          const errorMessage = error.response.data.message

          setErrorServer(`${t('auth.invalideCredentials')}`)

        }
      } else {
        // toast.error("Something went wrong. Please try again.", {
        //   position: "top-right",
        // });
      }
    }
  };

  const initialValues = {
    email: "",
    password: "",
  };
  const onSubmit = async (
    values: FormValues,
    { setSubmitting, resetForm }: FormikHelpers<FormValues>
  ) => {
    onSubmitHandler(values);
  };

  return (
    <CardPage icon="" text="" title={t('login2')} image={<PicturesList />}>
      {generateForm({
        initialValues,
        validationSchema: loginSchema,
        fields,
        loading: false,
        button: `${t('login2')}`,
        onSubmit,
        ontoggleShowPassword: handlePasswordToggle,
        showPassword: showPassword,
      })}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Or>Or</Or>
        <ButtonConnect provider="apple" icon={<Apple />} text={t('auth.ContinueApple')} />
        <ButtonConnect provider="google" icon={<Google />} text={t('auth.ContinueGoogle')} />
        <ButtonConnect provider="fcb" icon={<Facebook />} text={t('auth.ContinueFacebook')} />

        <LinkConnect to="/register" label={t('haventAcc')} clickTitle={t('signup')} />
      </div>
    </CardPage>
  );
};

export default LoginPage;
