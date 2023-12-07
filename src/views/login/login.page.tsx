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
import { toast } from "react-toastify";
import { setUser } from "../../Redux/slices/userSlice";
import { userService } from "../../services/api/user.api";
import { localStorageService } from "../../services/localStorageService";
// import { OldSocialLogin as SocialLogin } from "react-social-login";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { t } = useTranslation()

  const handlePasswordToggle = () => {
    console.log("toggle")
    setShowPassword((password) => !password)
  }
  const fields = [
    {
      type: "email",
      name: "email",
      label: "Email",
      placeholder: "Enter ici",
      id: "email",
      column: "fill",
      component: InputForm,
    },
    {
      type: !showPassword ? "password" : "text",
      name: "password",
      label: "Mot de passe",
      placeholder: "Enter ici",
      id: "password",
      column: "fill",
      showPassword: showPassword,
      ontoggleShowPassword: handlePasswordToggle,
      component: InputForm,
    },
    {
      type: "checkbox",
      name: "remember",
      label: "Remember me",
      id: "remember",
      component: CheckboxForm,
    },
  ];

  const loginSchema = Yup.object().shape({
    email: Yup.string().required().email().label("Email"),
    password: Yup.string()
      .min(8, "password must be more than 8")
      .max(20, "password must be less than 20 characters")
      .required("password is required")
      .label("Password"),
  });


  const onSubmitHandler = async (values: any) => {
    try {
      const { token, user } = await userService.loginUser(values);
      localStorageService.setUserCredentials(user, token);
      dispatch(setUser(user));
      toast.success("You successfully logged in");
      navigate("/"); // Redirect to the home page
    } catch (error: any) {
      if (error.response) {
        if (Array.isArray(error.response.data.error)) {
          error.response.data.error.forEach((el: any) =>
            toast.error(el.message, {
              position: "top-right",
            })
          );
        } else {
          toast.error(error.response.data.message, {
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
    <CardPage icon="" text="" title="Se connecter" image={<PicturesList />}>
      {generateForm({
        initialValues,
        validationSchema: loginSchema,
        fields,
        loading: false,
        button: "Se connecter",
        onSubmit,
        ontoggleShowPassword: handlePasswordToggle,
        showPassword: showPassword,
      })}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Or>Or</Or>
        <ButtonConnect provider="apple" icon={<Apple />} text="Continue avec Apple" />
        <ButtonConnect provider='google' icon={<Google />} text="Continue avec Google" />
        <ButtonConnect provider="fcb" icon={<Facebook />} text="Continue avec Facebook" />
        <LinkConnect to="/register" label={t('haventAcc')} clickTitle={t('signup')} />
      </div>
    </CardPage>
  );
};

export default LoginPage;
