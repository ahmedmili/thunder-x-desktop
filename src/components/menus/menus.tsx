import { useEffect, useState } from 'react';
import { FoodItem, MenuData } from '../../services/types';
import { useLocation, useParams ,useNavigate } from 'react-router-dom';
import {
  CircularProgress,
  Pagination,

} from '@mui/material';
import { Add as AddIcon, Star } from '@mui/icons-material';
import missingImage from '../../assets/missingImage.png';
import { RootState, useAppDispatch } from '../../Redux/store';
import {
  clearCart,
  clearSupplierMismatch,
  setDeliveryPrice,
  setSupplier,
} from '../../Redux/slices/cart/cartSlice';
import {setProduct} from "../../Redux/slices/restaurantSlice"
import MismatchModal from '../mismatchModal/mismatchModal';
import { useTranslation } from 'react-i18next';
import { productService } from '../../services/api/product.api';

import './menus.scss'
import instaposter from "../../assets/food_instagram_story.png";
import { Container, Row, Col } from 'react-bootstrap';

interface MenuProps { }


const Menu: React.FC<MenuProps> = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [menuData, setMenuData] = useState<MenuData[]>([]);
  const { id } = useParams<{ id: string }>();
  // const [showOptions, setShowOptions] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const restaurant = location.state.restaurant;
  const [currentPage, setCurrentPage] = useState<{ [key: string]: number }>({});
  const productsPerPage = 4;



  const [showMismatchModal, setShowMismatchModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState("tous");
  const [filtreddMenuData, setFiltreddMenuData] = useState<MenuData[]>([]);
  const [selectedMenuItem, setSelectedMenuItem] = useState<FoodItem | null>(null);


  const handlePaginationClick = (pageNumber: number, menuItemId: number) => {
    setCurrentPage((prevPages) => ({
      ...prevPages,
      [menuItemId]: pageNumber,
    }));
  };


  // initialize menue 
  useEffect(() => {
    const getMenu = async () => {
      const { status, data } = await productService.getMenu(id);
      if (status === 200) {
        setMenuData(data.data);
        setFiltreddMenuData(data.data)
      }
      setLoading(false);
    };
    getMenu();
  }, [id]);


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
    // setShowOptions(true);
    
    setSelectedMenuItem(selectedMenuItem);
    dispatch(setProduct(selectedMenuItem))
    navigate('/product', {state:{restaurant:restaurant}})
  };


  const getTruncatedName = (name: string, MAX_NAME_LENGTH: number) => {
    return name.length > MAX_NAME_LENGTH
      ? `${name.slice(0, MAX_NAME_LENGTH)}...`
      : name;
  };
  const handleOptionChange = (event: any) => {
    setSelectedOption(event.target.value);
  };

  const handleFilter = () => {
    if (selectedOption === "tous") {
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
  }, [selectedOption])

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
                <div key={menuItemId} className="menu-item-container">
                  <div className="menu-item-header">
                    <span className='menu-item-header-title'>
                      {menuItem.name}
                    </span>
                    <span className='menu-item-header-choix'>
                      {menuItemProducts.length} choix
                    </span>
                  </div>

                  {menuItemProducts.length > productsPerPage && (
                    <Pagination
                      style={{ marginTop: '1rem' }}
                      count={Math.ceil(menuItemProducts.length / productsPerPage)}
                      page={currentPage[menuItemId] || 1}
                      onChange={(event, page) =>
                        handlePaginationClick(page, menuItemId)
                      }
                    />
                  )}

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

                            <p className="product-description">
                              {product.description}
                            </p>


                            <button className="product-button"
                              onClick={() => {
                                handleChooseOptions(product);
                              }}>
                              <AddIcon className="product-button-icon" />
                            </button>
                          </div>

                          <img src={product.image[0]?.path} alt='product photo' className="product-image" />
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
      <Container fluid className='supplier-page-header' >
        <Row>
          <div className="background-container">
            <img src={restaurant?.images[0].path} alt="restaurant image" className="background" />
            <div className="open-time">
              <span>Ouvert jusqu’à {restaurant?.closetime}</span>
            </div>
          </div>
        </Row>
      </Container>
   
          <Container fluid className='supplier-page-main-container'>
            <Row>
              <section className='info-section'>
                <div className="info-container">
                  <div className="left-side">
                    <div className='name'>{restaurant?.name}</div>
                    <div className='price'>Frais de livraison : <span className='price-value'> {restaurant?.service_price} dt</span></div>
                  </div>

                  <div className="right-side">
                    <Star className='starIcon' style={restaurant?.star ? { visibility: 'visible' } : { visibility: 'hidden' }} />
                    <div className='time'>
                      <p>
                        {`${restaurant?.medium_time - 10} - ${restaurant?.medium_time + 10
                          } min`}

                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </Row>
            <Row className='main-row'>
              <div className="side-bar">
                <div className="pub-contained">
                  <img className='supplier-logo' src={restaurant?.images[1].path} alt="" />
                  <div className="pub-posts">
                    <img className='insta-img' src={instaposter} alt=" insta img posts" />
                    <img className='insta-img' src={instaposter} alt=" insta img posts" />
                  </div>
                </div>
              </div>

              <section className='main-container'>
                <div className="filers">
                  {
                    menuData.length != 0 && (
                      <>
                        <div className={`select ${selectedOption == "tous" ? "selected" : ""}`}  >
                          <input type="radio" value="tous" id='tous' name='type' checked={selectedOption === "1"} onChange={handleOptionChange} />
                          <label htmlFor="tous">Tous les produits</label>
                        </div>
                        {
                          menuData.map((data, index) => {
                            return (
                              <>
                                <div key={index} className={`select ${selectedOption == data.name ? "selected" : ""}`}  >
                                  <input type="radio" value={data.name} id={data.name} name='type' checked={selectedOption === data.name} onChange={handleOptionChange} />
                                  <label htmlFor={data.name}>{data.name}</label>
                                </div>
                              </>
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

    </>
  );
};

export default Menu;
