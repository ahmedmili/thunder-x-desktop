import {
  Box,
  IconButton,
  InputAdornment,
  Container,
  Divider,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { object, string, TypeOf } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from '../components/FormInput/FormInput';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LoadingButton as _LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';
import backPic from '../assets/backPic.jpg';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { setUser } from '../Redux/slices/user/userSlice';
import { useAppDispatch } from '../Redux/store';
import { HomeOutlined, Visibility, VisibilityOff } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

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
      {'  '}
      {t('home')}
    </LinkItem>
  );
};
const ApiEndpoint = import.meta.env.VITE_SERVER_ENDPOINT;
const API_URL = `${ApiEndpoint}/loginClient`;

const loginSchema = object({
  email: string()
    .min(1, 'Email address is required')
    .email('Email Address is invalid'),
  password: string()
    .min(1, 'Password is required')
    .min(8, 'Password must be more than 8 characters')
    .max(32, 'Password must be less than 32 characters'),
});

export type LoginInput = TypeOf<typeof loginSchema>;

const LoginPage = () => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const methods = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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

  const onSubmitHandler: SubmitHandler<LoginInput> = async (values) => {
    console.log('Form submitted');
    try {
      const response = await axios.post(API_URL, {
        email: values.email,
        password: values.password,
      });
      const { token, user } = response.data.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userId', user.id.toString());
      localStorage.setItem('user', JSON.stringify(user));
      dispatch(setUser(user));
      toast.success('You successfully logged in');
      navigate('/'); // Redirect to the home page
    } catch (error: any) {
      if (error.response) {
        if (Array.isArray(error.response.data.error)) {
          error.response.data.error.forEach((el: any) =>
            toast.error(el.message, {
              position: 'top-right',
            })
          );
        } else {
          toast.error(error.response.data.message, {
            position: 'top-right',
          });
        }
      } else {
        toast.error('Something went wrong. Please try again.', {
          position: 'top-right',
        });
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

  return (
    <Container
      maxWidth={false}
      sx={{
        display: 'flex',
        justifyContent: 'right',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: 'white',
        backgroundImage: `url(${backPic})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: '50%',
      }}>
      <Box
        width='505px'
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          padding: '10%',
        }}>
        <FormProvider {...methods}>
          <Box
            component='form'
            onSubmit={handleSubmit(onSubmitHandler)}
            noValidate
            autoComplete='off'
            maxWidth='30rem'
            width='100%'
            sx={{
              backgroundColor: '#ffffff',
              p: { xs: '1rem', sm: '2rem' },
              borderRadius: 3,
              width: '505px',
              height: '672px',
            }}>
            <HomePageLink />
            <Typography
              textAlign='left'
              component='h1'
              sx={{
                color: '#000000',
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '25px',
                lineHeight: '38px',
              }}>
              {t('login')}
            </Typography>
            <Typography
              variant='body1'
              component='h2'
              sx={{
                color: '#000000',
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: '300',
                fontSize: '16px',
                lineHeight: '24px',
                paddingBottom: '15px',
              }}>
              {t('ifYouHaveAnAccount')}
            </Typography>
            <FormInput
              name='email'
              placeholder={t('emailAddress') || 'Email'}
              type='email'
              label={''}
              sx={{
                backgroundColor: '#E2E1E1',
                borderRadius: '5px',
              }}
            />
            <FormInput
              name='password'
              placeholder={t('password') || 'Password'}
              type={showPassword ? 'text' : 'password'}
              label={''}
              sx={{
                backgroundColor: '#E2E1E1',
                borderRadius: '5px',
              }}
              inputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      sx={{
                        marginRight: '1%',
                      }}
                      onClick={() => setShowPassword(!showPassword)}
                      edge='end'>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Typography
              sx={{
                fontSize: '0.9rem',
                mb: '1rem',
                padding: '15px',
                fontFamily: 'Poppins',
                fontStyle: 'normal',
              }}>
              {t('noAccount')} &nbsp;&nbsp;
              <LinkItem
                to='/register'
                sx={{
                  color: '#EDC72F',
                  fontWeight: '500',
                  fontFamily: 'Poppins',
                  fontStyle: 'normal',
                }}>
                {t('createOne')}
              </LinkItem>
            </Typography>
            <LoadingButton
              variant='contained'
              sx={{ mt: 1 }}
              fullWidth
              disableElevation
              type='submit'>
              {t('login')}
            </LoadingButton>
            <div style={{ padding: '15px' }}>
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  console.log(credentialResponse);
                }}
                onError={() => {
                  console.log('Login Failed');
                }}
              />
            </div>
            <Divider sx={{ padding: '5px' }} />
            <Typography
              sx={{
                fontSize: '0.9rem',
                mb: '1rem',
                padding: '15px',
                fontFamily: 'Poppins',
                fontStyle: 'normal',
              }}>
              {t('need_account')} {'  '}
              <LinkItem
                to='/register'
                sx={{
                  color: '#EDC72F',
                  fontWeight: '500',
                  fontFamily: 'Poppins',
                  fontStyle: 'normal',
                }}>
                {t('signup_url_here')}
              </LinkItem>
            </Typography>
          </Box>
        </FormProvider>
      </Box>
    </Container>
  );
};

export default LoginPage;
