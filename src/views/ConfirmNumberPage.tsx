import { FormikHelpers } from "formik";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { verifysmsAction } from "../Redux/slices/verifysms";
import { useAppDispatch } from "../Redux/store";
import Confirm from "../assets/icons/Confirm";
import CardPage from "../components/card-page/CardPage";
import InputNumber from "../components/input-number/InputNumber";
import PicturesList from "../components/picture-list/PicturesList";
import { FormValues, generateForm } from "../utils/formUtils";
import { userService } from "../services/api/user.api";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

const ConfirmNumber = () => {

  const { userId } = useParams()
  const [errorsServer, setErrorsServer] = useState<string>('');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation()

  const sendSMS = async () => {
    try {
      const { status, data } = await userService.resendSMS(parseInt(userId!))
      // setErrorsServer(`${t('auth.verifSMS.SUCCESS_RESEND')}`)
      toast.success(`${t('auth.verifSMS.SUCCESS_RESEND')}`)
      console.log(data)
    } catch {
      // setErrorsServer(`${t('auth.verifSMS.ERROR_RESEND')}`)
      toast.error(`${t('auth.verifSMS.ERROR_RESEND')}`)
    }
  }

  useEffect(() => {
    sendSMS()
  }, [])
  const fields = [
    {
      type: "code",
      name: "num",
      label: "",
      placeholder: "",
      id: "num",
      component: InputNumber,
      errorsServer: errorsServer

    },
  ];

  const confirmSchema = Yup.object().shape({
    num1: Yup.number(),
    num2: Yup.number(),
    num3: Yup.number(),
    num4: Yup.number(),
    num5: Yup.number(),
    num6: Yup.number(),
  });

  const initialValues = {
    num1: "",
    num2: "",
    num3: "",
    num4: "",
    num5: "",
    num6: "",
  };
  const onSubmit = async (
    values: FormValues,
    { setSubmitting, resetForm }: FormikHelpers<FormValues>
  ) => {
    try {
      const { num1, num2, num3, num4, num5, num6 } = values;
      const code = num1! + num2 + num3 + num4 + num5 + num6;
      const response = await dispatch(verifysmsAction(Number(userId!), code));
      const { success } = response?.data;
      if (success) {
        setSubmitting(false);
        resetForm();
        navigate("/welcome");
      }
      setSubmitting(false);
    } catch (error) {
      setSubmitting(false);
    }
  };
  return (
    <CardPage
      icon={<Confirm />}
      title={t('auth.verifSMS.page')}
      text={t('auth.verifSMS.page.desc')}
      image={<PicturesList />}
    >
      {generateForm({
        initialValues,
        validationSchema: confirmSchema,
        fields,
        loading: false,
        button: `${t('Envoyer')}`,
        onSubmit,
        resendSMS: sendSMS,
      })}
    </CardPage>
  );
};
export default ConfirmNumber;
