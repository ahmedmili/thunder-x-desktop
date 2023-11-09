import { Col, Container, Row } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../../Redux/store';
import './header.scss';

import LocationOnIcon from '@mui/icons-material/LocationOn';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import PinDropIcon from "@mui/icons-material/PinDrop";
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { Box } from '@mui/material';
import { Suspense, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { logout } from "../../Redux/slices/userSlice";
import { localStorageService } from "../../services/localStorageService";
import Map from "../Location/Location";
import SearchBar from "../searchBar/searchBar";
import Switches from "../toggleSwitch/toggleSwitch";

import { Search } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import { UserCart } from '../UserCart/UserCart';
import { Cart } from '../cart/cart';
import { LocationService } from "../../services/api/Location.api";
import { Position } from "../../services/types";

const Header = () => {
  const isServer = typeof window != "undefined"
  const msg_notifs = !isServer ? useAppSelector((state) => state.messanger.unReadedMessages) : 0;
  const logged_in = localStorageService.getUserToken() !== null;
  const userItem = !isServer ? localStorageService.getUser() : null;

  const user = userItem ? JSON.parse(userItem) : null;

  const cartItems = !isServer ? useAppSelector((state) => state.cart.items) : [];
  const location = !isServer ? useAppSelector((state) => state.location.position) : null;
  const showMapState = !isServer ? useAppSelector((state) => state.location.showMap) : null;

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
    // Attach the scroll event listener when the component mounts
    if (typeof window != 'undefined') {
      window.addEventListener('scroll', handleScroll);
    }

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleCart = () => {
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

  return (
    <>
      <Suspense
        fallback={
          <>
          </>
        }
      >

        {
          (routerLocation.pathname == "/" || routerLocation.pathname == "/search") ? (
            <>

              <Container >
                <div className="head1">
                  <div className="demiCercle">

                  </div>
                </div>
                <div className={`fixedHeaderContainer2`} >
                  <div className="logoContainer"
                    onClick={() => navigate('/')} >
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
                      <PermIdentityOutlinedIcon className='account-icon' />
                    </button>

                    {/* <button className="search">
                    <Search className='search-icon' />
                  </button> */}

                    <button onClick={handleCart} className="cart-item">
                      <ShoppingCartOutlinedIcon className='cart-icon' />
                      {cartItems != null && cartItems.length}
                    </button>

                    {!logged_in && (
                      <div className="header-buttons">
                        <div
                          onClick={() => navigate('/register')}
                          className='LoadingButton header-signup '
                        >
                          {t('signup')}
                        </div>
                        <div
                          onClick={() => navigate('/login')}
                          className='LoadingButton header-signin'
                        >
                          {t('login')}
                        </div>
                      </div>
                    )
                    }
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
                        <p className="headerMessageSyle1" > {t('header.nous')} &nbsp;
                          <span className="headerMessageSyle2">
                            {t('header.livrons')}
                          </span>
                        </p>
                        <p className="headerMessageSyle1"> {t('header.plus')} &nbsp;
                          <span className="headerMessageSyle2">
                            {t('header.nourriture')}
                          </span> .
                        </p>
                      </div>
                      <div className="Switches">
                        <Switches />
                      </div>
                      <Box className="headerLocalisationMessageContainer" onClick={() => dispatch({ type: "SET_SHOW", payload: true })}>
                        <a href="#" >
                          <span className="localisationIcon" >
                            <PinDropIcon className="pin-icon" />
                          </span>
                          {location
                            ? location?.coords.label
                            : t('no_location_detected')}
                        </a>
                      </Box>
                      <SearchBar placeholder={t('search_placeholder')} />

                    </div>
                  </Col>

                  <Col className="imageBuilderContainer">
                    <div className="imageBuilder"></div>
                  </Col>
                </Row>

                {/*  Thunder logo section  */}
                {showMapState && (
                  <div
                    className="mapOverPlay"
                    onClick={() => dispatch({ type: "SET_SHOW", payload: false })}>
                    <div
                      onClick={(e) => e.stopPropagation()}>
                      <Map />
                    </div>
                  </div>
                )}
              </Container>

            </>

          ) : (
            <>
              <div className={`fixedHeaderContainer2`} >
                <div className="logoContainer"
                  onClick={() => navigate('/')} >
                  <a href="#" className={`logoMain minimizedlogoMain`}></a>
                </div>

                {!logged_in ? (
                  <div className="header-buttons">
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
                  </div>
                ) : <>
                </>
                }

                <div className='info'>
                  <div className="position">

                    <LocationOnIcon className='position-icon' />
                    {location
                      ? location?.coords.label
                      : t('no_location_detected')}

                  </div>
                  {
                    logged_in && (
                      <>
                        <button onClick={handleUserCart} className="account">
                          {
                            notifsQts > 0 && (
                              <div className="notif-number-container">
                                {notifsQts}
                              </div>
                            )

                          }
                          <PermIdentityOutlinedIcon className='account-icon' />
                        </button>

                        <button className="search">
                          <Search className='search-icon' />
                        </button>
                      </>
                    )
                  }

                  <button onClick={handleCart} className="cart-item">
                    <ShoppingCartOutlinedIcon className='cart-icon' />
                    {cartItems.length}
                  </button>

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
      </Suspense>
    </>
  )

};

export default Header;


