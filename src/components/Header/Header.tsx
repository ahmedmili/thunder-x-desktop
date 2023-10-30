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
import { useEffect, useState } from "react";
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

  const msg_notifs = useAppSelector((state) => state.messanger.unReadedMessages)

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
    if (window.pageYOffset > 100) {
      setScrolling(true);
    } else {
      setScrolling(false);
    }
  };


  useEffect(() => {
    setNotifsQts(msg_notifs)
  }, [msg_notifs])

  useEffect(() => {
    // Attach the scroll event listener when the component mounts
    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const onLogoutHandler = async () => {
    try {
      dispatch(logout());
      navigator.geolocation.getCurrentPosition(
        (position: any) => {
          const { latitude, longitude } = position.coords;
          LocationService.geoCode(latitude, longitude).then(data => {
            dispatch({
              type: "SET_LOCATION",
              payload: {
                ...data
              },
            });
          });
        },
        (error: GeolocationPositionError) => {
          toast.error(error.message)
        }
      );

      navigate("/");
    } catch (error: any) {
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
    showProfile && setShowProfile(false)
    setShowCart(!showCart);
  };

  const handleUserCart = async () => {
    if (user) {
      showCart && setShowCart(false);
      setShowProfile(!showProfile);
    } else {
      navigate('/login')
    }
  };

  return (
    <>

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
                  <button onClick={handleUserCart} className="account">

                    <PermIdentityOutlinedIcon className='account-icon' />
                  </button>

                  <button className="search">
                    <Search className='search-icon' />
                  </button>

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

              <div className='info'>
                <div className="position">

                  <LocationOnIcon className='position-icon' />
                  {location
                    ? location?.coords.label
                    : t('no_location_detected')}

                </div>
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
    </>
  )

};

export default Header;


