import { Col, Container, Row } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../Redux/store';
import eventEmitter from '../../services/thunderEventsService';
import './header.scss';

import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Box } from '@mui/material';
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { localStorageService } from "../../services/localStorageService";
import Map from "../Location/Location";
import Switches from "../toggleSwitch/toggleSwitch";

import { useLocation } from 'react-router-dom';
import LocationsearchBar from "../LocationsearchBar/LocationsearchBar";
import { UserCart } from '../UserCart/UserCart';
import { Cart } from '../cart/cart';
import SearchBar from "../searchBar/searchBar";

import { commandService } from "../../services/api/command.api";
import menuImg from './../../assets/menu-1.png';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import { handleCartState, removeNotifHeaderCart } from "../../Redux/slices/cart/cartSlice";
import delivA from "./../../assets/profile/ArchivedCommands/deliv-A-1.svg";
import doneA from "./../../assets/profile/ArchivedCommands/done-A-1.svg";
import preparatinA from "./../../assets/profile/ArchivedCommands/preparatin-A-1.svg";
import traitementA from "./../../assets/profile/ArchivedCommands/traitement-A-1.svg";
import { RootState } from "../../Redux/slices";

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
  const [commands, setCommands] = useState<any>([]);
  const [expanded, setExpanded] = useState<string | false>('panel1');
  const showNotifCart = useAppSelector((state) => state.cart.openHeaderCart)
  const NotifCartItmes = useAppSelector((state) => state.cart.notifHeaderCart)
  const deliveryOption = useAppSelector((state: RootState) => state.cart.deliveryOption);

  const searHandleToggle = () => {
    setSearchVisible(!searchVisible);
  };

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const routerLocation = useLocation();
  const { t } = useTranslation();

  const orderTrackingToggle = () => {
    showProfile && setShowProfile(false)
    showCart && setShowCart(false);
    showMapState && dispatch(handleCartState(false));
    setOrderTracking(true);
  }

  const closeOrderTrackingToggle = () => {
    showProfile && setShowProfile(false)
    showCart && setShowCart(false);
    showMapState && dispatch(handleCartState(false));
    orderTracking && setOrderTracking(false);
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
    if (logged_in) {
      getCurrentCommands();      
    }
    if (typeof window != 'undefined') {
      window.addEventListener('scroll', handleScroll);
    }
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);



  const handleCart = async () => {
    showProfile && setShowProfile(false)
    showCart && setShowCart(false);
    orderTracking && setOrderTracking(false);
    showMapState && dispatch(handleCartState(false));
    setShowCart(!showCart);
  };

  const handleNotifCart = async () => {
    showProfile && setShowProfile(false)
    showCart && setShowCart(false);
    orderTracking && setOrderTracking(false);
    dispatch(removeNotifHeaderCart())
    dispatch(handleCartState(false))
    navigate(-1)
  };

  const handleUserCart = () => {
    if (user) {
      showCart && setShowCart(false);
      showMapState && dispatch(handleCartState(false));
      orderTracking && setOrderTracking(false);

      setShowProfile(!showProfile);
    } else {
      navigate('/login')
    }
  };
  const calculeSubTotal = (products: any) => {
    let total = 0;
    for (let index = 0; index < products.length; index++) {
      const product: any = products[index]
      const price = product.price
      const quantity = product.quantity
      const result = quantity! * price
      total = total + result

    }
    return total
  }

  const navigateToHome = () => {
    const currentLocation = localStorageService.getCurrentLocation()
    currentLocation ? navigate('/search') : navigate('/')
  }
  const getCurrentCommands = async () => {
    const { status, data } = await commandService.myCommands()
    const commands = data.data
    data.success && setCommands(commands)
  }
  const getProgressDescription = (cycle: string): { message: string, status: number, color: string } => {
    switch (cycle) {
      case 'PENDING':
        return {
          message: t('profile.commands.acceptation'),
          status: 1,
          color: '#E77F76'
        };
      case 'VERIFY':
        return {
          message: t('profile.commands.acceptation'),
          status: 2,
          color: '#E77F76'
        };
      case 'AUTHORIZED':
        return {
          message: t('profile.commands.prépaartion'),
          status: 3,
          color: '#F2C525'
        };
      case 'PRE_ASSIGN_ADMIN':
        return {
          message: t('profile.commands.prépaartion'),
          status: 4,
          color: '#F2C525'
        };
      case 'PRE_ASSIGN':
        return {
          message: t('profile.commands.prépaartion'),
          status: 4,
          color: '#F2C525'
        };
      case 'ASSIGNED':
        return {
          message: t('profile.commands.prépaartion'),
          status: 5,
          color: '#F2C525'
        };
      case 'INPROGRESS':
        return {
          message: t('profile.commands.livraison'),
          status: 6,
          color: '#3BB3C4'
        };
      default:
        return {
          message: '',
          status: -1,
          color: '#E77F76'
        };
    }
  };
  async function dropCommand(id: any): Promise<void> {
    const { status, data } = await commandService.removecommand(id)
    data.success && getCurrentCommands()
  }
  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };
  function goCommandsPage() {
    navigate("/profile/archivedCommands/")
  }
  useEffect(() => {
    eventEmitter.on('COMMAND_UPDATED', () => { getCurrentCommands() })
    return () => {
      eventEmitter.off('COMMAND_UPDATED', () => { getCurrentCommands() })
    }
  }, [])

  const HideAll = () => {
    showProfile && setShowProfile(false)
    showCart && setShowCart(false);
    showMapState && dispatch(handleCartState(false));
    orderTracking && setOrderTracking(false);
  }
  return (
    <>
      {(showCart || showProfile || showMapState || orderTracking) && (
        <div className="header-overlay" onClick={HideAll}>
        </div>)
      }
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
                    {/* */}
                    {logged_in && (
                      <>
                        <div className="position">
                          <LocationOnIcon className='position-icon' />
                          {t('no_location_detected')}
                        </div>
                        <button onClick={handleCart} className="cart-item">
                          <span className='cart-icon'></span>
                          {cartItems.length}
                        </button>
                      </>
                    )}

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
                    <Box className="headerLocalisationMessageContainer" onClick={() => dispatch({ type: "SET_SHOW", payload: true })} >
                      <p >
                        {t('entrezAdress')}
                      </p>
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
                  <Box className="headerLocalisationMessageContainer" onClick={() => dispatch({ type: "SET_SHOW", payload: true })} >
                    <a href="#" className="top-bar-location" >
                      {location
                        ? location.coords.label
                        : t('entrezAdress')}
                    </a>
                  </Box >
                </div>

                <button onClick={handleUserCart} className={`account ${!logged_in && 'loggedin-account'}`}  >
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
                  <span className='cart-icon'></span>
                  {cartItems.length}
                </button>
                {(logged_in && commands.length) ?
                  (
                    <div className="order-tracking-area">
                      <button className="btn btn-order-tracking" onClick={orderTrackingToggle}></button>
                      {
                        commands.length == 1 ?
                          <div className={`order-tracking-wrapper ${orderTracking ? 'active' : ''}`}>
                            <div className="order-tracking_header">
                              <h3 className="order-tracking_header-title">{t('header.commands')}</h3>
                              <button className="close" onClick={closeOrderTrackingToggle}></button>
                            </div>
                            <div className="order-tracking_body">
                              <div className="processing-status-area" onClick={goCommandsPage}>
                                {(getProgressDescription(commands[0].cycle).status === 1 || getProgressDescription(commands[0].cycle).status === 2) ? <img loading="lazy" src={traitementA} alt="traitement logo" className='traitement-logo' />
                                  : (getProgressDescription(commands[0].cycle).status <= 5 && getProgressDescription(commands[0].cycle).status > 2) ? <img loading="lazy" src={preparatinA} alt="preparation logo" className='preparation-logo' />
                                    :
                                    commands[0].is_delivery === 1 ? (
                                      <img loading="lazy" src={(getProgressDescription(commands[0].cycle).status === 6) ? delivA : ''} alt="deliv logo" className='deliv-logo' />
                                    ) : (
                                      <img loading="lazy" src={(getProgressDescription(commands[0].cycle).status === 6) ? doneA : ''} alt="deliv logo" className='deliv-logo' />
                                    )
                                }
                                <div className="processing-status-desc">
                                  <h4 style={{ color: getProgressDescription(commands[0].cycle).color }}>{getProgressDescription(commands[0].cycle).message}</h4>
                                  {
                                    getProgressDescription(commands[0].cycle).status <= 2 && <p>{t('profile.commands.sousMessage')}</p>
                                  }
                                  {
                                    getProgressDescription(commands[0].cycle).status > 2 && getProgressDescription(commands[0].cycle).status < 6 && !commands[0].isReady && <p>{t('profile.commands.sousMessage2')}</p>
                                  }
                                  {
                                    getProgressDescription(commands[0].cycle).status == 6 && commands[0].is_delivery ? <p>{t('profile.commands.sousMessage3')}</p> : !commands[0].is_delivery && commands[0].isReady ? <p className="description">{t('orderTrackingPage.importedReady')}</p> : <></>
                                  }
                                </div>
                              </div>
                              <div className="supplier-info-area">
                                <div className="supplier-info_img-blc">
                                  <img src={menuImg} alt="suplier" />
                                </div>
                                <div className="supplier-desc">
                                  <h4>{commands[0].supplier.name}</h4>
                                  <p>
                                    {commands[0].supplier.city}, {commands[0].supplier.region}
                                  </p>
                                </div>
                              </div>
                              <div className="total-price-calculate">
                                {commands[0].products.map(function (prod: any) {
                                  return (
                                    <div key={prod.id} className="total-price-blc">
                                      <div className="total-price-blc_wrapper">
                                        <div className="product-name">
                                          <div className="product-name_counter">X{prod.quantity}</div>
                                          <div className="product-name_item">{prod.name}</div>
                                        </div>
                                        <div className="price">{(Number(prod.price) * Number(prod.quantity)).toFixed(2)} Dt</div>
                                      </div>
                                    </div>
                                  )
                                })
                                }

                                <div className="total-price-blc">
                                  <div className="total-price-blc_wrapper">
                                    <div className="total-price_label">{t('profile.commands.sousTotal')}</div>
                                    <div className="price">{calculeSubTotal(commands[0].products).toFixed(2)}</div>
                                  </div>
                                  {Number(commands[0].delivery_price) ? (<div className="total-price-blc_wrapper">
                                    <div className="total-price_label">{t('supplier.delivPrice')}</div>
                                    <div className="price">{Number(commands[0].delivery_price).toFixed(2)} DT</div>
                                  </div>) : ''}
                                </div>

                                <div className="total-price-blc">
                                  <div className="total-price-blc_wrapper">
                                    <div className="total-price_label">{t('cartPage.total')}</div>
                                    <div className="price">{(Number(commands[0].total_price)).toFixed(2)} DT</div>
                                  </div>
                                </div>
                              </div>
                              <div className="panier-blc">
                                <h4 className="panier-title">
                                  {t('cart.payment.payment')}
                                </h4>
                                <div className="paiement-status-list">
                                  <ul>
                                    <li>
                                      <div className="paiement-status_icon"></div>
                                      <div className="paiement-status-desc">
                                        <p className="paiement-status-item"> {commands[0].mode_pay === 1 ? t('cartPage.espece') : t('cartPage.bankPay')}</p>
                                      </div>
                                    </li>
                                    {
                                      (Number(commands[0].bonus) > 0) && (
                                        <li>
                                          <div className="paiement-status_icon"></div>
                                          <div className="paiement-status-desc">
                                            <p className="paiement-status-item">{t("cartPage.bonus")}</p>
                                            <div className="price">-{(Number(commands[0].bonus) / 1000).toFixed(2)} Dt</div>
                                          </div>
                                        </li>
                                      )
                                    }
                                    {
                                      Number(commands[0].gift_ammount) > 0 && (
                                        <li>
                                          <div className="paiement-status_icon"></div>
                                          <div className="paiement-status-desc">
                                            <p className="paiement-status-item">{t('repasGratuit')}</p>
                                            <div className="price">{(Number(commands[0].gift_ammount) / 1000).toFixed(2)} dt</div>
                                          </div>
                                        </li>
                                      )}
                                    {
                                      commands[0].total_price_coupon > 0 && (
                                        <li>
                                          <div className="paiement-status_icon"></div>
                                          <div className="paiement-status-desc">
                                            <p className="paiement-status-item">{t('cart.PromosCode')}</p>
                                            <div className="price">-{Number(commands[0].total_price_coupon).toFixed(2)} dt</div>
                                          </div>
                                        </li>
                                      )
                                    }
                                  </ul>
                                </div>
                              </div>
                              {/* {commands[0].cycle == 'PENDING' && (
                                <div className="btns-group">
                                  <button className="btn btn-cancel-order" onClick={() => dropCommand(commands[0].id)}>{t('profile.commands.annuler') }</button>
                              </div>
                              )}  */}
                            </div>
                          </div>
                          : commands.length > 1 ? (
                            <div className={`order-tracking-wrapper ${orderTracking ? 'active' : ''}`}>
                              <div className="order-tracking_header">
                                <h3 className="order-tracking_header-title">{t('header.commands')}</h3>
                                <button className="close" onClick={closeOrderTrackingToggle}></button>
                              </div>
                              {
                                commands.map(function (command: any) {
                                  return (
                                    <Accordion expanded={expanded === 'panel' + command.id} onChange={handleChange('panel' + command.id)}>
                                      <AccordionSummary expandIcon={<ExpandMoreIcon />} className="order-tracking_body accordion">
                                        <div className="supplier-info-area">
                                          <div className="supplier-info_img-blc">
                                            <img src={menuImg} alt="suplier" />
                                          </div>
                                          <div className="supplier-desc">
                                            <h4>{command.supplier.name}</h4>
                                            <p>
                                              {command.supplier.city}, {command.supplier.region}
                                            </p>
                                          </div>
                                        </div>
                                      </AccordionSummary>
                                      <AccordionDetails className="order-tracking_body">
                                        <div className="processing-status-area" onClick={goCommandsPage}>
                                          {(getProgressDescription(command.cycle).status === 1 || getProgressDescription(command.cycle).status === 2) ? <img loading="lazy" src={traitementA} alt="traitement logo" className='traitement-logo' />
                                            : (getProgressDescription(command.cycle).status <= 5 && getProgressDescription(command.cycle).status > 2) ? <img loading="lazy" src={preparatinA} alt="preparation logo" className='preparation-logo' />
                                              :
                                              command.is_delivery === 1 ? (
                                                <img loading="lazy" src={(getProgressDescription(command.cycle).status === 6) ? delivA : ''} alt="deliv logo" className='deliv-logo' />
                                              ) : (
                                                <img loading="lazy" src={(getProgressDescription(command.cycle).status === 6) ? doneA : ''} alt="deliv logo" className='deliv-logo' />
                                              )
                                          }
                                          <div className="processing-status-desc">
                                            <h4 style={{ color: getProgressDescription(commands[0].cycle).color }}>{getProgressDescription(command.cycle).message}</h4>
                                            {
                                              getProgressDescription(command.cycle).status <= 2 && <p>{t('profile.commands.sousMessage')}</p>
                                            }
                                            {
                                              getProgressDescription(command.cycle).status > 2 && getProgressDescription(command.cycle).status < 6 && !command.isReady && <p>{t('profile.commands.sousMessage2')}</p>
                                            }
                                            {
                                              getProgressDescription(command.cycle).status == 6 && command.is_delivery ? <p>{t('profile.commands.sousMessage3')}</p> : !command.is_delivery && command.isReady ? <p className="description">{t('orderTrackingPage.importedReady')}</p> : <></>
                                            }
                                          </div>

                                        </div>
                                        <div className="total-price-calculate">
                                          {command.products.map(function (prod: any) {
                                            return (
                                              <div key={prod.id} className="total-price-blc">
                                                <div className="total-price-blc_wrapper">
                                                  <div className="product-name">
                                                    <div className="product-name_counter">X{prod.quantity}</div>
                                                    <div className="product-name_item">{prod.name}</div>
                                                  </div>
                                                  <div className="price">{(Number(prod.price) * Number(prod.quantity)).toFixed(2)} Dt</div>
                                                </div>
                                              </div>
                                            )
                                          })
                                          }
                                          <div className="total-price-blc">
                                            <div className="total-price-blc_wrapper">
                                              <div className="total-price_label">{t('profile.commands.sousTotal')}</div>
                                              <div className="price">{calculeSubTotal(command.products).toFixed(2)}</div>
                                            </div>
                                            {command.delivery_price ? (<div className="total-price-blc_wrapper">
                                              <div className="total-price_label">{t('supplier.delivPrice')}</div>
                                              <div className="price">{Number(command.delivery_price).toFixed(2)} DT</div>
                                            </div>) : ''}
                                          </div>
                                          <div className="total-price-blc">
                                            <div className="total-price-blc_wrapper">
                                              <div className="total-price_label">{t('cartPage.total')}</div>
                                              <div className="price">{(Number(command.total_price)).toFixed(2)} DT</div>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="panier-blc">
                                          <h4 className="panier-title">
                                            {t('cart.payment.payment')}
                                          </h4>
                                          <div className="paiement-status-list">
                                            <ul>
                                              <li>
                                                <div className="paiement-status_icon"></div>
                                                <div className="paiement-status-desc">
                                                  <p className="paiement-status-item"> {command.mode_pay === 1 ? t('cartPage.espece') : t('cartPage.bankPay')}</p>
                                                </div>
                                              </li>
                                              {
                                                (Number(command.bonus) > 0) && (
                                                  <li>
                                                    <div className="paiement-status_icon"></div>
                                                    <div className="paiement-status-desc">
                                                      <p className="paiement-status-item">{t("cartPage.bonus")}</p>
                                                      <div className="price">-{(Number(command.bonus) / 1000).toFixed(2)} Dt</div>
                                                    </div>
                                                  </li>
                                                )
                                              }
                                              {
                                                command.gift_ammount > 0 && (
                                                  <li>
                                                    <div className="paiement-status_icon"></div>
                                                    <div className="paiement-status-desc">
                                                      <p className="paiement-status-item">{t('repasGratuit')}</p>
                                                      <div className="price">{(Number(command.gift_ammount) / 1000).toFixed(2)} dt</div>
                                                    </div>
                                                  </li>
                                                )}
                                              {
                                                Number(command?.total_price_coupon) > 0 && (
                                                  <li>
                                                    <div className="paiement-status_icon"></div>
                                                    <div className="paiement-status-desc">
                                                      <p className="paiement-status-item">{t('cart.PromosCode')}</p>
                                                      <div className="price">-{Number(command?.total_price_coupon).toFixed(2)} dt</div>
                                                    </div>
                                                  </li>
                                                )
                                              }
                                            </ul>
                                          </div>
                                        </div>
                                      </AccordionDetails>
                                    </Accordion>
                                  )
                                })
                              }
                            </div>
                          ) : ''
                      }
                    </div>) : ''
                }

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
              (showCart && !showNotifCart) && (
                <div className={`cart-container`}>
                  <Cart items={cartItems} closeButton={handleCart} />
                </div>
              )
            }
            {
              (!showCart && showNotifCart) && (
                <div className={`cart-container`}>
                  <Cart type="addToCart" items={NotifCartItmes} closeButton={handleNotifCart} />
                </div>
              )
            }

            {
              showProfile && user && (<div className={`cart-container test`}>
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


