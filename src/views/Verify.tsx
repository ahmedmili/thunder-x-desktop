import { FormikHelpers } from "formik";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { setUserCredentials } from "../Redux/slices/userSlice";
import { usersLoding } from "../Redux/slices/users";
import InputForm from "../components/Input-form/InputForm";
import CardPage from "../components/card-page/CardPage";
import InputNumber from "../components/input-number/InputNumber";
import PicturesList from "../components/picture-list/PicturesList";
import { userService } from "../services/api/user.api";
import { IUser } from "../services/types";
import { FormValues, generateForm } from "../utils/formUtils";
import Cadenas from "../assets/icons/Cadenas ";

const Verify = () => {

  const loading = useSelector(usersLoding);
  const { t } = useTranslation()
  const param = useParams()
  const email = param.email;
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showResetForm, setShowResetForm] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [errorsServer, setErrorsServer] = useState<string>('');
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const verifySmsCode = async (
    values: FormValues,

  ) => {
    const codeArray = [
      values.num1,
      values.num2,
      values.num3,
      values.num4,
      values.num5,
      values.num6
    ];

    const code = codeArray.join('')
    if (code.length === 6) {
      const { status, data } = await userService.verifySmsCode(`${email}`, code)
      const response = data.data;
      !response ? setErrorsServer(`${t('forgetPassword.initPw.invalideCode')}`) : setShowResetForm(true);
    }
  }

  const saveUser = (user: IUser, token: string) => {
    const UserCredentials = { user, token }
    dispatch(setUserCredentials(UserCredentials))
    navigate('/')
  }

  const onSubmit = async (
    values: FormValues,
    { setSubmitting, resetForm }: FormikHelpers<FormValues>
  ) => {
    const { status, data } = await userService.updatePWClient(`${email}`, `${values.confirm_password}`, `${values.password}`)
    const response = data.data;
    response ? saveUser(response.user, response.token) : setErrorsServer(data.message);
  };

  const ontoggleShowConfirmPassword = () => {
    setShowConfirmPassword((prevShowPassword) => !prevShowPassword);
  };

  const ontoggleShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const codeValues = {
    num1: "",
    num2: "",
    num3: "",
    num4: "",
    num5: "",
    num6: "",
  };

  const initialValues = {
    password: "",
    confirm_password: "",
  };

  const codeFields = [
    {
      type: "code",
      name: "num",
      label: "",
      placeholder: "",
      id: "num",
      component: InputNumber,
      errorsServer: errorsServer
    },
  ]
  const fields = [
    {
      type: !showPassword ? "password" : "text",
      name: "password",
      label: t('forgetPassword.initPw.newPassword'),
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
  ];


  const forgotSchema = Yup.object().shape({
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
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
  });
  const forgotCodeSchema = Yup.object().shape({
    num1: Yup.number(),
    num2: Yup.number(),
    num3: Yup.number(),
    num4: Yup.number(),
    num5: Yup.number(),
    num6: Yup.number(),
  });

  return (

    <div>
      <CardPage
        icon={<Cadenas />}
        text={t('forgetPassword.subTitle')}
        title={t('forgetPassword.title')}
        image={<PicturesList />}
      >
        {!showResetForm && generateForm({
          initialValues: codeValues,
          validationSchema: forgotCodeSchema,
          fields: codeFields,
          loading: loading,
          button: `${t('Verifier')}`,
          buttonAnnuler: ``,
          onSubmit: verifySmsCode,
        })}

        {showResetForm && generateForm({
          initialValues,
          validationSchema: forgotSchema,
          fields,
          loading: loading,
          button: `${t('Enregistrer')}`,
          buttonAnnuler: `${t('Annuler')}`,
          ontoggleShowPassword,
          ontoggleShowConfirmPassword,
          onSubmit,
        })}
      </CardPage>

    </div>
  )
};
export default Verify;
