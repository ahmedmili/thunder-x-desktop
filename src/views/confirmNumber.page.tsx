import { Box, Container, Divider, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { object, number, TypeOf } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from '../components/FormInput';
import { Link, useNavigate } from 'react-router-dom';
import { LoadingButton as _LoadingButton } from '@mui/lab';
import 'react-toastify/dist/ReactToastify.css';
import { useAppDispatch } from '../Redux/store';
import { HomeOutlined } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import './confirmNumber.css';
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';

const LoadingButton = styled(_LoadingButton)`
  padding: 0.6rem 0;
  background-color: #edc72f;
  color: #ffffff;
  font-weight: 500;
  border-radius: 12px;

  &:hover {
    background-color: #ebc22c;
    transform: translateY(-2px);
  }
`;

const LinkItem = styled(Link)`
  text-decoration: none;
  color: #2363eb;
  &:hover {
    text-decoration: underline;
  }
`;

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
    <LinkItem
      to='/'
      sx={{
        color: '#303030',
        fontWeight: '500',
        fontFamily: 'Poppins',
        fontStyle: 'normal',
        alignContent: 'center',
      }}>
      <HomeOutlined sx={{ position: 'relative', top: '5px' }} />
      {t('home')}
    </LinkItem>
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
    const numericValue = value.replace(/[^0-9]/g, '');

    // Update the input value to the numeric value
    input.value = numericValue;

    if (numericValue !== '') {
      const nextField = document.getElementsByName(nextFieldName)[0];
      if (nextField) {
        nextField.focus();
      }
    }
  };

  useEffect(() => {
    // Disable scrolling when the component mounts
    document.body.style.overflow = 'hidden';

    // Enable scrolling when the component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const onSubmitConfirm = () => {
    console.log('entered onSubmitConfirm');
  };

  return (
    <Container maxWidth={false} className='confirm-container'>
      <Box width='505px' className='confirm-box'>
        <FormProvider {...methods}>
          <Box
            component='form'
            onSubmit={handleSubmit(onSubmitConfirm)}
            noValidate
            autoComplete='off'
            maxWidth='30rem'
            width='100%'
            className='confirm-form'>
            <HomePageLink />
            <Typography
              textAlign='left'
              component='h1'
              className='confirm-title'>
              Verification Code
            </Typography>
            <Typography
              variant='body1'
              component='h2'
              className='confirm-description'>
              We sent you a 6 numbers code to your number, please type it here
              to confirm.
            </Typography>
            <div className='number-input'>
              <FormInput
                name='num1'
                placeholder={'-'}
                label={''}
                onInput={(event: any) => handleInput(event, 'num2')}
              />
              <FormInput
                name='num2'
                placeholder={'-'}
                label={''}
                onInput={(event: any) => handleInput(event, 'num3')}
              />
              <FormInput
                name='num3'
                placeholder={'-'}
                label={''}
                inputProps={{ inputMode: 'numeric', maxLength: 1 }}
                onInput={(event: any) => handleInput(event, 'num4')}
              />
              <FormInput
                name='num4'
                placeholder={'-'}
                label={''}
                inputProps={{ inputMode: 'numeric', maxLength: 1 }}
                onInput={(event: any) => handleInput(event, 'num5')}
              />
              <FormInput
                name='num5'
                placeholder={'-'}
                label={''}
                inputProps={{ inputMode: 'numeric', maxLength: 1 }}
                onInput={(event: any) => handleInput(event, 'num6')}
              />
              <FormInput
                name='num6'
                placeholder={'-'}
                label={''}
                inputProps={{ inputMode: 'numeric', maxLength: 1 }}
                onInput={(event: any) => handleInput(event, 'btn')}
              />
            </div>
            <LoadingButton
              name='btn'
              variant='contained'
              className='confirm-loading-button'
              fullWidth
              disableElevation
              onClick={() => onSubmitConfirm}
              type='submit'>
              VERIFY
            </LoadingButton>
            <Divider className='confirm-divider' />
            <Typography className='confirm-resend-code'>
              {timerActive ? (
                `Resend code in ${remainingTime} seconds`
              ) : (
                <span className='resend-code-link' onClick={handleResendCode}>
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