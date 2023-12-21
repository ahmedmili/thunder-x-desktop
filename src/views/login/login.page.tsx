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
import { setUserCredentials } from "../../Redux/slices/userSlice";
import { userService } from "../../services/api/user.api";
import { IUser } from "../../services/types";
import { toast } from "react-toastify";

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

  const saveUser = (user: IUser, token: string) => {
    dispatch(setUserCredentials({ user, token }));
    navigate('/');
  }

  const onSubmitHandler = async (values: any) => {
    try {
      const { token, user } = await userService.loginUser(values);
      if (user) {
        const userState = user.status ? user.status : user.status_id
        switch (userState) {
          case 1:
            saveUser(user, token)
            user.rollback && toast.success(t('auth.restoredAccount')) 
            setErrorServer('')
            break;
          case 4:
            navigate(`/confirm/${user.id}/`);
            break;
          default:
            break;
        }
      } else {

      }

    } catch (error: any) {
      if (error.response) {
        if (Array.isArray(error.response.data.error)) {
          error.response.data.error.forEach((el: any) => {
          });
        } else {
          const errorMessage = error.response.data.message

          setErrorServer(`${t('auth.invalideCredentials')}`)
          errorMessage === 'account blocked.' ? setErrorServer(`${t('auth.accountStatus.blocked')}`) :
            errorMessage === 'Login credentials are invalid.' ? setErrorServer(`${t('auth.invalideCredentials')}`) : setErrorServer(errorMessage)
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
