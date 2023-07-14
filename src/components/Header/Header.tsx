import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../Redux/store';
import { toast } from 'react-toastify';
import { LoadingButton as _LoadingButton } from '@mui/lab';
import { logout } from '../../Redux/slices/user/userSlice';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useEffect, useState } from 'react';
import CartPage from '../../views/cart/cart.page';
import LogoutIcon from '@mui/icons-material/Logout';
import icon from '../../assets/icon.png';
import { LanguageSelector } from '../languageSelector/languageSelector';
import { useTranslation } from 'react-i18next';
import { ViewList, ViewListRounded, WidgetsRounded } from '@mui/icons-material';
import './header.css'
import { localStorageService } from '../../services/localStorageService';


const Header = () => {
  const logged_in = localStorageService.getUserToken() !== null;
  const userItem = localStorageService.getUser();
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
        <Toolbar className='Toolbar'>
          {/*  Thunder logo section  */}
          <Box className="logo-container" onClick={() => navigate('/')} >
            <img
              src={icon}
              alt='icon'></img>
            <Typography variant='h6' sx={{ color: '#000000' }}>
              Thunder Express
            </Typography>
          </Box>
          {/* shopping cart section */}
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            {/* order button */}
            {isAuthenticated && (
              <div className='order-container'
                onClick={handleCommand}>
                <div className='order-icon'
                >
                  <WidgetsRounded style={{ color: '#000000' }} />
                </div>
                <div style={{ color: '#000000' }}>
                  {t('cartPage.yourCommands')}
                </div>
              </div>
            )}

            <div
              className='cart-logo-container'
              onClick={handleCart}>
              <div className='cart-logo'>
                <ShoppingCartIcon style={{ color: '#000000' }} />
                {cartItems.length > 0 && (
                  <span style={{ color: '#000000' }}>({cartItems.length})</span>
                )}
              </div>
              <div style={{ color: '#000000' }}>{t('cartPage.yourCart')}</div>
            </div>

            {/* cart button */}
            {showCart && (
              <div className='cart-container'
                onClick={() => setShowCart(false)}>
                <div
                  className='cart'
                  onClick={(e) => e.stopPropagation()}>
                  <CartPage />
                </div>
              </div>
            )}
          </Box>
          {/* Language Selector */}
          <div className='LanguageSelector-container'>
            <LanguageSelector />
          </div>

          <Box display='flex'>
            {/* login register buttons  */}
            {!logged_in && (
              <>
                <div
                  onClick={() => navigate('/register')}
                  className='LoadingButton'
                >
                  {t('signup')}
                </div>
                <div
                  onClick={() => navigate('/login')}
                  className='LoadingButton'
                >
                  {t('login')}
                </div>
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
                  className='logout-icon'
                  style={{
                    height: '40px',
                    width: '40px',
                  }}

                  onClick={onLogoutHandler}
                />
              </>
            )}
            {logged_in && user?.role === 'admin' && (
              <div
                onClick={() => navigate('/admin')}
                className='LoadingButton'
              >
                Admin
              </div>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
