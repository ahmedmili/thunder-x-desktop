import { Add as AddIcon, Star } from '@mui/icons-material';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { localStorageService } from "../../services/localStorageService";
import { userService } from "../../services/api/user.api";
import Skeleton from "@mui/material/Skeleton";
import {
  CircularProgress,
  Pagination,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { setProduct } from "../../Redux/slices/restaurantSlice";
import { useAppDispatch, useAppSelector } from '../../Redux/store';
import { productService } from '../../services/api/product.api';
import { AppProps, MenuData } from '../../services/types';

import { Container, Row, Button } from 'react-bootstrap';
import { fetchMessages } from '../../Redux/slices/messanger';
import instaposter from "../../assets/food_instagram_story.png";
import MessangerBtnIcon from '../../assets/profile/Discuter/messanger-btn.svg';
import { supplierServices } from '../../services/api/suppliers.api';
import { scrollToTop } from '../../utils/utils';
import MenuPopup from '../Popups/Menu/MenuPopup';
import Messanger from '../Popups/Messanger/Messanger';
import SameSupplierWarn from '../Popups/SameSupplierWarn/SameSupplierWarn';
import './menus.scss';

import moment from 'moment';
import ActiveGiftIcon from '../../assets/profile/ArchivedCommands/activeGift.svg';
import GiftIcon from '../../assets/profile/ArchivedCommands/gift.svg';
import FavorIcon from '../../assets/profile/ArchivedCommands/favor.svg';
import FavorActiveIcon from '../../assets/profile/ArchivedCommands/favor-active.svg';
import ClosedSupplier from '../Popups/ClosedSupplier/ClosedSupplier';

const Menu: React.FC<AppProps> = ({ initialData }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState<{ [key: string]: number }>({});
  const productsPerPage = 4;

  const [menuData, setMenuData] = useState<MenuData[]>((typeof window != 'undefined') ? [] : initialData?.menuResponse.data);
  const [showMismatchModal, setShowMismatchModal] = useState<boolean>(false);
  const [showClosedWarnModal, setShowClosedWarnModal] = useState<boolean>(false);
  const [showOptionsPopup, setShowOptionsPopup] = useState<boolean>(false);
  const [filtreddMenuData, setFiltreddMenuData] = useState<MenuData[]>([]);
  const [displayedRestaurant, setDisplayedRestaurant] = useState<any>();
  const { id, search, productId } = useParams<{ id: string, search?: string, productId?: string }>();
  const [selectedOption, setSelectedOption] = useState<string>(search ? search : "All");
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [closeTime, setCloseTime] = useState<string>('');
  const [searchTerms, setSearchTerms] = useState<string>('');
  const idNumber = id?.split('-')[0];
  const [categories, setCategories] = useState<any>("");
  const [isLoggedIn, setIsLoggedIn] = useState<any>(typeof window != 'undefined' ? localStorageService.getUserToken() : false);
  var currentDate = moment();
  var today = currentDate.format('ddd');  // Get the current day name (e.g., 'Mon', 'Tue', etc.)

  useEffect(() => {
    const schedules = displayedRestaurant ? displayedRestaurant.schedules : []
    var currentDayObject = schedules.find((day: any) => day.day === today);
    if (currentDayObject) {
      let closeTimeArray = currentDayObject.to.toString().split(':')
      let closeTime = `${closeTimeArray[0]}:${closeTimeArray[1]}`
      setCloseTime(closeTime)
    }
  }, [displayedRestaurant])

  // handle messanger
  const unReadMessages = useAppSelector((state) => state.messanger.unReadedMessages)
  const [messangerPopup, setMessangerPopup] = useState<boolean>(false)
  const [unReadedQt, setUnReadedQt] = useState<number>(unReadMessages)
  const [favor, setFavor] = useState<boolean>(false)

  useEffect(() => {
    setUnReadedQt(unReadMessages)
  }, [unReadMessages])

  const handleMessangerPopup = () => {
    setMessangerPopup(!messangerPopup)
  }
  useEffect(() => {
    fetchMessages()
  }, [])
  /*
  *
  * url handling part
  *
  */
  useEffect(() => {
    scrollToTop()
  }, [])

  // redirect if the url taped again
  useEffect(() => {
    if (productId != null) {
      let locationArray = location.pathname.split('/');
      if (locationArray[1] !== "product") {

        locationArray[1] = "product";
        const newUrl = locationArray.join("/");
        navigate(`${newUrl}`);
      }
    } else {
      if (search == null || search == "") {
        let locationArray = location.pathname.split('/')
        locationArray[3] = 'All'
        const newUrl = `${locationArray.join('/')}`
        navigate(newUrl, { replace: true })
      }
    }

  }, [])
  const removeUrlProductId = () => {
    const locationPath = location.pathname;

    let locationArray = locationPath.split("/");
    let newArray = locationArray.slice(0, -2)
    const newURL = newArray.join("/");
    navigate(newURL, { replace: true });

  }
  const handlePopup = () => {
    setShowOptionsPopup(!showOptionsPopup)
    showOptionsPopup && removeUrlProductId()
  }

  const handlePaginationClick = (pageNumber: number, menuItemId: number) => {
    setCurrentPage((prevPages) => ({
      ...prevPages,
      [menuItemId]: pageNumber,
    }));
  };
  const getSupplierById = async () => {
    let data: any;
    try {
      if (typeof window != "undefined") {
        data = await supplierServices.getSupplierById(Number(idNumber!))
        data = data.data;
        if (isLoggedIn?.length! > 0) {
          let favList: any = await userService.getClientFavorits();
          favList = favList.data.data.map((i: any) => Number(i.id))
          if (favList.includes(Number(idNumber))) {
            setFavor(true)
          }
          else {
            setFavor(false)
          }
        }
      }
      else data = initialData.supplierResponse

      let categories = data.data.categorys.map((item: any) => item.name)?.join(' - ')
      setCategories(categories)
      setDisplayedRestaurant(data.data)
    } catch (error) {
      throw error
    }
  }
  const getMenu = async () => {
    var data: any;
    try {
      if (typeof window != "undefined") {
        data = await productService.getMenu(idNumber)
        if (data.status === 200) {
          data = data.data
          setMenuData(data.data);
          setFiltreddMenuData(data.data)
        }
      }
      else {
        data = initialData.menuResponse.data
        setMenuData(data);
        setFiltreddMenuData(data)
      }
    } catch (error) {
      throw error
    }
  };

  const getSupplierIsOpen = async () => {
    const { status, data } = await supplierServices.getSupplierISoPENById(Number(idNumber!))
    data.data.is_open === 1 ? setIsOpen(true) : setIsOpen(false)
  }
  const handleFavorsAdd = async () => {
    const response = await userService.addfavorite(Number(idNumber))
    response.data.success && setFavor(true)
  }
  const deletefavorite = async () => {
    const response = await userService.deletefavorite(Number(idNumber))
    response.data.success && setFavor(false)
  }
  const updatefavorite = () => {
    if (favor) {
      deletefavorite()
    }
    else {
      handleFavorsAdd();
    }
  }
  useEffect(() => {
    fetchData();
  }, [])
  const fetchData = async () => {
    setLoading(true);
    await getSupplierById()
    await getMenu()
    handleFilter()
    await getSupplierIsOpen()
    setLoading(false);
  };

  // initialize menue 
  useEffect(() => {
    getMenu();
  }, [idNumber]);

  // open miss match
  const handleMismatchModal = () => {
    // handlePopup()
    setShowOptionsPopup(false)
    setShowMismatchModal(!showMismatchModal);
  };

  // handle closed warn popup
  const handleClosedWarnModal = () => {
    setShowClosedWarnModal(!showClosedWarnModal);
  };


  // close options
  const handleChooseOptions = (selectedMenuItem: any | null) => {
    const locationPath = location.pathname;
    let locationArray = locationPath.split("/");
    locationArray[4] = selectedMenuItem.id.toString();
    locationArray[1] = 'product';
    const newURL = locationArray.join("/");
    navigate(newURL);
  };

  const getTruncatedName = (name: string, MAX_NAME_LENGTH: number) => {
    return name.length > MAX_NAME_LENGTH
      ? `${name.slice(0, MAX_NAME_LENGTH)}...`
      : name;
  };

  const handleOptionChange = (event: any) => {
    const updatedURL = `/restaurant/${id}/${event.target.value}`;
    navigate(updatedURL, { replace: true });
    setSelectedOption(event.target.value);
  };

  const handleFilter = () => {
    if (selectedOption === "All") {
      if (searchTerms.length) {
        let filteredData = menuData.map((menu) => {
          return {
            ...menu,
            products: menu.products.filter(product =>
              product.name.toLowerCase().includes((searchTerms || '').toLowerCase())
            )
          }
        }).filter((item: any) => item.products.length)
        setFiltreddMenuData(filteredData)
      }
      else {
        setFiltreddMenuData(menuData)
      }
    }
    else {
      if (searchTerms.length) {
        let filtredData = menuData.map((menu) => {
          return {
            ...menu,
            products: menu.products.filter(product =>
              product.name.toLowerCase().includes((searchTerms || '').toLowerCase())
            )
          }
        }).filter((data) => {
          return data.name === selectedOption && data.products.length
        })
        setFiltreddMenuData(filtredData);
      }
      else {
        let filtredData = menuData.filter((data) => {
          return data.name === selectedOption
        })
        setFiltreddMenuData(filtredData)
      }
    }
  }

  useEffect(() => {
    handleFilter()
  }, [selectedOption, menuData])

  const handleSearch = (event: any) => {
    setSearchTerms(event?.target?.value);
  }
  useEffect(() => {
    handleFilter()
  }, [searchTerms])

  const Product = () => {
    return <>
      {
        loading ? (
          <CircularProgress sx={{ alignSelf: 'center', my: '2rem' }} />
        ) :
          (
            filtreddMenuData.length ?
              filtreddMenuData.map((menuItem: MenuData) => {
                const menuItemId = menuItem.id;
                const menuItemProducts = menuItem.products;
                const isDiscount = menuItem.is_discount
                const discountVal = isDiscount ? menuItem.discount_value : 0
                const indexOfLastProduct = currentPage[menuItemId]
                  ? currentPage[menuItemId] * productsPerPage
                  : productsPerPage;
                const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
                const displayedProducts = menuItemProducts.slice(
                  indexOfFirstProduct,
                  indexOfLastProduct
                );
                return (
                  <div key={menuItemId} className={`menu-item-container`}>
                    <div className="menu-item-header">
                      <span className='menu-item-header-title'>
                        {menuItem.name}
                      </span>
                      <div className='menu-item-header-info-container'>
                        {
                          !isDiscount &&
                          <span className='menu-item-header-choix'>
                            {menuItemProducts.length} choix
                          </span>
                        }
                        {
                          isDiscount && <span className='discount-label'>
                            {discountVal} %
                          </span>
                        }
                      </div>

                    </div>

                    <div className='product-container'>
                      <div className="product-grid">
                        {displayedProducts.map((product) => (
                          <div key={product.id} className="product-card">
                            <div className='info-container' >
                              <h4 className="product-title" >
                                {getTruncatedName(product.name, 10)}
                              </h4>
                              <p className="product-price">
                                {`${t('price')}: ${Math.round(product.price)} DT`}
                              </p>
                              <p className="product-description" dangerouslySetInnerHTML={{ __html: product.description }}></p>
                              <div className='labels-container'>
                                {
                                  product.is_popular ?
                                    <span className='popular-label'>Popular</span> : <></>
                                }
                                {
                                  product.discount_value && product.discount_value > 0 ?
                                    <span className='discount-label'>{product.discount_value} {product.discount_type === "PERCENTAGE" ? "%" : ""} </span> : <></>
                                }
                              </div>
                              <button className="product-button"
                                onClick={() => {
                                  handleChooseOptions(product);
                                }}>
                                <AddIcon className="product-button-icon" />
                              </button>
                            </div>
                            <div className="product-image-blc">
                              <img loading="lazy" src={
                                product.image[0]?.path ?
                                  product.image[0]?.path :
                                  displayedRestaurant?.images[0].pivot.type === "principal" ?
                                    displayedRestaurant?.images[0].path :
                                    displayedRestaurant?.images[1].path
                              } alt='product photo' className="product-image" />
                            </div>

                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pagination-blc">
                      {
                        menuItemProducts.length > productsPerPage ? (
                          <Pagination
                            style={{ marginTop: '1rem' }}
                            count={Math.ceil(menuItemProducts.length / productsPerPage)}
                            page={currentPage[menuItemId] || 1}
                            onChange={(event, page) =>
                              handlePaginationClick(page, menuItemId)
                            }
                          />
                        ) : (
                          <div className='epmty-pagination'>

                          </div>
                        )
                      }
                    </div>


                  </div>
                );
              }
              )
              :
              <>
                <div className="result-not-found">
                  <div className="result-not-found__title">Oups !</div>
                  <div className="result-not-found__text">
                    Aucun résultat correspondant à vos critères de recherche{" "}
                  </div>
                  <div className="result-not-found__icon"></div>
                </div>
              </>
          )}
    </>
  }
  const goBack = () => {
    navigate(-1);
  };

  return (
    <>
      <div className={`supplier-page-header`}>
        <Container className="supplier-page-header-container">
          <div className="btn-back-blc">
            <Button className="btn-back" variant="link" onClick={goBack}>Retour</Button>
          </div>
          {
            loading ?
              <>
                <div className="supplier-infos-area">
                  <Skeleton
                    variant="rectangular"
                    width={'100%'}
                    height={365}
                  />
                  <div>
                    <div className="loading-supplier-name">
                      <Skeleton
                        variant="rectangular"
                        width={85}
                        height={85}
                      />
                      <div className='loading-supplier-details'>
                        <Skeleton
                          variant="rectangular"
                          width={'100%'}
                          height={30}
                        />
                        <Skeleton
                          variant="rectangular"
                          width={'100%'}
                          height={20}
                        />
                      </div>
                    </div>
                    <div className="loading-supplier">
                      {[...Array(3)].map((_, index) => (
                        <div className='icons-loader' key={index + 20}>
                          <Skeleton
                            variant="rectangular"
                            width={40}
                            height={40}
                          />
                          <Skeleton
                            variant="rectangular"
                            width={160}
                            height={10}
                          />
                        </div>
                      ))
                      }
                      <Skeleton
                        variant="rectangular"
                        width={'100%'}
                        height={46}
                        style={{ backgroundColor: '#B2E9F0', borderRadius: 10 }}
                      />
                    </div>
                  </div>
                </div>
              </>
              :
              <div className="supplier-infos-area">
                <div className="background-container">
                  <img loading="lazy" src={displayedRestaurant?.images[0].path} alt="restaurant image" className="background" />
                </div>
                <div className="supplier-infos-blc">
                  <div className="supplier-title-area">
                    <div className="supplier-logo">
                      <img loading="lazy" src={displayedRestaurant?.images[0].pivot.type === "principal" ? displayedRestaurant?.images[0].path : displayedRestaurant?.images[1].path} alt="" />
                    </div>
                    <div className="supplier-title-blc">
                      <h1 className="supplier-title">{displayedRestaurant?.name}</h1>
                      <p className="supplier-desc">
                        {categories}
                      </p>
                    </div>
                  </div>
                  <div className="supplier-infos_list-wrapper">
                    <div className="supplier-infos_list-blc">
                      <div className="supplier-infos_list">
                        <ul>
                          <li>
                            <p className="supplier-infos_list-item location">
                              {displayedRestaurant?.city + ' ' + displayedRestaurant?.street + ' ' + displayedRestaurant?.postcode}
                            </p>
                          </li>
                          <li>
                            <p className={`supplier-infos_list-item time-work ${isOpen ? 'open' : 'close'}`}>
                              {
                                isOpen ?
                                  <span>{t("supplier.opentime")} {closeTime}</span>
                                  :
                                  <span>{t("closed")}</span>
                              }
                            </p>
                          </li>
                          <li>
                            <p className="supplier-infos_list-item shipping-cost">
                              {t('supplier.delivPrice')} {displayedRestaurant?.delivery_price} Dt
                            </p>
                          </li>
                        </ul>
                      </div>
                      <div className="supplier-infos_ratings-count">
                        <div className='rate-gouping'>
                          {isLoggedIn ?
                            <div className="favor" style={(favor) ? { backgroundImage: `url(${FavorActiveIcon})` } : { backgroundImage: `url(${FavorIcon})` }} onClick={updatefavorite}>
                            </div> : ""
                          }
                          {
                            displayedRestaurant?.bonus ? (
                              <div className='gift-icon' style={(displayedRestaurant?.bonus > 0) ? { backgroundImage: `url(${ActiveGiftIcon})` } : { backgroundImage: `url(${GiftIcon})` }}></div>
                            ) : (
                              <div className='gift-icon' style={{ backgroundImage: `url(${GiftIcon})` }}></div>
                            )
                          }
                        </div>
                        <div className="stars">
                          {
                            (displayedRestaurant?.star && (displayedRestaurant?.star > 0)) && (<span className='star-number'> {displayedRestaurant?.star}</span>)
                          }
                          {[...Array(5)].map((_, index) => (
                            <span key={index + 1}>
                              {(displayedRestaurant?.star && (displayedRestaurant?.star >= index + 1))
                                ? <Star className='starIcon' style={{ visibility: 'visible' }} /> : <StarBorderIcon className='starIcon' style={{ visibility: 'visible' }} />
                              }
                            </span>
                          ))}
                        </div>
                        <div className='time'>
                          {`${Number(displayedRestaurant?.medium_time) - 10}-${Number(displayedRestaurant?.medium_time + 10)}min`}
                        </div>
                      </div>
                    </div>
                    <div className="supplier-info-search">
                      <button className="btn btn-search"></button>
                      <div className="search-blc">
                        <input type="search" value={searchTerms} className="form-control" placeholder="Qu’est ce qu’on vous apporte ?" onInput={handleSearch} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          }
          <div className="categories-filters filers">
            {
              loading ?
                <div className='loading-container'>
                  {[...Array(4)].map((_, index) => (
                    <Skeleton
                      key={index + 5}
                      variant="rectangular"
                      width={180}
                      height={46}
                    />
                  ))}
                </div>
                :
                menuData.length != 0 && (
                  <>
                    <div className={`select ${selectedOption == "All" ? "selected" : ""}`}  >
                      <input type="radio" value="All" id='All' name='type' checked={selectedOption === "1"} onChange={handleOptionChange} />
                      <label htmlFor="All">{t('supplier.allProducts')}</label>
                    </div>
                    {
                      menuData.map((data, index) => {
                        return (
                          <React.Fragment key={index}>
                            <div className={`select ${selectedOption == data.name ? "selected" : ""}`}  >
                              <input type="radio" value={data.name} id={data.name} name='type' checked={selectedOption === data.name} onChange={handleOptionChange} />
                              <label htmlFor={data.name}>{data.name}</label>
                            </div>
                          </React.Fragment>
                        )

                      })
                    }

                  </>
                )
            }
          </div>
          {
            loading ?
              <>
                <div className='loading-category'>
                  <Skeleton
                    variant="rectangular"
                    width={'100%'}
                    height={56}
                  />
                </div>
                <div className='loading-menu'>
                  {[...Array(4)].map((_, index) => (
                    <Skeleton
                      key={index}
                      variant="rectangular"
                      width={375}
                      height={160}
                    />
                  ))}
                </div>
              </>
              :
              <div className="supplier-main-menu">
                <Product />
              </div>
          }

          <div className={'bulles'}>
            <button className={'messangerPopupBtn'} onClick={handleMessangerPopup} style={{ backgroundImage: `url(${MessangerBtnIcon})` }}>
              {unReadedQt > 0 && (
                <div className={'messangerBullNotifIcon'}>
                  {unReadedQt}
                </div>
              )}
            </button>
          </div>
          {
            messangerPopup &&
            <Messanger className='discuterMessangerPopup' close={handleMessangerPopup} />
          }
        </Container>
      </div>

      {/* 
      <Container fluid className={`supplier-page-main-container`}>
        <Row>
          <section className={`info-section `}>
            <div className="info-container">
              <div className="left-side">
                <div className='name'>{displayedRestaurant?.name}</div>
                {
                  displayedRestaurant &&
                  <div className='price'>{t("supplier.delivPrice")} <span className='price-value'> {displayedRestaurant?.delivery_price} dt</span></div>

                }
              </div>
              {displayedRestaurant &&
                <div className="right-side">
                  <div className='rate-gouping'>
                    {
                      (displayedRestaurant?.star && (displayedRestaurant?.star > 0)) && (<span className='star-number'> {displayedRestaurant?.star}</span>)
                    }
                    <Star className='starIcon' style={{ visibility: 'visible' }} />

                    {
                      displayedRestaurant?.bonus ? (
                        <div className='gift-icon' style={(displayedRestaurant?.bonus > 0) ? { backgroundImage: `url(${ActiveGiftIcon})` } : { backgroundImage: `url(${GiftIcon})` }}></div>
                      ) : (
                        <div className='gift-icon' style={{ backgroundImage: `url(${GiftIcon})` }}></div>
                      )
                    }
                  </div>

                  <div className='time'>
                    <p>
                      {`${Number(displayedRestaurant?.medium_time) - 10}-${Number(displayedRestaurant?.medium_time + 10)}min`}
                    </p>
                  </div>

                </div>
              }
            </div>
          </section>
        </Row>
        <Row className={`main-row`}>
          <div className={`supplier-page-side-bar`}>
            <div className={`pub-contained`}>
              <img loading="lazy" className='supplier-logo' src={displayedRestaurant?.images[0].pivot.type === "principal" ? displayedRestaurant?.images[0].path : displayedRestaurant?.images[1].path} alt="" />
              <div className={`pub-posts`}>
                <img loading="lazy" className='insta-img' src={instaposter} alt=" insta img posts" />
                <img loading="lazy" className='insta-img' src={instaposter} alt=" insta img posts" />
              </div>
            </div>
          </div>

          <section className={`main-container`}>
            <div className="filers">
              {
                menuData.length != 0 && (
                  <>
                    <div className={`select ${selectedOption == "All" ? "selected" : ""}`}  >
                      <input type="radio" value="All" id='All' name='type' checked={selectedOption === "1"} onChange={handleOptionChange} />
                      <label htmlFor="All">{t('supplier.allProducts')}</label>
                    </div>
                    {
                      menuData.map((data, index) => {
                        return (
                          <React.Fragment key={index}>
                            <div className={`select ${selectedOption == data.name ? "selected" : ""}`}  >
                              <input type="radio" value={data.name} id={data.name} name='type' checked={selectedOption === data.name} onChange={handleOptionChange} />
                              <label htmlFor={data.name}>{data.name}</label>
                            </div>
                          </React.Fragment>
                        )

                      })
                    }

                  </>
                )
              }
            </div>
            <Product />
          </section>
        </Row>

        <div className='bulles'>
          <button className='messanger-popup-btn' onClick={handleMessangerPopup} style={{ backgroundImage: `url(${MessangerBtnIcon})` }}>
            {unReadedQt > 0 && (
              <div className='messanger-bull-notif-icon'>
                {unReadedQt}
              </div>
            )}
          </button>
          <button className='phone-popup-btn' onClick={handlePhonePopup} style={{ backgroundImage: `url(${PhoneBtnIcon})` }}></button>
        </div>

        {
          messangerPopup && <Messanger className="discuter-messanger-popup" close={handleMessangerPopup} />
        }

      </Container>*/}
      {showMismatchModal && (
        <SameSupplierWarn close={handleMismatchModal} />
      )}
      {showOptionsPopup && (
        <MenuPopup openMissMatch={handleMismatchModal} close={handlePopup} restaurant={displayedRestaurant} isOpen={showOptionsPopup} />
      )}

      {showClosedWarnModal && (
        <ClosedSupplier close={handleClosedWarnModal} closeButtonText={t("continuer")} confirmButtonText='ok' message={t('popup.supplier.tryAgain')} />
      )}

    </>
  );
};

export default Menu;
