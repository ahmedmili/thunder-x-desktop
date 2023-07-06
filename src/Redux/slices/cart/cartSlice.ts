import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { FoodItem } from '../../../services/types';
import { localStorageService } from '../../../services/localStorageService';

interface CartState {
  items: FoodItem[];
  deliveryOption: 'delivery' | 'pickup' | 'surplace';
  comment: string;
  supplierMismatch: FoodItem | null;
  supplier: any | null;
  deliveryPrice: number;
}

const initialState: CartState = {
  items: [],
  deliveryOption: 'delivery',
  comment: '',
  supplierMismatch: null,
  supplier: null,
  deliveryPrice: 0,
};

export const addItem = createAsyncThunk<FoodItem, FoodItem>(
  'cart/addItem',
  async (item, { dispatch, getState }) => {
    dispatch({ type: 'cart/addItem/pending' });

    // Here, you can perform any asynchronous operation if necessary.
    // In this example, we don't need any async operation, so we'll just return the item directly.
    return item;
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setSupplier: (state, action) => {
      state.supplier = action.payload;
    },
    setDeliveryPrice: (state, action) => {
      state.deliveryPrice = action.payload;
    },
    clearCart: (state) => {
      state.items = [];
      state.deliveryOption = 'delivery';
      state.comment = '';
      localStorageService.unsetComment();
      localStorageService.unsetCart();
    },
    setCartItems: (state, action: PayloadAction<FoodItem[]>) => {
      state.items = action.payload;
    },
    changeItemQuantity: (
      state,
      action: PayloadAction<{ itemId: number; quantity: number }>
    ) => {
      const { itemId, quantity } = action.payload;
      const item = state.items.find((item) => item.id === itemId);

      if (item) {
        item.quantity = quantity;
      }
    },
    removeItem: (state, action: PayloadAction<FoodItem>) => {
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) {
        state.items.splice(index, 1);
      }
    },
    setDeliveryOption: (
      state,
      action: PayloadAction<'delivery' | 'pickup' | 'surplace'>
    ) => {
      state.deliveryOption = action.payload;
    },
    setComment: (state, action: PayloadAction<string>) => {
      state.comment = action.payload;
    },
    setSupplierMismatch: (state, action: PayloadAction<FoodItem>) => {
      state.supplierMismatch = action.payload;
    },
    clearSupplierMismatch: (state) => {
      state.supplierMismatch = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addItem.pending, (state, action) => {
      // You can handle any pending state here if necessary.
    });
    builder.addCase(addItem.fulfilled, (state, action) => {
      // Handle the addItem action logic.
      const newItem = action.payload;

      if (
        state.items.length > 0 &&
        state.items[0].supplier_id !== newItem.supplier_id
      ) {
        state.supplierMismatch = newItem;
      } else {
        const existingItemIndex = state.items.findIndex((item) => {
          return (
            item.name === newItem.name &&
            JSON.stringify(item.obligatoryOptions) ===
              JSON.stringify(newItem.obligatoryOptions) &&
            JSON.stringify(item.optionalOptions) ===
              JSON.stringify(newItem.optionalOptions)
          );
        });

        if (existingItemIndex !== -1) {
          state.items[existingItemIndex].quantity += newItem.quantity;
        } else {
          state.items.push(newItem);
        }
      }
    });
  },
});

export const {
  setCartItems,
  removeItem,
  setDeliveryOption,
  setComment,
  changeItemQuantity,
  clearCart,
  setSupplierMismatch,
  clearSupplierMismatch,
  setSupplier,
  setDeliveryPrice,
} = cartSlice.actions;

export default cartSlice.reducer;
