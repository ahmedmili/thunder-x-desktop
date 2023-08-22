import { useEffect, useState } from 'react';
import { FoodItem, MenuData } from '../../services/types';
import { useLocation, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Checkbox,
  CircularProgress,
  // Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  Pagination,
  Radio,
  RadioGroup,
  Tooltip,
  Typography,
} from '@mui/material';
import { Add as AddIcon, Star } from '@mui/icons-material';
import missingImage from '../../assets/missingImage.png';
import { RootState, useAppDispatch } from '../../Redux/store';
import {
  addItem,
  clearCart,
  clearSupplierMismatch,
  setSupplierMismatch,
  setSupplier,
  setDeliveryPrice,
} from '../../Redux/slices/cart/cartSlice';
import { Option } from '../../services/types';
import { useSelector } from 'react-redux';
import MismatchModal from '../mismatchModal/mismatchModal';
import { useTranslation } from 'react-i18next';
import { localStorageService } from '../../services/localStorageService';
import { productService } from '../../services/api/product.api';

import './menus.scss'
import instaposter from "../../assets/food_instagram_story.png";

import { Container, Row, Col } from 'react-bootstrap';

interface MenuProps { }

const ApiEndpoint = import.meta.env.VITE_SERVER_ENDPOINT;

const Menu: React.FC<MenuProps> = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [menuData, setMenuData] = useState<MenuData[]>([]);
  const { id } = useParams<{ id: string }>();
  const [showOptions, setShowOptions] = useState(false);
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMenuItem, setSelectedMenuItem] = useState<FoodItem | null>(
    null
  );
  const [itemToAdd, setItemToAdd] = useState<FoodItem | null>(null);
  const { items } = useSelector((state: RootState) => state.cart);
  const location = useLocation();
  const restaurant = location.state.restaurant;
  const [currentPage, setCurrentPage] = useState<{ [key: string]: number }>({});
  const productsPerPage = 3;


  const handlePaginationClick = (pageNumber: number, menuItemId: number) => {
    setCurrentPage((prevPages) => ({
      ...prevPages,
      [menuItemId]: pageNumber,
    }));
  };

  const handleSelectMenuItem = (menuData: FoodItem) => {
    setSelectedMenuItem(menuData);
  };

  const [obligatoryOptions, setObligatoryOptions] = useState<Option[]>([]);
  const [optionalOptions, setOptionalOptions] = useState<Option[]>([]);
  const [selectedObligatoryOption, setSelectedObligatoryOption] =
    useState<Option | null>(null);
  const [selectedOptionalOption, setSelectedOptionalOption] =
    useState<Option | null>(null);
  const [showMismatchModal, setShowMismatchModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState(1);

  useEffect(() => {
    // Separate the options into obligatory and optional arrays based on the `type` property
    const obligatory = options.filter((option) => option.type === 'option');
    const optional = options.filter((option) => option.type == 'extra');
    setObligatoryOptions(obligatory);
    setOptionalOptions(optional);
  }, [options]);

  const handleObligatoryOptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const option = obligatoryOptions.find(
      (opt) => opt.id === parseInt(event.target.value)
    );
    setSelectedObligatoryOption(option || null);
  };

  const handleOptionalOptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const optionId = parseInt(event.target.value);
    const updatedOptionalOptions = optionalOptions.map((option) =>
      option.id === optionId
        ? { ...option, checked: event.target.checked }
        : option
    );
    setOptionalOptions(updatedOptionalOptions);
  };

  useEffect(() => {
    const getMenu = async () => {
      const { status, data } = await productService.getMenu(id);
      if (status === 200) {
        setMenuData(data.data);
      }
      setLoading(false);
    };
    getMenu();
  }, [id]);

  const handleAddToCart = (selectedMenuItem: FoodItem) => {
    const selectedItem = {
      supplier_id: restaurant.id,
      id: selectedMenuItem?.id,
      name: selectedMenuItem?.name,
      price: selectedMenuItem?.price,
      image: selectedMenuItem?.image,
      quantity: 1,
      obligatoryOptions: selectedObligatoryOption
        ? [selectedObligatoryOption]
        : [],
      optionalOptions: optionalOptions.filter((option) => option.checked),
    };

    // Check if there are any items in the cart and if their supplier_id doesn't match the selected item's supplier_id
    if (items.length > 0 && items[0].supplier_id !== selectedItem.supplier_id) {
      setShowOptions(false);
      setShowMismatchModal(true);
      return;
    }

    // Dispatch actions to update delivery price and supplier state here
    dispatch(setDeliveryPrice(restaurant.delivery_price));
    dispatch(setSupplier(restaurant));
    localStorageService.setSupplier(restaurant);
    dispatch(addItem(selectedItem));
  };

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

  useEffect(() => {
    if (items.length === 0 && itemToAdd !== null) {
      handleAddToCart(itemToAdd);
      setItemToAdd(null);
    }
  }, [items, itemToAdd]);

  const handleChooseOptions = (selectedMenuItem: any | null) => {
    setShowOptions(true);
    setSelectedMenuItem(selectedMenuItem);
  };

  useEffect(() => {
    const getOptions = async () => {
      try {
        const { status, data } = await productService.getProduct(selectedMenuItem?.id);
        if (status === 200) {
          setOptions(data.data.product.options);
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    getOptions();
  }, [selectedMenuItem]);

  useEffect(() => {
    if (showOptions) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [showOptions]);

  const getTruncatedName = (name: string, MAX_NAME_LENGTH: number) => {
    return name.length > MAX_NAME_LENGTH
      ? `${name.slice(0, MAX_NAME_LENGTH)}...`
      : name;
  };
  const handleOptionChange = (event: any) => {
    setSelectedOption(parseInt(event.target.value));
  };
  useEffect(() => {
    console.log("restaurant", restaurant)
  }, [])

  const Product = () => {

    return <>
      {
        // loading ? (
        //   <CircularProgress sx={{ alignSelf: 'center', my: '2rem' }} />
        // ) : 
        // (
        menuData.map((menuItem) => {
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
                  choix
                </span>
              </div>

              {/* {menuItemProducts.length > productsPerPage && (
                <Pagination
                  style={{ marginTop: '1rem' }}
                  count={Math.ceil(menuItemProducts.length / productsPerPage)}
                  page={currentPage[menuItemId] || 1}
                  onChange={(event, page) =>
                    handlePaginationClick(page, menuItemId)
                  }
                />
              )} */}

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
                          {getTruncatedName(product.description, 27)}
                        </p>


                        <button className="product-button"
                          onClick={() => {
                            handleChooseOptions(product);
                          }}>
                          {/* <AddIcon className="product-button-icon" /> */}
                          +
                        </button>
                      </div>

                      <div >
                        <img src={product.image[0]?.path} alt='product photo' className="product-image"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        }
          // )
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

        <Row>
          <div className="info-container">
            <div className="left-side">
              <div className='name'>{restaurant?.name}</div>
              <div className='price'>Frais de livraison : <span className='price-value'> {restaurant?.service_price} dt</span></div>
            </div>

            <div className="right-side">
              {/* style={restaurant?.star ? { visibility: 'visible' } : { visibility: 'hidden' }} */}
              <Star className='starIcon' />
              <div className='time'>
                <p>
                  {`${restaurant?.medium_time - 10} - ${restaurant?.medium_time + 10
                    } min`}

                </p>
              </div>
            </div>
          </div>
        </Row>
      </Container>
      <Container fluid className='supplier-page-main-container'>
        <Row className='main-row'>
          <div className="pub-contained">
            <img className='supplier-logo' src={restaurant?.images[1].path} alt="" />
            <div className="pub-posts">
              <img className='insta-img' src={instaposter} alt=" insta img posts" />
              <img className='insta-img' src={instaposter} alt=" insta img posts" />
            </div>
          </div>
          <section className='main-container'>
            <div className="filers">
              <div className={`select ${selectedOption == 1 ? "selected" : ""}`}  >
                <input type="radio" value="1" id='tout' name='type' checked={selectedOption === 1} onChange={handleOptionChange} />
                {/* <label htmlFor="domicile">{t("domicile")}</label> */}
                <label htmlFor="tout">Tous les produits</label>
              </div>
              <div className={`select ${selectedOption == 2 ? "selected" : ""}`}  >
                <input type="radio" value="2" id='poulettes' name='type' checked={selectedOption === 2} onChange={handleOptionChange} />
                {/* <label htmlFor="travail"> {t("tavail")}</label> */}
                <label htmlFor="poulettes">Poulettes</label>
              </div>
            </div>
            <Product />


          </section>
        </Row>
      </Container>

      {/*         
        {showMismatchModal && (
          <MismatchModal onClose={handleMismatchModalClose} />
        )}
        {showOptions && (
          <div
            className="modal"
            onClick={() => {
              setShowOptions(false);
              setSelectedObligatoryOption(null);
              setSelectedOptionalOption(null);
            }}>
            <div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}>
              <div className="modal-content-image">
                <div className="modal-content-image-inner"
                  style={{ backgroundImage: `url(${selectedMenuItem?.image[0]?.path})`, }}>
                </div>
              </div>
              <div className="modal-content-options">
                <Box>
                  <Typography
                    variant='h5'
                    className="menu-title"                    >
                    {t('menu_options')} {selectedMenuItem?.name}
                  </Typography>
                  {options.length === 0 ? (
                    <>
                      <Typography variant='h6' className="no-options-needed">
                        {t('no_options_needed')}
                      </Typography>
                      <Button
                        variant='contained'
                        color='primary'
                        startIcon={<AddIcon />}
                        className="add-to-cart-button"
                        onClick={() => {
                          if (selectedMenuItem !== null) {
                            handleAddToCart(selectedMenuItem);
                            setShowOptions(false);
                            setSelectedObligatoryOption(null);
                            setSelectedOptionalOption(null);
                            setSelectedMenuItem(null);
                          }
                        }}>
                        {t('add_to_cart')}
                      </Button>
                    </>
                  ) : (
                    <Box className="menu-options">
                      {obligatoryOptions.length > 0 && (
                        <Box className="obligatory-options">

                          <Box>
                            <Typography variant="h6" className="obligatory-options-title">
                              {t('sauce')}
                            </Typography>
                            <Typography variant="body2" className="option-label">
                              {t('select_one_option')}
                            </Typography>
                          </Box>

                          <FormControl component='fieldset'>
                            <RadioGroup
                              aria-label='obligatory-options'
                              name='obligatory-options'
                              value={selectedObligatoryOption?.id || ''}
                              onChange={handleObligatoryOptionChange}>
                              {obligatoryOptions.map((option) => (
                                <FormControlLabel
                                  key={option.id}
                                  value={option.id.toString()}
                                  control={<Radio />}
                                  label={`${option.name} (${option.price} DT)`}
                                />
                              ))}
                            </RadioGroup>
                          </FormControl>
                        </Box>
                      )}

                      {optionalOptions.length > 0 && (
                        <Box className='menu-extras'>
                          <Box className="menu-extras-header">
                            <Typography className="menu-extras-header-title" variant='h6'>
                              {t('extras')}
                            </Typography>
                            <Typography className="menu-extras-header-subtitle" variant='body2'>
                              {t('select_one_or_multiple_extras')}
                            </Typography>
                          </Box>
                          <FormControl component='fieldset'>
                            <FormGroup>
                              {optionalOptions.map((option) => (
                                <FormControlLabel
                                  key={option.id}
                                  control={
                                    <Checkbox
                                      checked={option.checked || false}
                                      onChange={handleOptionalOptionChange}
                                      value={option.id.toString()}
                                    />
                                  }
                                  label={`${option.name} (${option.price} DT)`}
                                />
                              ))}
                            </FormGroup>
                          </FormControl>
                        </Box>
                      )}
                      <Button
                        className="add-to-cart-button"

                        variant='contained'
                        color='primary'
                        startIcon={<AddIcon />}
                        onClick={() => {
                          if (selectedMenuItem !== null) {
                            handleAddToCart(selectedMenuItem);
                            setShowOptions(false);
                            setSelectedObligatoryOption(null);
                            setSelectedOptionalOption(null);
                            setSelectedMenuItem(null);
                          }
                        }}
                        disabled={
                          obligatoryOptions.length > 0 &&
                          !selectedObligatoryOption
                        }>
                        {t('add_to_cart')}
                      </Button>
                    </Box>
                  )}
                </Box>
              </div>
            </div>
          </div>
        )}

        
        
        */}
    </>
  );
};

export default Menu;
