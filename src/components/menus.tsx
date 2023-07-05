import { Key, useEffect, useState } from 'react';
import { FoodItem, MenuData } from '../services/types';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
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
import { Add as AddIcon } from '@mui/icons-material';
import missingImage from '../assets/missingImage.png';
import { RootState, useAppDispatch } from '../Redux/store';
import {
  addItem,
  clearCart,
  clearSupplierMismatch,
  setSupplierMismatch,
  setSupplier,
  setDeliveryPrice,
} from '../Redux/slices/cart/cartSlice';
import { Option } from '../services/types';
import { useSelector } from 'react-redux';
import MismatchModal from './mismatchModal';
import { useTranslation } from 'react-i18next';
import { stringify } from 'querystring';

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
    // For example, let's say the new delivery price is 10 and new supplier state is 'New York'
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
    <Container maxWidth='lg'>
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
              overflow: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}>
            <Typography variant='h4' sx={{ fontWeight: 'bold', mb: '1rem' }}>
              {t('menu_options')} {selectedMenuItem?.name}
            </Typography>
            {options.length == 0 ? (
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
                    <Typography variant='h6' sx={{ mb: '0.5rem' }}>
                      {t('sauce')}
                    </Typography>
                    <FormControl component='fieldset'>
                      <FormLabel component='legend'>
                        {t('select_one_option')}
                      </FormLabel>
                      <RadioGroup
                        aria-label='obligatory-options'
                        name='obligatory-options'
                        value={selectedObligatoryOption?.id || ''} // value is the ID of the selected option
                        onChange={handleObligatoryOptionChange}>
                        {obligatoryOptions.map((option) => (
                          <FormControlLabel
                            key={option.id}
                            value={option.id.toString()} // convert ID to string to avoid warning
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
                    <Typography variant='h6' sx={{ mb: '0.5rem' }}>
                      {t('extras')}
                    </Typography>
                    <FormControl component='fieldset'>
                      <FormLabel component='legend'>
                        {t('select_one_or_multiple_extras')}
                      </FormLabel>
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
                  disabled={!selectedObligatoryOption} // button is disabled if no obligatory option is selected
                >
                  {t('add_to_cart')}
                </Button>
              </Box>
            )}
          </div>
        </div>
      )}
      <CardMedia
        component='img'
        height='150'
        image={menuData[0]?.image}
        onError={(e: any) => {
          e.target.onerror = null;
          e.target.src = missingImage;
        }}
      />
      <Typography variant='h3' sx={{ fontWeight: 'bold', mt: '1rem' }}>
        Menu {restaurant.name}
      </Typography>
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
            <Box key={menuItemId} sx={{ marginTop: '2rem' }}>
              <Typography variant='h4' sx={{ fontWeight: 'bold' }}>
                {menuItem.name}
              </Typography>
              {menuItemProducts.length > productsPerPage && (
                <Pagination
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
                        maxHeight: '380px',
                        width: '370px',
                        display: 'flex',
                        flexDirection: 'column',
                        margin: '0.5rem',
                        boxShadow: '1px 2px 4px 2px rgba(0,0,0,0.15)',
                      }}>
                      <CardMedia
                        component='img'
                        height='150'
                        image={product.image[0]?.path}
                        alt={product.name}
                        loading='lazy'
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Tooltip title={product.name} arrow>
                          <Typography variant='h5' sx={{ fontWeight: 'bold' }}>
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
                          color='primary'
                          startIcon={<AddIcon />}
                          sx={{ marginTop: '1rem', marginBottom: '1rem' }}
                          onClick={() => {
                            handleChooseOptions(product);
                            // console.log('selectedMenuItem    :', product);
                          }}>
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
  );
};

export default Menu;
