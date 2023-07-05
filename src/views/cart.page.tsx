import React, { useEffect } from 'react';
import {
  clearCart,
  setComment,
  setDeliveryOption,
  setDeliveryPrice,
  setSupplier,
} from '../Redux/slices/cart/cartSlice';
import { Cart } from '../components/cart';
import { RootState, useAppDispatch, useAppSelector } from '../Redux/store';
import {
  Button,
  Box,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  TextField,
  Container,
} from '@mui/material';
import axios from 'axios';
import * as z from 'zod';
import { logout } from '../Redux/slices/user/userSlice';
import { FoodItem } from '../services/types';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const ApiEndpoint = import.meta.env.VITE_SERVER_ENDPOINT;

const CartPage: React.FC = () => {
  const { t } = useTranslation();
  const supplier = useAppSelector((state: RootState) => state.cart.supplier);
  const deliveryPrice = useAppSelector(
    (state: RootState) => state.cart.deliveryPrice
  );
  const [aComment, setAComment] = React.useState<string>('');
  const cartItems = useAppSelector((state: RootState) => state.cart.items);
  const userPosition = useAppSelector((state) => state.location.position);
  const deliveryOption = useAppSelector(
    (state: RootState) => state.cart.deliveryOption
  );
  const userItem = localStorage.getItem('user');
  const user = userItem ? JSON.parse(userItem) : null;
  const [name, setName] = React.useState(user?.firstname || '');
  const [phoneNumber, setPhoneNumber] = React.useState(user?.tel || '');
  const isAuthenticated = useAppSelector(
    (state) => state.userState.isAuthenticated
  );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const calculateOptionalPrice = (item: FoodItem) => {
    let optionalPrice = 0;
    if (item.optionalOptions) {
      optionalPrice = item.optionalOptions.reduce(
        (acc, option) =>
          acc +
          (option.checked && option.price
            ? parseFloat(option.price.toString())
            : 0),
        0
      );
    }
    return optionalPrice;
  };

  const total = cartItems.reduce((acc, item) => {
    if (item.price && item.quantity) {
      const parsedPrice = parseFloat(item.price.toString());
      const optionalPrice = calculateOptionalPrice(item);
      return acc + (parsedPrice + optionalPrice) * item.quantity;
    }
    return acc;
  }, parseFloat(JSON.stringify(Math.round(deliveryPrice))) || 0);

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAComment(event.target.value);
    localStorage.setItem('comment', event.target.value);
    dispatch(setComment(event.target.value));
  };

  useEffect(() => {
    window.localStorage.setItem('cart_items', JSON.stringify(cartItems));
    // console.log('item being passed to the cart -->', cartItems);
    if (cartItems.length == 0) {
      dispatch(setSupplier(null));
      dispatch(setDeliveryPrice(null));
    }
  }, [cartItems]);

  const submitOrder = async (
    cartItems: FoodItem[],
    deliveryOption: 'delivery' | 'pickup' | 'surplace',
    name: string,
    phoneNumber: string,
    aComment: string,
    total: number,
    dispatch: any,
    userPosition: any,
    supplier: number,
    deliveryPrice: number
  ) => {
    try {
      const order = {
        addresse_id: 1,
        supplier_id: supplier,
        delivery_price: Math.round(deliveryPrice),
        mode_pay: 1,
        total_price: total,
        products: cartItems.map((item) => ({
          id: item.id,
          supplier_id: item.supplier_id,
          qte: item.quantity, // set the quantity to the item's quantity
          options: item.optionalOptions
            .filter((option) => option.checked)
            .map((option) => ({ option_id: option.id })),
        })),
        lat: userPosition?.coords.latitude,
        lng: userPosition?.coords.longitude,
        total_price_coupon: 14,
        tip: 14,
        is_delivery: deliveryOption === 'delivery' ? 1 : 0,
        phone: phoneNumber,
        name: name,
        comment: aComment,
      };
      if (isAuthenticated) {
        // validate the order object against the schema
        orderSchema.parse(order);
        const userToken = localStorage.getItem('token');
        if (!userToken) {
          dispatch(logout());
          return;
        }

        // make the HTTP request using Axios
        const response = await axios.post(
          `${ApiEndpoint}/createcommand`,
          order,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
              Accept: 'application/json',
            },
          }
        );

        if (response.status === 200) {
          dispatch(clearCart());
          toast.success('Order submitted successfully', response.data);
          dispatch(setDeliveryPrice(0));
          dispatch(setComment(''));
          dispatch(setSupplier(null));
          navigate('/track-order');
        }
      } else {
        navigate('/login');
        toast.warn('You need to be logged in to make an order!');
      }
    } catch (error: any) {
      console.error('Error submitting order:', error.message);
      toast.error('Failed to submit order. Please try again.', error.message);
    }
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        minWidth: '600px',
        scrollbarWidth: 'none',
      }}>
      <Box
        width='100%'
        sx={{
          backgroundColor: '#fcfcfc',
          alignSelf: 'center',
          display: 'flex',
          flexDirection: 'column',
        }}>
        <Typography style={{ color: '#000000', margin: '1rem' }} variant='h4'>
          {t('cartPage.yourCart')}
        </Typography>
        <Typography
          style={{
            color: 'gray',
            marginTop: '-1rem',
            marginLeft: '1rem',
            fontSize: '1rem',
          }}
          variant='h6'>
          {t('cartPage.supplier')}:{' '}
          {supplier ? supplier.name : t('cartPage.noSupplierYet')}
        </Typography>

        <Cart items={cartItems} />
        <Typography
          style={{
            color: '#3B3B3B',
            marginLeft: '1rem',
            marginBottom: '-1rem',
            fontSize: '1rem',
          }}
          variant='h6'>
          {t('cartPage.delivery')}:{' '}
          {deliveryPrice ? Math.round(deliveryPrice) : '0'} DT
        </Typography>
        <Typography style={{ color: '#000000', margin: '1rem' }} variant='h6'>
          {t('cartPage.total')}: {total} DT
        </Typography>
        <TextField
          label={t('cartPage.addComment')}
          value={aComment}
          onChange={handleCommentChange}
          fullWidth
          margin='normal'
        />
        <RadioGroup
          value={deliveryOption}
          onChange={(event: any) =>
            dispatch(setDeliveryOption(event.target.value))
          }
          sx={{
            alignSelf: 'center',
            display: 'flex',
            flexDirection: 'row',
          }}>
          <FormControlLabel
            style={{ color: '#000000' }}
            value='delivery'
            control={<Radio />}
            label={t('livraison')}
          />
          <FormControlLabel
            style={{ color: '#000000' }}
            value='pickup'
            control={<Radio />}
            label={t('emporter')}
          />
          <FormControlLabel
            style={{ color: '#000000' }}
            value='surplace'
            control={<Radio />}
            label='Sur place'
          />
        </RadioGroup>
        <Box>
          <TextField
            label={t('cartPage.name')}
            value={name}
            onChange={(event) => setName(event.target.value)}
            fullWidth
            margin='normal'
          />
          <TextField
            label={t('cartPage.phoneNumber')}
            value={phoneNumber}
            onChange={(event) => setPhoneNumber(event.target.value)}
            fullWidth
            margin='normal'
          />
        </Box>
        <Button
          variant='contained'
          color='primary'
          style={{ margin: '2rem' }}
          onClick={() =>
            submitOrder(
              cartItems,
              deliveryOption,
              name,
              phoneNumber,
              aComment,
              total,
              dispatch,
              userPosition,
              supplier.id,
              deliveryPrice
            )
          }>
          {t('submitOrder')}
        </Button>
      </Box>
    </Container>
  );
};

export default CartPage;

const nameSchema = z
  .string()
  .regex(/^[A-Za-z\s]+$/, 'Name must contain only letters and spaces')
  .min(1, 'Name is required');

const phoneSchema = z
  .string()
  .min(8, 'Phone number must be 8 digits long')
  .max(13, 'Phone number must be 8 digits long')
  .optional();

const orderSchema = z.object({
  supplier_id: z.number(),
  addresse_id: z.number(),
  delivery_price: z.number(),
  mode_pay: z.number(),
  total_price: z.number(),
  products: z.array(
    z.object({
      id: z.number(),
      supplier_id: z.number(),
      qte: z.number(),
      options: z.array(z.object({ option_id: z.number() })),
    })
  ),
  tip: z.number(),
  total_price_coupon: z.number(),
  lat: z.number(),
  lng: z.number(),
  is_delivery: z.number(),
  phone: phoneSchema,
  name: nameSchema,
});
