import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import { toast } from "react-toastify";

import { AppBar, Box, Container, Toolbar, Typography } from "@mui/material";
import { LoadingButton as _LoadingButton } from "@mui/lab";

import PinDropIcon from "@mui/icons-material/PinDrop";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LogoutIcon from "@mui/icons-material/Logout";
import { ViewList, ViewListRounded, WidgetsRounded } from "@mui/icons-material";

import icon from "../../assets/icon.png";
import pub from "../../assets/home/images.jpg";

import { logout } from "../../Redux/slices/user/userSlice";
import { useEffect, useState } from "react";
// import CartPage from '../../views/cart/cart.page';
import { LanguageSelector } from "../languageSelector/languageSelector";
import { useTranslation } from "react-i18next";
import "./header.css";
import { localStorageService } from "../../services/localStorageService";
import Switches from "../toggleSwitch/toggleSwitch";
import SearchBar from "../searchBar/searchBar";
import Map from "../Location/Location";

const googleMapKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const Header = () => {
  const logged_in = localStorageService.getUserToken() !== null;
  const userItem = localStorageService.getUser();

  const user = userItem ? JSON.parse(userItem) : null;
  const firstname = user ? user.firstname : null;

  const cartItems = useAppSelector((state) => state.cart.items);
  const location = useAppSelector((state) => state.location.position);
  const isAuthenticated = useAppSelector(
    (state) => state.userState.isAuthenticated
  );

  const [showCart, setShowCart] = useState(false); // Add state variable for showing/hiding the cart
  const [showMap, setShowMap] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { t } = useTranslation();
  const onLogoutHandler = async () => {
    try {
      // Clear the user data from the state and the localStorage items associated with the user
      dispatch(logout());

      // Navigate to the login page
      navigate("/");
    } catch (error: any) {
      // Handle any errors that occur during the logout process
      if (Array.isArray(error.data.error)) {
        error.data.error.forEach((el: any) =>
          toast.error(el.message, {
            position: "top-right",
          })
        );
      } else {
        toast.error(error.data.message, {
          position: "top-right",
        });
      }
    }
  };

  const handleCart = async () => {
    setShowCart(!showCart); // Toggle the state of showCart
  };

  const handleCommand = async () => {
    navigate("/track-order");
  };

  useEffect(() => {
    if (showCart) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showCart]);

  return (
    <div className="header-container">
      <div className="head1">
        <div className="demi-cercle"></div>
      </div>
      <div id="header-app-bar1">
        {/*  Thunder logo section  */}

        <Box className="head2">
          <div className="logo-container" onClick={() => navigate("/")}>
            <img src={icon} alt="icon"></img>
          </div>

          <div className="header-app-bar2">
            <div className="header-message">
              <p className="header-message-syle1">
                {" "}
                Nous &nbsp;
                <span className="header-message-syle2">livrons</span>
              </p>
              <p className="header-message-syle1">
                {" "}
                plus que de la &nbsp;
                <span className="header-message-syle2">nourriture</span> .
              </p>
            </div>
            <div className="Switches">
              <Switches />
            </div>

            <Box
              className="header-localisation-message-container"
              onClick={() => setShowMap(true)}
            >
              <h3>
                <span className="localisation-icon">
                  <PinDropIcon />
                </span>
                {location
                  ? `${location?.coords.label} ! ${t("clickToChange")}`
                  : t("no_location_detected")}
              </h3>
            </Box>

            <SearchBar placeholder={t("search_placeholder")} />
          </div>
        </Box>

        {/* shopping cart section */}
        {/* <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}> */}
        {/* order button */}
        {/* {isAuthenticated && (
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
            )} */}

        {/* <div
              className='cart-logo-container'
              onClick={handleCart}>
              <div className='cart-logo'>
                <ShoppingCartIcon style={{ color: '#000000' }} />
                {cartItems.length > 0 && (
                  <span style={{ color: '#000000' }}>({cartItems.length})</span>
                )}
              </div>
              <div style={{ color: '#000000' }}>{t('cartPage.yourCart')}</div>
            </div> */}

        {/* cart button */}
        {/* {showCart && (
              <div className='cart-container'
                onClick={() => setShowCart(false)}>
                <div
                  className='cart'
                  onClick={(e) => e.stopPropagation()}>
                  <CartPage />
                </div>
              </div>
            )} */}

        {/* </Box> */}

        {/* Language Selector */}
        {/* <div className='LanguageSelector-container'>
            <LanguageSelector />
          </div> */}

        <Box className="head3">
          {/* login register buttons  */}
          <div className="app-bar">
            {!logged_in && (
              <>
                <div
                  onClick={() => navigate("/register")}
                  className="LoadingButton"
                >
                  {t("signup")}
                </div>
                <div
                  onClick={() => navigate("/login")}
                  className="LoadingButton"
                >
                  {t("login")}
                </div>
              </>
            )}
          </div>

          <div className="image-builder"></div>

          {/* welcome message */}
          {/* {logged_in && (
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
           </div>
            )} */}
        </Box>
        {showMap && (
          <div className="map-overlay" onClick={() => setShowMap(false)}>
            <div onClick={(e) => e.stopPropagation()}>
              <Map apiKey={googleMapKey} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
