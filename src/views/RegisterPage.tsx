import { FormikHelpers } from "formik";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { fetchHomeData, isDeliveryHomeSelector } from "../Redux/slices/home";
import { createUser, usersErrors, usersLoding } from "../Redux/slices/users";
import { useAppDispatch, useAppSelector } from "../Redux/store";
import Apple from "../assets/icons/Apple";
import Facebook from "../assets/icons/Facebook";
import Google from "../assets/icons/Google";
import InputForm from "../components/Input-form/InputForm";
import ButtonConnect from "../components/button-connect/ButtonConnect";
import CardPage from "../components/card-page/CardPage";
import LinkConnect from "../components/link-connect/LinkConnect";
import Or from "../components/or/Or";
import PicturesList from "../components/picture-list/PicturesList";
import { FormValues, generateForm } from "../utils/formUtils";

const Register = () => {
  const { t } = useTranslation()

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const ontoggleShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  const ontoggleShowConfirmPassword = () => {
    setShowConfirmPassword((prevShowPassword) => !prevShowPassword);
  };
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const errorsServer = useSelector(usersErrors);
  const loading = useSelector(usersLoding);

  const location = useAppSelector((state) => state.location.position);
  const isDelivery = useSelector(isDeliveryHomeSelector);
  useEffect(() => {
    dispatch(
      fetchHomeData(1, location?.coords.longitude, location?.coords.latitude)
    );
  }, []);

  const fields = [
    {
      type: "text",
      name: "firstname",
      label: t('firstName'),
      placeholder: t('tapeHere'),
      id: "firstname",
      component: InputForm,
    },
    {
      type: "text",
      name: "lastname",
      label: t('lastName'),
      placeholder: t('tapeHere'),
      id: "lastname",
      component: InputForm,
    },
    {
      type: "email",
      name: "email",
      label: t('emailAddress'),
      placeholder: t('tapeHere'),
      id: "email",
      column: "fill",
      errorsServer:
        errorsServer && errorsServer.email ? t('auth.email.existe') : "",
      component: InputForm,
    },
    {
      type: !showPassword ? "password" : "text",
      name: "password",
      label: t('password'),
      placeholder: t('tapeHere'),
      id: "password",
      column: "fill",
      component: InputForm,
    },
    {
      type: !showConfirmPassword ? "password" : "text",
      name: "confirm_password",
      label: t('confirmPassword'),
      placeholder: t('tapeHere'),
      id: "confirm_password",
      column: "fill",
      component: InputForm,
    },
    {
      type: "tel",
      name: "phone",
      label: t('cartPage.phoneNumber'),
      placeholder: t('tapeHere'),
      id: "phone",
      column: "fill",
      errorsServer:
        errorsServer && errorsServer.message ? t('auth.phone.existe') : "",
      component: InputForm,
    },
  ];

  const registerSchema = Yup.object().shape({
    firstname: Yup.string()
      .min(3, `${t('auth.firstName.min')}`)
      .max(20, `${t('auth.firstName.max')}`)
      .required(`${t('auth.firstName.required')}`)
      .label("firstname"),
    lastname: Yup.string()
      .min(3, `${t('auth.lastName.min')}`)
      .max(20, `${t('auth.lastName.max')}`)
      .required(`${t('auth.lastName.required')}`)
      .label("lastname"),
    email: Yup.string()
      .required(`${t('auth.email.required')}`)
      .email(`${t('auth.email.type')}`)
      .label("Email"),
    password: Yup.string()
      .min(8, `${t('auth.password.min')}`)
      .max(20, `${t('auth.password.max')}`)
      .required(`${t('auth.password.required')}`)
      .label("Password"),
    confirm_password: Yup.string()
      .min(8, `${t('auth.password.min')}`)
      .max(20, `${t('auth.password.max')}`)
      .required(`${t('auth.password.required')}`)
      .label("Confirm password")
      .oneOf([Yup.ref("password"), null], `${t('auth.password.ConfirmMatch')}`),
    phone: Yup.string()
      .min(8, `${t('auth.phone.exasctly')}`)
      .max(8, `${t('auth.phone.exasctly')}`)
      .required(`${t('auth.phone.required')}`)
      .label("phone"),
  });

  const initialValues = {
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirm_password: "",
    phone: "",
  };

  const onSubmit = async (
    values: FormValues,
    { setSubmitting, resetForm }: FormikHelpers<FormValues>
  ) => {
    try {
      const response = await dispatch(createUser(values));
      const { success } = response?.data;
      if (success) {
        setSubmitting(false);
        resetForm();
        navigate("/confirm");
      }
      setSubmitting(false);
    } catch (error) {
      setSubmitting(false);
    }
  };

  return (
    <CardPage icon="" text="" title={t('signup')} image={<PicturesList />}>
      {generateForm({
        initialValues,
        validationSchema: registerSchema,
        fields,
        loading: loading,
        button: t('signup'),
        showPassword,
        showConfirmPassword,
        ontoggleShowPassword,
        ontoggleShowConfirmPassword,
        onSubmit,
      })}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Or>Or</Or>
        <ButtonConnect provider="apple" icon={<Apple />} text={t('auth.ContinueApple')} />
        <ButtonConnect provider="google" icon={<Google />} text={t('auth.ContinueGoogle')} />
        <ButtonConnect provider="fcb" icon={<Facebook />} text={t('auth.ContinueFacebook')} />
        <LinkConnect to="/login" label={t('haveAcc')} clickTitle={t('login2')} />
      </div>
    </CardPage>
  );
};

export default Register;
