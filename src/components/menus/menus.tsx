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

interface MenuProps {}

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
  // console.log('restaurant  =>', restaurant);
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
    const fetchMenuData = async () => {
      const response = await fetch(`${ApiEndpoint}/getmenu`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `supplier_id=${id}`,
      });
      const responseData = await response.json();
      if (responseData.success) {
        setMenuData(responseData.data);
      }
      setLoading(false);
    };
    fetchMenuData();
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
    window.localStorage.setItem('supplier', JSON.stringify(restaurant));
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
    const fetchOptions = async () => {
      try {
        const response = await fetch(
          `${ApiEndpoint}/getProduct/${selectedMenuItem?.id}`
        );
        if (!response.ok) {
          throw new Error(
            `Failed to fetch options for product ${selectedMenuItem}`
          );
        }
        const data = await response.json();
        setOptions(data.data.product.options);
        console.log('options API response', options);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOptions();
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
      <Container
        maxWidth='lg'
        style={{
          backgroundColor: '#F5F5F5',
          borderRadius: '2rem',
          padding: '3rem',
          position: 'relative',
          top: '-150px',
        }}>
        {showMismatchModal && (
          <MismatchModal onClose={handleMismatchModalClose} />
        )}
        {showOptions && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 999,
            }}
            onClick={() => {
              setShowOptions(false);
              setSelectedObligatoryOption(null);
              setSelectedOptionalOption(null);
            }}>
            <div
              style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '0.5rem',
                margin: '5rem',
                boxShadow: '1px 2px 4px 2px rgba(0, 0, 0, 0.2)',
                maxHeight: '95vh',
                display: 'flex', // Added to create a flex container
              }}
              onClick={(e) => e.stopPropagation()}>
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  overflow: 'hidden',
                  marginRight: '1.5rem',
                }}>
                <div
                  style={{
                    backgroundImage: `url(${selectedMenuItem?.image[0]?.path})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    width: '400px',
                    height: '100%',
                  }}></div>
              </div>
              <div style={{ flex: 1, overflow: 'auto' }}>
                <Box>
                  <Typography
                    variant='h5'
                    sx={{ fontWeight: 'bold', mb: '1rem' }}>
                    {t('menu_options')} {selectedMenuItem?.name}
                  </Typography>
                  {options.length === 0 ? (
                    <>
                      <Typography variant='h6' sx={{ mb: '0.5rem' }}>
                        {t('no_options_needed')}
                      </Typography>
                      <Button
                        variant='contained'
                        color='primary'
                        startIcon={<AddIcon />}
                        sx={{ marginTop: '1rem', marginBottom: '1rem' }}
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
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      {obligatoryOptions.length > 0 && (
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            mb: '1rem',
                          }}>
                          <Box
                            sx={{
                              backgroundColor: '#1F94A4',
                              px: '2.5rem',
                              py: '0.5rem',
                              textTransform: 'lowercase',
                            }}>
                            <Typography
                              variant='h6'
                              sx={{
                                color: 'white',
                                textTransform: 'capitalize',
                              }}>
                              {t('sauce')}
                            </Typography>
                            <Typography
                              variant='body2'
                              sx={{
                                color: 'whitesmoke',
                                textTransform: 'capitalize',
                              }}>
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
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            mb: '1rem',
                          }}>
                          <Box
                            sx={{
                              backgroundColor: '#1F94A4',
                              px: '2.5rem',
                              py: '0.5rem',
                              textTransform: 'lowercase',
                            }}>
                            <Typography
                              variant='h6'
                              sx={{
                                color: 'white',
                                textTransform: 'capitalize',
                              }}>
                              {t('extras')}
                            </Typography>
                            <Typography
                              variant='body2'
                              sx={{
                                color: 'whitesmoke',
                                textTransform: 'capitalize',
                              }}>
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
                        variant='contained'
                        color='primary'
                        startIcon={<AddIcon />}
                        sx={{ marginTop: '1rem', marginBottom: '1rem' }}
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
          sx={{ fontWeight: 'bold', mt: '1rem', textTransform: 'capitalize' }}>
          Menu {restaurant.name}
        </Typography>
        <Box
          display='flex'
          alignItems='center'
          justifyContent='flex-end'
          p='0.2rem 0.4rem'
          position='absolute'
          top='4rem'
          right='3rem'
          zIndex={1}>
          <Typography fontSize={20}>
            {restaurant.star ? restaurant.star : t('noRating')}
          </Typography>
          <Star sx={{ ml: '0.3rem', color: '#FFD700' }} />
        </Box>
        <Box
          display='flex'
          alignItems='center'
          justifyContent='flex-end'
          bgcolor='rgba(237, 199, 47, 0.8)'
          p='0.2rem 0.4rem'
          borderRadius='1rem'
          position='absolute'
          top='6.5rem'
          right='3.7rem'
          zIndex={1}>
          {restaurant.medium_time ? (
            <Typography variant='subtitle2'>
              {`${restaurant.medium_time - 10}mins - ${
                restaurant.medium_time + 10
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
              <Box
                key={menuItemId}
                sx={{ marginTop: '2rem', flexDirection: 'column' }}>
                <Box
                  sx={{
                    backgroundColor: '#1F94A4',
                    px: '2.5rem',
                    py: '0.5rem',
                    textTransform: 'lowercase',
                  }}>
                  <Typography
                    variant='h5'
                    sx={{
                      fontWeight: 'bold',
                      color: 'whitesmoke',
                      textTransform: 'capitalize',
                    }}>
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
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                  }}>
                  <Grid container spacing={2} sx={{ marginTop: '1rem' }}>
                    {displayedProducts.map((product) => (
                      <Card
                        key={product.id}
                        sx={{
                          height: '100%',
                          width: '355px',
                          display: 'flex',
                          flexDirection: 'column',
                          margin: '0.5rem',
                          boxShadow: '1px 2px 4px 2px rgba(0,0,0,0.15)',
                        }}>
                        <div
                          style={{
                            height: '150px',
                            backgroundColor: '#F8F8F8',
                          }}>
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
                              sx={{ fontWeight: 'bold' }}>
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
                              sx={{ marginTop: '0.5rem' }}>
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

                          <Typography variant='h6' sx={{ marginTop: '0.5rem' }}>
                            {`${t('price')}: ${Math.round(product.price)} DT`}
                          </Typography>

                          <Button
                            variant='contained'
                            sx={{
                              marginBottom: '-1rem',
                              marginTop: '1rem',
                              backgroundColor: '#1F94A4',
                              borderRadius: '5rem',
                              display: 'flex',
                              alignItems: 'right',
                              justifyConent: 'flex-end',
                              boxShadow:
                                '1px 2px 4px 2px rgba(255,255,255,0.2)',
                            }}
                            onClick={() => {
                              handleChooseOptions(product);
                            }}>
                            <AddIcon sx={{ color: 'whitesmoke' }} />{' '}
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
