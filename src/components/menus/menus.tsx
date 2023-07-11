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
  Container,
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

import './menus.css'

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
      const {status,data} = await productService.getMenu(id);
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
        const {status,data} = await productService.getProduct(selectedMenuItem?.id);
        if(status === 200){
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
  return (
    <>
      <CardMedia
        component='img'
        height='350px'
        image={restaurant?.images[0].path}
        onError={(e: any) => {
          e.target.onerror = null;
          e.target.src = missingImage;
        }}
      />
      <Container maxWidth="lg" className="container">

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

        <Typography
          variant='h4'
          className='restaurant-name' >
          Menu {restaurant.name}
        </Typography>
        <Box
          className='rating-container'
        >
          <Typography className="rating-text">
            {restaurant.star ? restaurant.star : t('noRating')}
          </Typography>
          <Star sx={{ ml: '0.3rem', color: '#FFD700' }} />
        </Box>
        <Box className="time-container">
          {restaurant.medium_time ? (
            <Typography variant='subtitle2'>
              {`${restaurant.medium_time - 10}mins - ${restaurant.medium_time + 10
                }mins`}
            </Typography>
          ) : (
            <Typography variant='subtitle2'></Typography>
          )}
        </Box>
        <Typography variant='h5'>
          {t('delivery_price')} {restaurant.delivery_price} DT
        </Typography>

        {loading ? (
          <CircularProgress sx={{ alignSelf: 'center', my: '2rem' }} />
        ) : (
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
              <Box key={menuItemId} className="menu-item-container">
                <Box className="menu-item-header">
                  <Typography variant='h5' className='menu-item-header-title'>
                    {menuItem.name}
                  </Typography>
                </Box>

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
                <Box
                  className='product-container'>
                  <Grid container spacing={2} className="product-grid">
                    {displayedProducts.map((product) => (
                      <Card
                        key={product.id}
                        className="product-card">
                        <div
                         className="product-image">
                          <CardMedia
                            component='img'
                            height='150'
                            image={product.image[0]?.path}
                            loading='lazy'
                          />
                        </div>

                        <CardContent sx={{ flexGrow: 1 }}>
                          <Tooltip title={product.name} arrow>
                            <Typography
                              variant='h5'
                              className="product-title"
                              >
                              {getTruncatedName(product.name, 20)}
                            </Typography>
                          </Tooltip>

                          <Tooltip
                            title={
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: product.description,
                                }}
                              />
                            }
                            arrow>
                            <Typography
                              variant='body1'
                              className="product-description">
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: getTruncatedName(
                                    product.description,
                                    90
                                  ),
                                }}
                              />
                            </Typography>
                          </Tooltip>

                          <Typography variant='h6'  className="product-price">
                            {`${t('price')}: ${Math.round(product.price)} DT`}
                          </Typography>

                          <Button
                            variant='contained'
                            className="product-button"
                            onClick={() => {
                              handleChooseOptions(product);
                            }}>
                            <AddIcon className="product-button-icon"/>{' '}
                            {t('choose_options')}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </Grid>
                </Box>
              </Box>
            );
          })
        )}
      </Container>
    </>
  );
};

export default Menu;
