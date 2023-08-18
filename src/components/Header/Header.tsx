import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../Redux/store';
import { toast } from 'react-toastify';
import './header.scss'
import { Container, Row, Col } from "react-bootstrap"

import { LoadingButton as _LoadingButton } from "@mui/lab";

import PinDropIcon from "@mui/icons-material/PinDrop";

import { logout } from "../../Redux/slices/userSlice";
import { useEffect, useState } from "react";
// import CartPage from '../../views/cart/cart.page';
import { useTranslation } from "react-i18next";
import { localStorageService } from "../../services/localStorageService";
import Switches from "../toggleSwitch/toggleSwitch";
import SearchBar from "../searchBar/searchBar";
import Map from "../Location/Location";
import { Box } from '@mui/material';

const Header = () => {
  const logged_in = localStorageService.getUserToken() !== null;
  const userItem = localStorageService.getUser();

  const user = userItem ? JSON.parse(userItem) : null;
  const firstname = user ? user.firstname : null;

  const cartItems = useAppSelector((state) => state.cart.items);
  const location = useAppSelector((state) => state.location.position);

  const [showCart, setShowCart] = useState(false); // Add state variable for showing/hiding the cart
  const [showMap, setShowMap] = useState(false);
  const [scrolling, setScrolling] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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
    // Attach the scroll event listener when the component mounts
    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
      <div className="head1">
        <div className="demiCercle">

        </div>
      </div>
      <Container  >
        <Row className={`fixedHeaderContainer ${scrolling ? 'minimizedFixedHeaderContainer' : ''}`} >
          <Col>
            <div className= "logoContainer" 

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
                  {t('signout')}
                </button>
              </div>
            </>
            }
          </Col>

        </Row>

        <Row className="headerContainer">
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
              <Box className="headerLocalisationMessageContainer" onClick={() => setShowMap(true)} >
                <a href="#" >
                  <span className="localisationIcon" >
                    <PinDropIcon />
                  </span>
                  {location
                    ? location?.coords.label + "!" + t('clickToChange')
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
        {showMap && (
          <div
            className="mapOverPlay"
            onClick={() => setShowMap(false)}>
            <div
              onClick={(e) => e.stopPropagation()}>
              <Map />
            </div>
          </div>
        )}
      </Container>

    </>
  );
};

export default Header;

