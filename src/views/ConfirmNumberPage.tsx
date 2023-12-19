import { FormikHelpers } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { verifysmsAction } from "../Redux/slices/verifysms";
import { useAppDispatch } from "../Redux/store";
import Confirm from "../assets/icons/Confirm";
import CardPage from "../components/card-page/CardPage";
import InputNumber from "../components/input-number/InputNumber";
import PicturesList from "../components/picture-list/PicturesList";
import { FormValues, generateForm } from "../utils/formUtils";
const ConfirmNumber = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const fields = [
    {
      type: "code",
      name: "num",
      label: "",
      placeholder: "",
      id: "num",
      component: InputNumber,
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
      const response = await dispatch(verifysmsAction(code));
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
  const resendSms = async () => { };
  return (
    <CardPage
      icon={<Confirm />}
      title="Vérifier votre compte"
      text="Nous venons de vous envoyer un code de 6 chiffres a votre
    numéro"
      image={<PicturesList />}
    >
      {generateForm({
        initialValues,
        validationSchema: confirmSchema,
        fields,
        loading: false,
        button: "Envoyer",
        onSubmit,
      })}
    </CardPage>
  );
};
export default ConfirmNumber;
