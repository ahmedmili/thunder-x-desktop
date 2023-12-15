import { Add as AddIcon, Star } from '@mui/icons-material';
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

import { Container, Row } from 'react-bootstrap';
import { fetchMessages } from '../../Redux/slices/messanger';
import instaposter from "../../assets/food_instagram_story.png";
import MessangerBtnIcon from '../../assets/profile/Discuter/messanger-btn.svg';
import { supplierServices } from '../../services/api/suppliers.api';
import { scrollToTop } from '../../utils/utils';
import MenuPopup from '../Popups/Menu/MenuPopup';
import Messanger from '../Popups/Messanger/Messanger';
import SameSupplierWarn from '../Popups/SameSupplierWarn/SameSupplierWarn';
import './menus.scss';

import ActiveGiftIcon from '../../assets/profile/ArchivedCommands/gift-active.png';
import GiftIcon from '../../assets/profile/ArchivedCommands/gift.svg';
import ClosedSupplier from '../Popups/ClosedSupplier/ClosedSupplier';


const Menu: React.FC<AppProps> = ({ initialData }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState((typeof window != 'undefined') ? true : false);
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
  const idNumber = id?.split('-')[0];

  // handle messanger
  const unReadMessages = useAppSelector((state) => state.messanger.unReadedMessages)
  const [messangerPopup, setMessangerPopup] = useState<boolean>(false)
  const [unReadedQt, setUnReadedQt] = useState<number>(unReadMessages)
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

  // assure '/' in the end of url
  useEffect(() => {
    const { pathname } = location;
    if (!pathname.endsWith('/') && pathname !== '/') {
      navigate(`${pathname}/`);
    }
  }, [location, navigate]);

  // add product id into url
  const handleUrlProductId = (id: number) => {
    const locationPath = location.pathname;
    if (Number(productId) != id) {
      let locationArray = locationPath.split("/");
      locationArray[4] = id.toString();
      const newURL = locationArray.join("/");
      navigate(newURL, { replace: true });
    }
  }

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
        data = data.data
      }
      else data = initialData.supplierResponse
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
    setLoading(false);
  };
  
  const getSupplierIsOpen = async () => {
    const { status, data } = await supplierServices.getSupplierISoPENById(Number(idNumber!))
    data.data.is_open === 1 ? setIsOpen(true) : setIsOpen(false)
  }

  useEffect(() => {
    getSupplierById()
    getMenu()
    handleFilter()
    getSupplierIsOpen()
  }, [])

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
    if (isOpen) {
      showOptionsPopup === false && handleUrlProductId(selectedMenuItem.id)
      dispatch(setProduct(selectedMenuItem))
      handlePopup()
    } else {
      handleClosedWarnModal()
    }
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
      setFiltreddMenuData(menuData)
    }
    else {
      let filtredData = menuData.filter((data) => {
        return data.name === selectedOption
      })
      setFiltreddMenuData(filtredData)
    }
  }

  useEffect(() => {
    handleFilter()
  }, [selectedOption, menuData])



  const Product = () => {
    return <>
      {
        loading ? (
          <CircularProgress sx={{ alignSelf: 'center', my: '2rem' }} />
        ) :
          (
            filtreddMenuData.map((menuItem) => {
              const menuItemId = menuItem.id;
              const menuItemProducts = menuItem.products;

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
                    <span className='menu-item-header-choix'>
                      {menuItemProducts.length} choix
                    </span>
                  </div>
                  {menuItemProducts.length > productsPerPage ? (
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

                  <div className='product-container'>
                    <div className="product-grid">
                      {displayedProducts.map((product) => (
                        <div key={product.id} className="product-card">
                          <div className='info-container' >
                            <p className="product-title" >
                              {getTruncatedName(product.name, 10)}
                            </p>
                            <p className="product-price">
                              {`${t('price')}: ${Math.round(product.price)} DT`}
                            </p>
                            <p className="product-description" dangerouslySetInnerHTML={{ __html: product.description }}></p>
                            <button className="product-button"
                              onClick={() => {
                                handleChooseOptions(product);
                              }}>
                              <AddIcon className="product-button-icon" />
                            </button>
                          </div>
                          <img loading="lazy" src={
                            product.image[0]?.path ?
                              product.image[0]?.path :
                              displayedRestaurant?.images[0].pivot.type === "principal" ?
                                displayedRestaurant?.images[0].path :
                                displayedRestaurant?.images[1].path
                          } alt='product photo' className="product-image" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }
            )
          )}
    </>
  }

  return (
    <>
      <Container fluid className={`supplier-page-header`} >
        <Row>
          <div className="background-container">
            <img loading="lazy" src={displayedRestaurant?.images[0].path} alt="restaurant image" className="background" />
            <div className={`open-time ${!isOpen && "closed-time"} `}>
              {
                isOpen ?
                  <span>{t("supplier.opentime")} {displayedRestaurant?.closetime}</span>
                  :
                  <span>{t("closed")}</span>

              }
            </div>
          </div>
        </Row>
      </Container>

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
          {/* <button className='phone-popup-btn' onClick={handlePhonePopup} style={{ backgroundImage: `url(${PhoneBtnIcon})` }}></button> */}
        </div>

        {
          messangerPopup && <Messanger className="discuter-messanger-popup" close={handleMessangerPopup} />
        }

      </Container>
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
