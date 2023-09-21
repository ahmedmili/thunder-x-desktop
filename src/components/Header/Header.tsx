import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../Redux/store';
import { toast } from 'react-toastify';
import './header.scss'
import { Container, Row, Col } from "react-bootstrap"

import { LoadingButton as _LoadingButton } from "@mui/lab";
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import PinDropIcon from "@mui/icons-material/PinDrop";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { logout } from "../../Redux/slices/userSlice";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { localStorageService } from "../../services/localStorageService";
import Switches from "../toggleSwitch/toggleSwitch";
import SearchBar from "../searchBar/searchBar";
import Map from "../Location/Location";
import { Box } from '@mui/material';

import { useLocation } from 'react-router-dom';
import { Search } from '@mui/icons-material';
import { Cart } from '../cart/cart';
import { UserCart } from '../UserCart/UserCart';

const Header = () => {

  const theme = useAppSelector((state) => state.home.theme)
  const [template, setTemplate] = useState<number>(theme)

  const logged_in = localStorageService.getUserToken() !== null;
  const userItem = localStorageService.getUser();

  const user = userItem ? JSON.parse(userItem) : null;
  const firstname = user ? user.firstname : null;

  const cartItems = useAppSelector((state) => state.cart.items);
  const location = useAppSelector((state) => state.location.position);
  const showMapState = useAppSelector((state) => state.location.showMap);

  const [showCart, setShowCart] = useState(false); // Add state variable for showing/hiding the cart
  const [showProfile, setShowProfile] = useState(false); // Add state variable for showing/hiding the cart
  const [scrolling, setScrolling] = useState(false);

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
    setTemplate(theme)
  }, [theme])

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
    // console.log(showProfile)
    showCart && setShowCart(false);
    setShowProfile(!showProfile);
  };

  return (
    <>

      {
        (routerLocation.pathname == "/" || routerLocation.pathname == "/search") ? (
          <>
            <div className="head1">
              <div className="demiCercle">

              </div>
            </div>
            <Container className={template === 1 ? "bg-transparent" : ""} style={{ marginTop: template === 1 ? 0 : "10px" }} >
            <Row className={`fixedHeaderContainer ${scrolling ? 'minimizedFixedHeaderContainer' : ''}  ${template === 1 && "dark-background2"}`} >
              <Col>
                <div className="logoContainer"

                  onClick={() => navigate('/')} >
                  <a href="#" className={`logoMain ${scrolling ? 'minimizedlogoMain' : ''}`}></a>
                </div>
              </Col>

              <Col>
                {/* login register buttons  */}
                {!logged_in ? (
                  <>
                    <div className="appBar">
                      <button
                        onClick={() => navigate('/register')}
                        className={`LoadingButton ${scrolling ? 'minimizedLoadingButton' : ''}`}
                      >
                        {t('signup')}
                      </button>
                      <button
                        onClick={() => navigate('/login')}
                        className={`LoadingButton ${scrolling ? 'minimizedLoadingButton' : ''}`}
                      >
                        {t('login')}
                      </button>
                    </div>
                  </>
                ) : <>
                  <div className="appBar">
                    <button
                      onClick={onLogoutHandler}
                      className={`LoadingButton ${scrolling ? 'minimizedLoadingButton' : ''}`}
                    >
                      {t('profile.deconnecter')}
                    </button>
                  </div>
                </>
                }
              </Col>

            </Row>

            <Row className={`headerContainer  ${template === 1 && "bg-transparent"}`}>
              <Col className='col-12 col-sm-7'>
                <div className="headerAppBar2">
                  <div className="headerMessage">
                    <p className="headerMessageSyle1" > Nous &nbsp;
                      <span className="headerMessageSyle2">
                        livrons
                      </span>
                    </p>
                    <p className="headerMessageSyle1"> plus que de la &nbsp;
                      <span className="headerMessageSyle2">
                        nourriture
                      </span> .
                    </p>
                  </div>
                  <div className="Switches">
                    <Switches />
                  </div>
                  <Box className="headerLocalisationMessageContainer" onClick={() => dispatch({ type: "SET_SHOW", payload: true })}>
                    <a href="#" >
                      <span className="localisationIcon" >
                        <PinDropIcon />
                      </span>
                      {location
                        ? location?.coords.label + " ! " + t('clickToChange')
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
      <div className={`fixedHeaderContainer2 ${template === 1 && "dark-background2"}`} >
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
          <div className={`cart-container  ${template === 1 && "dark-background2"}`}>
            <Cart items={cartItems} closeButton={handleCart} />
          </div>
        )
      }

      {
        showProfile && user && (<div className={`cart-container ${template === 1 && "dark-background2"}`}>
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

