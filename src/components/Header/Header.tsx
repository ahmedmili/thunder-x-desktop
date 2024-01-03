import { Col, Container, Row } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../Redux/store';
import './header.scss';

import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Box } from '@mui/material';
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { localStorageService } from "../../services/localStorageService";
import Map from "../Location/Location";
import Switches from "../toggleSwitch/toggleSwitch";

import { useSelector } from "react-redux";
import { useLocation } from 'react-router-dom';
import {
  regionHomeSelector
} from "../../Redux/slices/home";
import LocationsearchBar from "../LocationsearchBar/LocationsearchBar";
import { UserCart } from '../UserCart/UserCart';
import { Cart } from '../cart/cart';
import SearchBar from "../searchBar/searchBar";

const Header = () => {
  const msg_notifs = useAppSelector((state) => state.messanger.unReadedMessages);
  const logged_in = localStorageService.getUserToken() !== null;
  const userItem = localStorageService.getUser();

  const user = userItem ? JSON.parse(userItem) : null;

  const cartItems = useAppSelector((state) => state.cart.items);
  const location = useAppSelector((state) => state.location.position);
  const showMapState = useAppSelector((state) => state.location.showMap);

  const [showCart, setShowCart] = useState<boolean>(false); // Add state variable for showing/hiding the cart
  const [showProfile, setShowProfile] = useState<boolean>(false); // Add state variable for showing/hiding the cart
  const [scrolling, setScrolling] = useState<boolean>(false);
  const [notifsQts, setNotifsQts] = useState<number>(msg_notifs);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const routerLocation = useLocation();
  const { t } = useTranslation();

  const handleScroll = () => {
    // Check if the user has scrolled down more than a certain threshold
    if (typeof window != 'undefined') {
      if (window.pageYOffset > 100) {
        setScrolling(true);
      } else {
        setScrolling(false);
      }
    }
  };


  useEffect(() => {
    setNotifsQts(msg_notifs)
  }, [msg_notifs])

  useEffect(() => {
    if (typeof window != 'undefined') {
      window.addEventListener('scroll', handleScroll);
    }
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  

  const handleCart = async () => {
    showProfile && setShowProfile(false)
    setShowCart(!showCart);
  };

  const handleUserCart = () => {
    if (user) {
      showCart && setShowCart(false);
      setShowProfile(!showProfile);
    } else {
      navigate('/login')
    }
  };

  const navigateToHome = () => {
    const currentLocation = localStorageService.getCurrentLocation()
    currentLocation ? navigate('/search') : navigate('/')
  }


  return (
    <>

      {
        (routerLocation.pathname == "/" && !location) ? (
          <div className="overflow-hidden home-section-one">
            <Container className="xxl-12 header" >
              <div className={`fixedHeaderContainer2 ${scrolling ? 'scroll' : ''}`} >
                <div className="container">
                  <div className="logoContainer"
                    onClick={navigateToHome} >
                    <a href="#" className={`logoMain minimizedlogoMain`}></a>
                  </div>
                  <div className='info'>
                    <div className="position">
                      <LocationOnIcon className='position-icon' />
                      {/* {location
                        ? location?.coords.label
                        :
                        t('no_location_detected')
                      } */}
                      {t('no_location_detected')}

                    </div>
                    <button onClick={handleCart} className="cart-item">
                      <span className='cart-icon'></span>
                      {cartItems.length}
                    </button>
                    <button onClick={handleUserCart} className={`account ${!logged_in && 'loggedin-account'}`}  >
                      <span className='account-icon'></span>
                    </button>

                    {!logged_in && (
                      <div className="header-buttons">
                        <a
                          onClick={() => navigate('/register')}
                          className='LoadingButton'
                        >
                          {t('signup')}
                        </a>
                        <button
                          onClick={() => navigate('/login')}
                          className='btn LoadingButton'
                        >
                          {t('login')}
                        </button>
                      </div>
                    )
                    }
                  </div>
                </div>
              </div>
              {
                showCart && (
                  <div className={`cart-container`}>
                    <Cart items={cartItems} closeButton={handleCart} />
                  </div>
                )
              }

              {
                showProfile && user && (<div className={`cart-container`}>
                  <UserCart firstName={user.firstname} lastName={user.lastname} closeButton={handleUserCart} />
                </div>
                )
              }
              <Row className={`headerContainer `}>
                <Col className='col-12 col-sm-7'>
                  <div className="headerAppBar2">

                    <div className="headerMessage">
                      <p className="headerMessageSyle1" >
                        {t('header.thunderXdeliv')},  <br /> {t('header.plus')}
                        <span className="headerMessageSyle2">
                          &nbsp;
                          {t('header.nourriture')}
                        </span> .
                      </p>
                    </div>
                    {
                      location &&
                      <div className="Switches">
                        <Switches />
                      </div>
                    }
                    <Box className="headerLocalisationMessageContainer" onClick={() => dispatch({ type: "SET_SHOW", payload: true })}>
                      <a href="#" >
                        <span className="localisationIcon" >
                          {/* <PinDropIcon className="pin-icon" /> */}
                        </span>
                        {/* {location
                          ? location.coords.label
                          : t('entrezAdress')} */}
                        {t('entrezAdress')}
                      </a>
                    </Box>
                    {
                      location ?
                        <SearchBar placeholder={t('search_placeholder')} /> :
                        <LocationsearchBar placeholder={t('search_placeholder')} />
                    }

                  </div>
                </Col>

                <Col className="imageBuilderContainer">
                  <div className="imageBuilder"></div>
                </Col>
              </Row>

              {/*  Thunder logo section  */}
              {showMapState && (
                <div
                  className="mapOverPlay">
                  <div
                    onClick={(e) => e.stopPropagation()}>
                    <Map />
                  </div>
                </div>
              )}
            </Container>

          </div>

        ) : (
          <>
            <div className={`fixedHeaderContainer2 scroll`} >
              <div className="logoContainer"
                onClick={navigateToHome} >
                <a href="#" className={`logoMain minimizedlogoMain`}></a>
              </div>

              <div className='info'>
                <div className="position">

                  <LocationOnIcon className='position-icon' />
                  {location
                    ? location?.coords.label
                    : t('no_location_detected')}

                </div>

                <button onClick={handleUserCart} className={`account ${!logged_in && 'loggedin-account'}`}  >
                  {/* <PermIdentityOutlinedIcon className='account-icon' /> */}
                  <span className='account-icon'></span>
                </button>

                <button onClick={handleCart} className="cart-item">
                  {/* <ShoppingCartOutlinedIcon className='cart-icon' /> */}
                  <span className='cart-icon'></span>
                  {cartItems.length}
                </button>

                {!logged_in && (
                  <div className="header-buttons">
                    <div
                      onClick={() => navigate('/register')}
                      className='LoadingButton header-signup'
                    >
                      {t('signup')}
                    </div>
                    <div
                      onClick={() => navigate('/login')}
                      className='LoadingButton '
                    >
                      {t('login')}
                    </div>
                  </div>
                )}
              </div>
            </div>
            {
              showCart && (
                <div className={`cart-container`}>
                  <Cart items={cartItems} closeButton={handleCart} />
                </div>
              )
            }

            {
              showProfile && user && (<div className={`cart-container`}>
                <UserCart firstName={user.firstname} lastName={user.lastname} closeButton={handleUserCart} />
              </div>
              )
            }
          </>
        )
      }
    </>
  )

};

export default Header;


