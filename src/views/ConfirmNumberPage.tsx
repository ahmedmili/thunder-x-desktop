import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../Redux/store";
import { FormikHelpers } from "formik";
import CardPage from "../components/card-page/CardPage";
import PicturesList from "../components/picture-list/PicturesList";
import { FormValues, generateForm } from "../utils/formUtils";
import InputNumber from "../components/input-number/InputNumber";
import Confirm from "../assets/icons/Confirm";
import { verifysmsAction } from "../Redux/slices/verifysms";
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
  const resendSms = async () => {};
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

/* import { Box, Container, Divider, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { object, number, TypeOf } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "../../components/FormInput/FormInput";
import { Link, useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import "react-toastify/dist/ReactToastify.css";
import { useAppDispatch } from "../../Redux/store";
import { HomeOutlined } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import "./confirmNumber.css";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";

const ApiEndpoint = import.meta.env.VITE_SERVER_ENDPOINT;
const API_URL = `${ApiEndpoint}/signupclient`;

const confirmSchema = object({
  num1: number().min(0).max(1),
  num2: number().min(0).max(1),
  num3: number().min(0).max(1),
  num4: number().min(0).max(1),
  num5: number().min(0).max(1),
  num6: number().min(0).max(1),
});

const HomePageLink = () => {
  const { t } = useTranslation();
  return (
    <Link className="Link" to="/">
      <HomeOutlined sx={{ position: "relative", top: "5px" }} />
      {t("home")}
    </Link>
  );
};

export type ConfirmInput = TypeOf<typeof confirmSchema>;

const confirmNumber = () => {
  const methods = useForm<ConfirmInput>({
    resolver: zodResolver(confirmSchema),
  });
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [timerDuration] = useState(30); // Timer duration in seconds
  const [remainingTime, setRemainingTime] = useState(timerDuration);
  const [timerActive, setTimerActive] = useState(false);

  // Function to start the timer
  const startTimer = () => {
    setRemainingTime(timerDuration);
    setTimerActive(true);
  };

  // Update the remaining time every second
  useEffect(() => {
    let intervalId: any;

    if (timerActive) {
      intervalId = setInterval(() => {
        setRemainingTime((prevTime) => {
          const newTime = prevTime - 1;
          if (newTime === 0) {
            setTimerActive(false);
          }
          return newTime >= 0 ? newTime : 0;
        });
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [timerActive]);

  // Handle click on the "Resend code" button
  const handleResendCode = () => {
    // Check if the timer is not active
    if (!timerActive) {
      // Start the timer
      startTimer();
      // TODO: Add code to resend the verification code
      // You can add your logic to resend the verification code here
    } else {
    }
  };

  const {
    reset,
    handleSubmit,
    formState: { isSubmitSuccessful },
  } = methods;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful]);

  const handleInput = (
    event: React.ChangeEvent<HTMLInputElement>,
    nextFieldName: string
  ) => {
    const input = event.target;
    const { name, value } = input;
    input.value = value.slice(0, 1);

    // Remove any non-numeric characters from the input value
    const numericValue = value.replace(/[^0-9]/g, "");

    // Update the input value to the numeric value
    input.value = numericValue;

    if (numericValue !== "") {
      const nextField = document.getElementsByName(nextFieldName)[0];
      if (nextField) {
        nextField.focus();
      }
    }
  };

  useEffect(() => {
    // Disable scrolling when the component mounts
    document.body.style.overflow = "hidden";

    // Enable scrolling when the component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const onSubmitConfirm = () => {
    console.log("entered onSubmitConfirm");
  };

  return (
    <Container maxWidth={false} className="confirm-container">
      <Box width="505px" className="confirm-box">
        <FormProvider {...methods}>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmitConfirm)}
            noValidate
            autoComplete="off"
            className="confirm-form"
          >
            <HomePageLink />
            <Typography
              textAlign="left"
              component="h1"
              className="confirm-title"
            >
              Verification Code
            </Typography>
            <Typography
              variant="body1"
              component="h2"
              className="confirm-description"
            >
              We sent you a 6 numbers code to your number, please type it here
              to confirm.
            </Typography>
            <div className="number-input">
              <FormInput
                name="num1"
                placeholder={"-"}
                label={""}
                onInput={(event: any) => handleInput(event, "num2")}
              />
              <FormInput
                name="num2"
                placeholder={"-"}
                label={""}
                onInput={(event: any) => handleInput(event, "num3")}
              />
              <FormInput
                name="num3"
                placeholder={"-"}
                label={""}
                inputProps={{ inputMode: "numeric", maxLength: 1 }}
                onInput={(event: any) => handleInput(event, "num4")}
              />
              <FormInput
                name="num4"
                placeholder={"-"}
                label={""}
                inputProps={{ inputMode: "numeric", maxLength: 1 }}
                onInput={(event: any) => handleInput(event, "num5")}
              />
              <FormInput
                name="num5"
                placeholder={"-"}
                label={""}
                inputProps={{ inputMode: "numeric", maxLength: 1 }}
                onInput={(event: any) => handleInput(event, "num6")}
              />
              <FormInput
                name="num6"
                placeholder={"-"}
                label={""}
                inputProps={{ inputMode: "numeric", maxLength: 1 }}
                onInput={(event: any) => handleInput(event, "btn")}
              />
            </div>
            <LoadingButton
              // className='LoadingButton'
              name="btn"
              variant="contained"
              className="confirm-loading-button"
              fullWidth
              disableElevation
              onClick={onSubmitConfirm}
              type="submit"
            >
              VERIFY
            </LoadingButton>
            <Divider className="confirm-divider" />
            <Typography className="confirm-resend-code">
              {timerActive ? (
                `Resend code in ${remainingTime} seconds`
              ) : (
                <span className="resend-code-link" onClick={handleResendCode}>
                  Resend code
                </span>
              )}
            </Typography>
          </Box>
        </FormProvider>
      </Box>
    </Container>
  );
};

export default confirmNumber;
 */
