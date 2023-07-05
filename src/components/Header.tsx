import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../Redux/store';
import { toast } from 'react-toastify';
import { LoadingButton as _LoadingButton } from '@mui/lab';
import { logout } from '../Redux/slices/user/userSlice';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useEffect, useState } from 'react';
import CartPage from '../views/cart.page';
import LogoutIcon from '@mui/icons-material/Logout';
import icon from '../assets/icon.png';
import { LanguageSelector } from './languageSelector';
import { useTranslation } from 'react-i18next';
import { ViewList, ViewListRounded, WidgetsRounded } from '@mui/icons-material';

const LoadingButton = styled(_LoadingButton)`
  padding: 0.4rem;
  background-color: #2db2b1;
  border: 1px solid #fffefe;
  border-radius: 20px;
  color: #fffefe;
  font-weight: 500;
  width: 144px;
  height: 40px;

  &:hover {
    background-color: #2db2b1;
    transform: translateY(-2px);
  }
`;

const Header = () => {
  const logged_in = localStorage.getItem('token') !== null;
  const userItem = localStorage.getItem('user');
  const user = userItem ? JSON.parse(userItem) : null;
  const firstname = user ? user.firstname : null;
  const [showCart, setShowCart] = useState(false); // Add state variable for showing/hiding the cart
  const cartItems = useAppSelector((state) => state.cart.items);
  const isAuthenticated = useAppSelector(
    (state) => state.userState.isAuthenticated
  );

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const onLogoutHandler = async () => {
    try {
      // Clear the user data from the state and the localStorage items associated with the user
      dispatch(logout());

      // Navigate to the login page
      navigate('/');
    } catch (error: any) {
      // Handle any errors that occur during the logout process
      if (Array.isArray(error.data.error)) {
        error.data.error.forEach((el: any) =>
          toast.error(el.message, {
            position: 'top-right',
          })
        );
      } else {
        toast.error(error.data.message, {
          position: 'top-right',
        });
      }
    }
  };

  const handleCart = async () => {
    setShowCart(!showCart); // Toggle the state of showCart
  };

  const handleCommand = async () => {
    navigate('/track-order');
  };

  useEffect(() => {
    if (showCart) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [showCart]);

  return (
    <AppBar
      position='static'
      sx={{
        backgroundColor: '#ffffff',
        boxShadow: 1,
        display: 'flex',
        justifyContent: 'center',
      }}>
      <Container maxWidth='lg'>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box
            onClick={() => navigate('/')}
            style={{
              display: 'flex',
              flexDirection: 'row',
              cursor: 'pointer',
            }}>
            <img
              src={icon}
              style={{ height: '30px', marginRight: '1rem' }}></img>
            <Typography variant='h6' sx={{ color: '#000000' }}>
              Thunder Express
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            {isAuthenticated && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  marginRight: '8%',
                }}
                onClick={handleCommand}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                  }}>
                  <WidgetsRounded style={{ color: '#000000' }} />
                </div>
                <div style={{ color: '#000000' }}>
                  {t('cartPage.yourCommands')}
                </div>
              </div>
            )}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
              }}
              onClick={handleCart}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                }}>
                <ShoppingCartIcon style={{ color: '#000000' }} />
                {cartItems.length > 0 && (
                  <span style={{ color: '#000000' }}>({cartItems.length})</span>
                )}
              </div>
              <div style={{ color: '#000000' }}>{t('cartPage.yourCart')}</div>
            </div>
            {showCart && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: '100vw',
                  height: '100vh',
                  zIndex: 998,
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                }}
                onClick={() => setShowCart(false)}>
                <div
                  className='cart'
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    position: 'absolute',
                    top: '8%',
                    backgroundColor: 'white',
                    zIndex: 999,
                    boxShadow: '1px 2px 4px 2px rgba(0,0,0,0.1)',
                    maxHeight: '85vh',
                    overflow: 'auto',
                  }}
                  onClick={(e) => e.stopPropagation()}>
                  <CartPage />
                </div>
              </div>
            )}
          </Box>

          <div
            style={{
              marginLeft: 'auto',
              marginRight: '1.5rem',
              paddingTop: '0.5rem',
              paddingBottom: '0.5rem',
            }}>
            <LanguageSelector />
          </div>
          <Box display='flex'>
            {!logged_in && (
              <>
                <LoadingButton
                  sx={{ mr: 2 }}
                  onClick={() => navigate('/register')}>
                  {t('signup')}
                </LoadingButton>
                <LoadingButton onClick={() => navigate('/login')}>
                  {t('login')}
                </LoadingButton>
              </>
            )}
            {logged_in && (
              <>
                <div
                  style={{
                    color: '#00000e',
                    padding: '0.5rem',
                  }}>
                  {t('welcome')}
                  {firstname}
                </div>

                <LogoutIcon
                  style={{
                    color: '#fffffe',
                    cursor: 'pointer',
                    padding: '0.5rem',
                    backgroundColor: '#2db2b1',
                    border: '1px solid #fffefe',
                    borderRadius: '10px',
                    height: '40px',
                    width: '40px',
                  }}
                  onClick={onLogoutHandler}
                />
              </>
            )}
            {logged_in && user?.role === 'admin' && (
              <LoadingButton
                sx={{ backgroundColor: '#fffefe', ml: 2 }}
                onClick={() => navigate('/admin')}>
                Admin
              </LoadingButton>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
