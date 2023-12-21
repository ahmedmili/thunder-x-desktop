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
      label: "Nom",
      placeholder: "Enter ici",
      id: "firstname",
      component: InputForm,
    },
    {
      type: "text",
      name: "lastname",
      label: "Prénom",
      placeholder: "Enter ici",
      id: "lastname",
      component: InputForm,
    },
    {
      type: "email",
      name: "email",
      label: "Email",
      placeholder: "Enter ici",
      id: "email",
      column: "fill",
      errorsServer:
        errorsServer && errorsServer.email ? errorsServer.email[0] : "",
      component: InputForm,
    },
    {
      type: !showPassword ? "password" : "text",
      name: "password",
      label: "Mot de passe",
      placeholder: "Enter ici",
      id: "password",
      column: "fill",
      component: InputForm,
    },
    {
      type: !showConfirmPassword ? "password" : "text",
      name: "confirm_password",
      label: "Confirmer le mot de passe",
      placeholder: "Enter ici",
      id: "confirm_password",
      column: "fill",
      component: InputForm,
    },
    {
      type: "tel",
      name: "phone",
      label: "Numéro de téléphone",
      placeholder: "Enter ici",
      id: "phone",
      column: "fill",
      errorsServer:
        errorsServer && errorsServer.message ? errorsServer.message : "",
      component: InputForm,
    },
  ];

  const registerSchema = Yup.object().shape({
    firstname: Yup.string()
      .min(3, "firstname must be more than 3")
      .max(20, "firstname must be less than 20 characters")
      .required("firstname is required")
      .label("firstname"),
    lastname: Yup.string()
      .min(3, "lastname must be more than 3")
      .max(20, "lastname must be less than 20 characters")
      .required("lastname is required")
      .label("lastname"),
    email: Yup.string().required().email().label("Email"),
    password: Yup.string()
      .min(8, "password must be more than 8")
      .max(20, "password must be less than 20 characters")
      .required("password is required")
      .label("Password"),
    confirm_password: Yup.string()
      .max(20, "password must be less than 20 characters")
      .required("password is required")
      .label("Confirm password")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
    phone: Yup.string()
      .min(8, "phone must be more than 10")
      .max(8, "phone must be less than 10 numbers")
      .required("phone is required")
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
    <CardPage icon="" text="" title="S'inscrire" image={<PicturesList />}>
      {generateForm({
        initialValues,
        validationSchema: registerSchema,
        fields,
        loading: loading,
        button: "S'inscrire",
        showPassword,
        showConfirmPassword,
        ontoggleShowPassword,
        ontoggleShowConfirmPassword,
        onSubmit,
      })}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Or>Or</Or>
        <ButtonConnect provider="apple" icon={<Apple />} text="Continue avec Apple" />
        <ButtonConnect provider="google" icon={<Google />} text="Continue avec Google" />
        <ButtonConnect provider="fcb" icon={<Facebook />} text="Continue avec Facebook" />
        <LinkConnect to="/login" label={t('haveAcc')} clickTitle={t('login2')} />
      </div>
    </CardPage>
  );
};

export default Register;

