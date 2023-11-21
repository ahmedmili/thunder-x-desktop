import { Add as AddIcon, Star } from '@mui/icons-material';
import {
  CircularProgress,
  Pagination,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  clearCart,
  clearSupplierMismatch,
  setDeliveryPrice,
  setSupplier,
} from '../../Redux/slices/cart/cartSlice';
import { setProduct } from "../../Redux/slices/restaurantSlice";
import { useAppDispatch } from '../../Redux/store';
import { productService } from '../../services/api/product.api';
import { AppProps, MenuData } from '../../services/types';
import MismatchModal from '../mismatchModal/mismatchModal';

import { Container, Row } from 'react-bootstrap';
import instaposter from "../../assets/food_instagram_story.png";
import { supplierServices } from '../../services/api/suppliers.api';
import MenuPopup from '../Popups/Menu/MenuPopup';
import './menus.scss';


const Menu: React.FC<AppProps> = ({ initialData }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState((typeof window != 'undefined') ? true : false);
  const [currentPage, setCurrentPage] = useState<{ [key: string]: number }>({});
  const productsPerPage = 4;

  const [showMismatchModal, setShowMismatchModal] = useState(false);
  const [showOptionsPopup, setShowOptionsPopup] = useState(false);
  const [menuData, setMenuData] = useState<MenuData[]>((typeof window != 'undefined') ? [] : initialData?.menuResponse.data);
  const [filtreddMenuData, setFiltreddMenuData] = useState<MenuData[]>((typeof window != 'undefined') ? [] : initialData?.menuResponse.data);
  const [displayedRestaurant, setDisplayedRestaurant] = useState<any>((typeof window != 'undefined') ? null : initialData?.supplierResponse.data);
  const { id, search, productId } = useParams<{ id: string, search?: string, productId?: string }>();
  const [selectedOption, setSelectedOption] = useState(search ? search : "All");
  const idNumber = id?.split('-')[0];


  /*
  *
  * url handling part
  *
  */

  // redirect if the url taped again
  useEffect(() => {

    if (productId != null) {
      let locationArray = location.pathname.split('/');
      // console.log('Url', location.pathname)
      // console.log('locationArray', locationArray)
      if (locationArray[1] !== "product") {

        locationArray[1] = "product";
        const newUrl = locationArray.join("/");
        navigate(`${newUrl}`, { replace: true });
        // window.location.reload();
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

  useEffect(() => {
    getSupplierById()
    getMenu()
    handleFilter()
  }, [])

  // initialize menue 
  useEffect(() => {
    getMenu();
  }, [idNumber]);


  // close miss matching
  const handleMismatchModalClose = (choice: string) => {
    if (choice === 'continue') {
      dispatch(clearSupplierMismatch());
    } else if (choice === 'clear') {
      dispatch(clearCart());
      dispatch(clearSupplierMismatch());
      dispatch(setSupplier(null));
      dispatch(setDeliveryPrice(null));
    }

    setShowMismatchModal(false);
  };

  // close options
  const handleChooseOptions = (selectedMenuItem: any | null) => {
    showOptionsPopup === false && handleUrlProductId(selectedMenuItem.id)
    dispatch(setProduct(selectedMenuItem))
    handlePopup()
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
            <div className="open-time">
              <span>{t("supplier.opentime")} {displayedRestaurant?.closetime}</span>
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
                <div className='price'>{t("supplier.delivPrice")} <span className='price-value'> {displayedRestaurant?.delivery_price} dt</span></div>
              </div>

              <div className="right-side">
                <Star className='starIcon' style={displayedRestaurant?.star ? { visibility: 'visible' } : { visibility: 'hidden' }} />
                <div className='time'>
                  <p>
                    {`${displayedRestaurant?.medium_time - 10} - ${displayedRestaurant?.medium_time + 10
                      } min`}

                  </p>
                </div>
              </div>
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
      </Container>
      {showMismatchModal && (
        <MismatchModal onClose={handleMismatchModalClose} />
      )}
      {showOptionsPopup && (
        <MenuPopup close={handlePopup} restaurant={displayedRestaurant} isOpen={showOptionsPopup} />
      )}

    </>
  );
};

export default Menu;
