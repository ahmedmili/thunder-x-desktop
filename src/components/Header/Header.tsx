import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../Redux/store';
import { toast } from 'react-toastify';
import headerStyles from './header.module.scss'
import { Container, Row, Col } from "react-bootstrap"

import { LoadingButton as _LoadingButton } from "@mui/lab";

import PinDropIcon from "@mui/icons-material/PinDrop";


import icon from "../../assets/icon.png";
import pub from "../../assets/home/images.jpg";

import { logout } from "../../Redux/slices/userSlice";
import { useEffect, useState } from "react";
// import CartPage from '../../views/cart/cart.page';
import { useTranslation } from "react-i18next";
import { localStorageService } from "../../services/localStorageService";
import Switches from "../toggleSwitch/toggleSwitch";
import SearchBar from "../searchBar/searchBar";
import Map from "../Location/Location";
import { Box } from '@mui/material';

const googleMapKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const Header = () => {
  const logged_in = localStorageService.getUserToken() !== null;
  const userItem = localStorageService.getUser();

  const user = userItem ? JSON.parse(userItem) : null;
  const firstname = user ? user.firstname : null;

  const cartItems = useAppSelector((state) => state.cart.items);
  const location = useAppSelector((state) => state.location.position);
  
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
    <>
     <div className={headerStyles.head1}>
        <div className={headerStyles.demiCercle}>

        </div>
      </div>
    <Container className=' container-lg  container-xxl container-xl' fluid  >
      <Row className={headerStyles.headerContainer}>
        <Col >
          <Row>
            <Col className='col-8 col-sm-6' >
              <Box className={headerStyles.head2} >
                <div className={headerStyles.logoContainer} onClick={() => navigate('/')} >
                  <img src={icon} alt='icon' ></img >
                </div>
                <div className={headerStyles.headerAppBar2}>
                  <div className={headerStyles.headerMessage}>
                    <p className={headerStyles.headerMessageSyle1} > Nous &nbsp;
                      <span className={headerStyles.headerMessageSyle2}>
                        livrons
                      </span>
                    </p>
                    <p className={headerStyles.headerMessageSyle1}> plus que de la &nbsp;
                      <span className={headerStyles.headerMessageSyle2}>
                        nourriture
                      </span> .
                    </p>
                  </div>
                  <div className={headerStyles.Switches}>
                    <Switches />
                  </div>
                  <Box className={headerStyles.headerLocalisationMessageContainer} onClick={() => setShowMap(true)} >
                    <h3>
                      <span className={headerStyles.localisationIcon} >
                        <PinDropIcon />
                      </span>
                      {location
                        ? `${location?.coords.label} ! ${t('clickToChange')}`
                        : t('no_location_detected')}
                    </h3>
                  </Box>
                  <SearchBar placeholder={t('search_placeholder')} />

                </div>
              </Box>
            </Col>

            <Col className='col-4 col-sm-6'>
              <Box className={headerStyles.head3}>
                {/* login register buttons  */}
                  {!logged_in  ?  (
                    <>
                <div className={headerStyles.appBar}>
                      <div
                        onClick={() => navigate('/register')}
                        className={headerStyles.LoadingButton}
                      >
                        {t('signup')}
                      </div>
                      <div
                        onClick={() => navigate('/login')}
                        className={headerStyles.LoadingButton}
                      >
                        {t('login')}
                      </div>
                </div>
                    </>
                  ) : <>
                    <div className="app-bar">
                      <div
                        onClick={onLogoutHandler}
                        className={headerStyles.LoadingButton}
                      >
                        {t('signout')}
                      </div>
                </div>
                  </>
                }
                <div className={headerStyles.imageBuilder}>
                    <img src={pub} alt="header photo" />
                </div>
              </Box>
            </Col>
          </Row>
        </Col>
      </Row>
      {/*  Thunder logo section  */}
      {showMap && (
        <div
          className="map-overlay"
          onClick={() => setShowMap(false)}>
          <div
            onClick={(e) => e.stopPropagation()}>
            <Map apiKey={googleMapKey} />
          </div>
        </div>
      )}
    </Container>
     
    </>
  );
};

export default Header;

      