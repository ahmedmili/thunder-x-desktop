import * as Yup from "yup";
import { useAppDispatch } from "../Redux/store";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { usersErrors, usersLoding } from "../Redux/slices/users";
import InputForm from "../components/Input-form/InputForm";
import CardPage from "../components/card-page/CardPage";
import PicturesList from "../components/picture-list/PicturesList";
import Interogation from "../assets/icons/Interogation";
import { FormValues, generateForm } from "../utils/formUtils";
import { FormikHelpers } from "formik";
import Or from "../components/or/Or";
import ButtonTertiary from "../components/button-tertiary/ButtonTertiary";

const ForgotPasswordPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const errorsServer = useSelector(usersErrors);
  const loading = useSelector(usersLoding);

  const fields = [
    {
      type: "email",
      name: "email",
      label: "Email",
      placeholder: "Enter ici",
      id: "email",
      column: "fill",
      errorsServer:
        errorsServer && errorsServer.message ? errorsServer.message : "",
      component: InputForm,
    },
  ];

  const forgotSchema = Yup.object().shape({
    email: Yup.string().required().email().label("Email"),
  });

  const initialValues = {
    email: "",
  };
  const onSubmit = async (
    values: FormValues,
    { setSubmitting, resetForm }: FormikHelpers<FormValues>
  ) => {
  };
  return (
    <CardPage
      icon={<Interogation />}
      text="Entrez votre adresse e-mail et nous vous enverrons un lien pour réinitialiser votre mot de passe"
      title="Mot de passe oublié ?"
      image={<PicturesList />}
    >
      {generateForm({
        initialValues,
        validationSchema: forgotSchema,
        fields,
        loading: loading,
        button: "Réinitialiser",
        buttonAnnuler: "Annuler",
        onSubmit,
      })}
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        <Or>Or</Or>
        <ButtonTertiary name="number" type="button">
          Utilisé mon numéro
        </ButtonTertiary>
      </div>
    </CardPage>
  );
};
export default ForgotPasswordPage;
