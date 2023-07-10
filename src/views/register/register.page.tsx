import {
  Box,
  Container,
  Divider,
  IconButton,
  InputAdornment,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { object, string, TypeOf } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from '../../components/FormInput/FormInput';
import { Link, useNavigate } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';
import backPic from '../../assets/backPic.jpg';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { useAppDispatch } from '../../Redux/store';
import { registerUser, setUser } from '../../Redux/slices/user/userSlice';
import { HomeOutlined, Visibility, VisibilityOff } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './register.page.css'

const ApiEndpoint = import.meta.env.VITE_SERVER_ENDPOINT;
const API_URL = `${ApiEndpoint}/signupclient`;
import { userService } from '../../services/api/user.api';
import { localStorageService } from '../../services/localStorageService';

const registerSchema = object({
  firstname: string().min(1, 'Full name is required').max(100),
  lastname: string().min(1, 'Full last name is required').max(100),
  email: string()
    .min(1, 'Email address is required')
    .email('Email Address is invalid'),
  password: string()
    .min(1, 'Password is required')
    .min(6, 'Password must be more than 6 characters')
    .max(32, 'Password must be less than 32 characters'),
  passwordConfirm: string().min(1, 'Please confirm your password'),
  phone: string().min(8).max(8),
}).refine((data) => data.password === data.passwordConfirm, {
  path: ['passwordConfirm'],
  message: 'Passwords do not match',
});

const HomePageLink = () => {
  const { t } = useTranslation();
  return (
    <Link
      className='Link home' to='/' >
      <HomeOutlined sx={{ position: 'relative', top: '5px' }} />
      {t('home')}
    </Link>
  );
};

export type RegisterInput = TypeOf<typeof registerSchema>;

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const methods = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { handleSubmit } = methods;

  const handleRegister: SubmitHandler<RegisterInput> = async (values) => {
    console.log('Form submitted');
    try {
      const {token,user} = await userService.registerUser(values);
      localStorageService.setUserCredentials(user,token);
      dispatch(registerUser(user)); // dispatch the registerUser action with the user object
      // dispatch(setUser(user));
      toast.success('You successfully registered');
      navigate('/'); // Redirect to the home page
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 422) {
          error.response.data.errors.forEach((err: any) =>
            toast.error(err.message, {
              position: 'top-right',
            })
          );
        } else {
          toast.error('Network error occurred. Please try again.', {
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
    <Container maxWidth={false}className='containerr' >
      <Box
        className='form-container'>
        <FormProvider {...methods}>
          <Box
            className='form'
            component='form'
            onSubmit={handleSubmit(handleRegister)}
            noValidate
            autoComplete='off'
          >
            <HomePageLink />
            <Typography
              className='createAcc-text'
              textAlign='center'
              component='h1'
            >
              {t('createAcc')}
            </Typography>
            <Typography
              className='submessage'
              component='h2'
            >
              {t('createAccSubtitle')}
            </Typography>
            <FormInput
              name='firstname'
              placeholder={t('firstName') || 'First Name'}
              label={''}
              className='input-form'
            />
            <FormInput
              className='input-form'
              name='lastname'
              placeholder={t('Last Name') || 'Last Name'}
              label={''}
            />
            <FormInput
              className='input-form'
              name='email'
              placeholder={t('emailAddress') || 'Email Adress'}
              type='email'
              label={''}
            />
            <FormInput
              className='input-form'
              name='password'
              placeholder={t('password') || 'Password'}
              type={showPassword ? 'text' : 'password'}
              label={''}
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
            <FormInput
              className='input-form'
              name='passwordConfirm'
              placeholder={t('confirmPassword') || undefined}
              type={showPassword ? 'text' : 'password'}
              label={''}
            />

            <FormInput
              className='input-form'
              name='phone'
              placeholder={t('cartPage.phoneNumber') || undefined}
              type='text'
              label={''}
            />
            <LoadingButton
              className='LoadingButton'
              variant='contained'
              sx={{ mt: 1 }}
              fullWidth
              disableElevation
              type='submit'
              loading={methods.formState.isSubmitting}>
              {t('signup')}
            </LoadingButton>
            <Divider sx={{ padding: '5px' }} />
            <Typography sx={{ fontSize: '0.9rem', mb: '1rem' }}>
              {t('haveAcc')}
              <Link
                className='Link'
                to='/login'
              >
                {t('connectHere')}
              </Link>
            </Typography>
          </Box>
        </FormProvider>
      </Box>
    </Container>
  );
};

export default RegisterPage;
