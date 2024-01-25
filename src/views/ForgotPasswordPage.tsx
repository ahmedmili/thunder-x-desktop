import { FormikHelpers } from "formik";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { usersLoding } from "../Redux/slices/users";
import Interogation from "../assets/icons/Interogation";
import InputForm from "../components/Input-form/InputForm";
import ButtonTertiary from "../components/button-tertiary/ButtonTertiary";
import CardPage from "../components/card-page/CardPage";
import Or from "../components/or/Or";
import PicturesList from "../components/picture-list/PicturesList";
import { userService } from "../services/api/user.api";
import { FormValues, generateForm } from "../utils/formUtils";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  const [errorsServer, setErrorsServer] = useState<string>("")
  const loading = useSelector(usersLoding);
  const { t } = useTranslation()

  const fields = [
    {
      type: "email",
      name: "email",
      label: "Email",
      placeholder: t('tapeHere'),
      id: "email",
      column: "fill",
      errorsServer: errorsServer,
      component: InputForm,
    },
  ];

  const forgotSchema = Yup.object().shape({
    email: Yup.string()
      .required(`${t('auth.email.required')}`)
      .email(`${t('auth.email.type')}`)
      .label("Email"),
  });

  const initialValues = {
    email: "",
  };
  const onSubmit = async (
    values: FormValues,
    { setSubmitting, resetForm }: FormikHelpers<FormValues>
  ) => {
    const { status, data } = await userService.resetPWClient(`${values.email}`)
    const response = data.data;
    !response ? setErrorsServer(data.message) : setErrorsServer("");
    response && navigate(`verif/${response.client.email}`)
  };
  return (
    <CardPage
      icon={<Interogation />}
      text={t('forgetPassword.initPw.subTitle')}
      title={t('forgetPassword.initPw.title')}
      image={<PicturesList />}
    >
      {generateForm({
        initialValues,
        validationSchema: forgotSchema,
        fields,
        loading: loading,
        button: `${t('forgetPassword.init')}`,
        buttonAnnuler: `${t('Annuler')}`,
        onSubmit,
      })}
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        <Or>Or</Or>
        <ButtonTertiary name="number" type="button">
          {t('forgetPassword.useMyPhone')}
        </ButtonTertiary>
      </div>
    </CardPage>
  );
};
export default ForgotPasswordPage;
