import { useAppDispatch } from '../../Redux/store';
import { removeItem, changeItemQuantity } from '../../Redux/slices/cart/cartSlice'; // Change import statement to changeItemQuantity

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
import { FoodItem } from '../../services/types';
import React, { useEffect } from 'react';

import './cart.css'
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
            className="list-item"
          >
            <ListItemAvatar>
              <Avatar
                src={item.image[0]?.path}
                alt={item.name}
                variant='rounded'
                className="list-item-avatar"
              />
            </ListItemAvatar>
            <li>
              <ListItemText
                className="list-item-text-primary"
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
                      className="list-item-text-secondary">
                      {option.name}
                    </ListItemText>
                  ))}

                {item.optionalOptions &&
                  item.optionalOptions.map((option, index) => (
                    <ListItemText className="list-item-text-secondary">
                      {', '}
                      {option.name} ({option.price || 0} DT)
                    </ListItemText>
                  ))}
              </div>
              <ListItemText
                className="list-item-text-primary"
                primary={`${item.price && item.quantity
                  ? (parseFloat(item.price.toString()) +
                    calculateOptionalPrice(item)) *
                  item.quantity
                  : 0
                  } DT`}
              />
            </li>

            <ListItemSecondaryAction className="list-item-secondary-action">
              <ListItemText
                className="list-item-text-primary"
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
                className="remove-button"                
                >
                Remove
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
