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
import FormInput from '../../components/FormInput/FormInput';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';

import "./login.page.css"
import { setUser } from '../../Redux/slices/user/userSlice';
import { useAppDispatch } from '../../Redux/store';
import { HomeOutlined, Visibility, VisibilityOff } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { userService } from '../../services/api/user.api';
import { localStorageService } from '../../services/localStorageService';


const HomePageLink = () => {
  const { t } = useTranslation();
  return (
    <Link to='/' className='link-item home'>
      <HomeOutlined sx={{ position: 'relative', top: '5px' }} />
      {'  '}
      {t('home')}
    </Link>
  );
};


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
    try {
      const { token, user } = await userService.loginUser(values);
      localStorageService.setUserCredentials(user,token);
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
    <Container className='login-container ' maxWidth={false}>
      <div className="box-container">
        <FormProvider {...methods}>
          <Box
            className='form-container'
            component='form'
            onSubmit={handleSubmit(onSubmitHandler)}
            noValidate
            autoComplete='off'>
            <HomePageLink />

            <Typography
              className='login-text'
              component='h1'
            >
              {t('login')}
            </Typography>
            <Typography
              className='submessage'
              variant='body1'
              component='h2'
              >
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

            <Typography className='noAccount-text'>
              {t('noAccount')} &nbsp;&nbsp;
              <Link to='/register' className='link-item register'>
                {t('createOne')}
              </Link>
            </Typography>
            <LoadingButton
              variant='contained'
              sx={{ mt: 1 }}
              fullWidth
              disableElevation
              className='loading-button'
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
            {/* <Divider sx={{ padding: '5px' }} />
            <Typography
              sx={{
                // fontSize: '0.9rem',
                // mb: '1rem',
                // padding: '15px',
                // fontFamily: 'Poppins',
                // fontStyle: 'normal',
              }}>
              {t('need_account')} {'  '}
              <Link
                to='/register'
                className='link-item'
              // sx={{
              //   color: '#EDC72F',
              //   fontWeight: '500',
              //   fontFamily: 'Poppins',
              //   fontStyle: 'normal',
              // }}
              >
                {t('signup_url_here')}
              </Link>
            </Typography> */}
          </Box>
        </FormProvider>
      </div>
    </Container>
  );
};

export default LoginPage;
