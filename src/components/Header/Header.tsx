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

import menuImg from './../../assets/menu-1.png';

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
  const [orderTracking, setOrderTracking] = useState<boolean>(false);
  const [searchVisible, setSearchVisible] = useState<boolean>(false);

  const searHandleToggle = () => {
    setSearchVisible(!searchVisible);
  };

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const routerLocation = useLocation();
  const { t } = useTranslation();

  const orderTrackingToggle = () => {
    setOrderTracking(true);
  }
  const closeOrderTrackingToggle = () => {
    setOrderTracking(false);
  }

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
                <div className="switches-area">
                  <Switches />
                </div>
                <div className="position">
                  <Box className="headerLocalisationMessageContainer" onClick={() => dispatch({ type: "SET_SHOW", payload: true })}>
                    <a href="#" className="top-bar-location" >
                      {location
                          ? location.coords.label
                          : t('entrezAdress')}
                      {/* {t('entrezAdress')} */}
                    </a>
                  </Box >
                  {/*
                  {location
                    ? location?.coords.label
                    : t('no_location_detected')} */}

                </div>

                <button onClick={handleUserCart} className={`account ${!logged_in && 'loggedin-account'}`}  >
                  {/* <PermIdentityOutlinedIcon className='account-icon' /> */}
                  <span className='account-icon'></span>
                </button>

                <div className={`search-blc ${searchVisible ? 'active' : ''}`}>
                  {searchVisible && (
                    <div className="search-input-blc">
                      <input type="search" className="form-control" placeholder="Search" /> 
                    </div>
                  )}
                  <button className="btn btn-search" onClick={searHandleToggle}></button>
                </div>

                <button onClick={handleCart} className="cart-item">
                  {/* <ShoppingCartOutlinedIcon className='cart-icon' /> */}
                  <span className='cart-icon'></span>
                  {cartItems.length}
                </button>

                <div className="order-tracking-area">
                  <button className="btn btn-order-tracking" onClick={orderTrackingToggle}></button>

                  <div className={`order-tracking-wrapper ${orderTracking ? 'active' : ''}`}>
                    <div className="order-tracking_header">
                      <h3 className="order-tracking_header-title">Suivi de mes commandes</h3>
                      <button className="close" onClick={closeOrderTrackingToggle}></button>
                    </div>
                    <div className="order-tracking_body">
                      <div className="being-processed-area">
                        <div className="being-processed_desc">
                          <h4>En cours de traitement</h4>
                          <p>
                            La commande est en attente d’acceptation de la part du restaurant
                          </p>
                        </div>
                        <div className="being-processed_steps-area">
                          <div className="step-item active"></div>
                          <div className="step-item"></div>
                          <div className="step-item"></div>
                        </div>
                      </div>
                      <div className="processing-status-area">
                        <div className="status-icn"></div>
                        <div className="processing-status-desc">
                          <h4>En cours de traitement</h4>
                          <p>
                            La commande est en attente d’acceptation de la part du restaurant
                          </p>
                        </div>
                      </div>
                      <div className="supplier-info-area">
                        <div className="supplier-info_img-blc">
                          <img src={menuImg} alt="suplier" />
                        </div>
                        <div className="supplier-desc">
                          <h4>Restaurant Zahra</h4>
                          <p>
                            Sahloul, Sousse
                          </p>
                        </div>
                      </div>
                      <div className="total-price-calculate">
                        <div className="total-price-blc">
                          <div className="total-price-blc_wrapper">
                            <div className="product-name">
                              <div className="product-name_counter">X1</div>
                              <div className="product-name_item">Sandwich</div>
                            </div>
                            <div className="price">10.00 DT</div>
                          </div>
                        </div>
                        <div className="total-price-blc">
                          <div className="total-price-blc_wrapper">
                            <div className="total-price_label">Sous-total</div>
                            <div className="price">10.00 DT</div>
                          </div>
                          <div className="total-price-blc_wrapper">
                            <div className="total-price_label">Frais de livraison</div>
                            <div className="price">3.00 DT</div>
                          </div>
                        </div>
                        <div className="total-price-blc">
                          <div className="total-price-blc_wrapper">
                            <div className="total-price_label">Total</div>
                            <div className="price">20.00 DT</div>
                          </div>
                        </div>
                      </div>
                      <div className="panier-blc">
                        <h4 className="panier-title">
                          Paiement
                        </h4>
                        <div className="paiement-status-list">
                          <ul>
                            <li>
                              <div className="paiement-status_icon"></div>
                              <div className="paiement-status-desc">
                                <p className="paiement-status-item">En espéce à la livraison</p>
                              </div>
                            </li>
                            <li>
                              <div className="paiement-status_icon"></div>
                              <div className="paiement-status-desc">
                                <p className="paiement-status-item">Bonus</p>
                                <div className="price">0.00</div>
                              </div>
                              
                            </li>
                            <li>
                              <div className="paiement-status_icon"></div>
                              <div className="paiement-status-desc">
                                <p className="paiement-status-item">Repas gratuit</p>
                              </div>
                            </li>
                            <li>
                              <div className="paiement-status_icon"></div>
                              <div className="paiement-status-desc">
                                <p className="paiement-status-item">Code promo</p>
                                <div className="price">AZ12UH</div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="btns-group">
                        <button className="btn btn-cancel-order">Annuler la comamnde</button>
                      </div>
                    </div>
                  </div>
                </div>

                {!logged_in && (
                  <div className="header-buttons">
                    <a
                      onClick={() => navigate('/register')}
                      className='LoadingButton header-signup'
                    >
                      {t('signup')}
                    </a>
                    <button
                      onClick={() => navigate('/login')}
                      className='LoadingButton '
                    >
                      {t('login')}
                    </button>
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
      {showMapState && (
                <div
                  className="mapOverPlay">
                  <div
                    onClick={(e) => e.stopPropagation()}>
                    <Map />
                  </div>
                </div>
              )}
    </>
  )

};

export default Header;


