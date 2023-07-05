import { useAppDispatch } from '../Redux/store';
import { removeItem, changeItemQuantity } from '../Redux/slices/cart/cartSlice'; // Change import statement to changeItemQuantity

import {
  Button,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  ListItemAvatar,
  Avatar,
} from '@mui/material';
import { FoodItem } from '../services/types';
import React from 'react';
import { block } from 'million/react';

interface CartProps {
  items: FoodItem[];
}

export const Cart: React.FC<CartProps> = ({ items }) => {
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

  const dispatch = useAppDispatch();

  const handleIncreaseQuantity = (item: FoodItem) => {
    dispatch(
      changeItemQuantity({
        itemId: Number(item.id),
        quantity: item.quantity + 1,
      })
    );
  };

  const handleDecreaseQuantity = (item: FoodItem) => {
    if (item.quantity > 1) {
      dispatch(
        changeItemQuantity({
          itemId: Number(item.id),
          quantity: item.quantity - 1,
        })
      );
    }
  };

  const handleRemoveItemFromCart = (item: FoodItem) =>
    dispatch(removeItem(item));

  return (
    <Box>
      <List>
        {items.map((item) => (
          <ListItem
            key={item.id}
            sx={{ backgroundColor: '#f5f5f5', margin: '0.3rem' }}>
            <ListItemAvatar>
              <Avatar
                src={item.image[0]?.path}
                alt={item.name}
                variant='rounded'
                sx={{ width: 56, height: 56, mr: '1rem' }}
              />
            </ListItemAvatar>
            <li>
              <ListItemText
                style={{ color: '#000000' }}
                primary={`${item.quantity} ${item.name}`}
              />
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                }}>
                {item.obligatoryOptions &&
                  item.obligatoryOptions.map((option, index) => (
                    <ListItemText
                      key={option.id}
                      sx={{
                        color: 'gray',
                        background: 'none',
                        borderRadius: '0.5rem',
                        marginTop: '-0.5rem',
                        fontSize: '0.8rem',
                      }}>
                      {option.name}
                    </ListItemText>
                  ))}

                {item.optionalOptions &&
                  item.optionalOptions.map((option, index) => (
                    <ListItemText
                      sx={{
                        color: 'gray',
                        background: 'none',
                        borderRadius: '0.5rem',
                        marginTop: '-0.5rem',
                        fontSize: '0.8rem',
                      }}>
                      {', '}
                      {option.name} ({option.price || 0} DT)
                    </ListItemText>
                  ))}
              </div>
              <ListItemText
                style={{ color: '#000000' }}
                primary={`${
                  item.price && item.quantity
                    ? (parseFloat(item.price.toString()) +
                        calculateOptionalPrice(item)) *
                      item.quantity
                    : 0
                } DT`}
              />
            </li>

            <ListItemSecondaryAction
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'right',
                width: 'fit-content',
              }}>
              <ListItemText
                style={{ color: '#000000' }}
                primary={
                  <>
                    <Button
                      variant='outlined'
                      color='primary'
                      onClick={() => handleIncreaseQuantity(item)}>
                      +
                    </Button>{' '}
                    <Button
                      variant='outlined'
                      color='primary'
                      onClick={() => handleDecreaseQuantity(item)}>
                      -
                    </Button>
                  </>
                }
              />

              <Button
                variant='outlined'
                color='error'
                onClick={() => handleRemoveItemFromCart(item)}
                sx={{ display: 'flex', flexGrow: 1 }}>
                Remove
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
