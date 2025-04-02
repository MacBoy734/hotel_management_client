import { createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

const initialState = {
  cartItems: [],
  totalQuantity: 0,
  totalPrice: 0,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload
      const existingItem = state.cartItems.find(cartItem => cartItem.id === item.id)

      if (existingItem) {
        toast.error('item already in cart')
        return
      } else {
        state.cartItems.push(item)
        toast.success('added to cart!')
      }

      state.totalQuantity += item.quantity
      state.totalPrice += item.price * item.quantity
    },

    removeFromCart: (state, action) => {
      const itemId = action.payload
      const item = state.cartItems.find(cartItem => cartItem.id === itemId)

      if (item) {
        if (confirm("remove item from cart?")) {
          state.totalQuantity -= item.quantity
          state.totalPrice -= (item.quantity * item.price)
          state.cartItems = state.cartItems.filter(cartItem => cartItem.id !== itemId)
        }
      }
    },

    editCartItems: (state, action) => {
      const updatedItem = action.payload;

      if (updatedItem) {
        const cartItem = state.cartItems.find(item => item.id === updatedItem._id);

        if (cartItem) {
          state.cartItems = state.cartItems.map(item =>
            item.id === updatedItem._id
              ? {
                ...item,
                price: updatedItem.price,
                totalQuantity: updatedItem.quantity 
              }
              : item
          )
          state.totalPrice = state.cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
        }
      }
    },

    incrementQuantity: (state, action) => {
      const itemId = action.payload
      const item = state.cartItems.find(cartItem => cartItem.id === itemId)

      if (item) {
        if (item.quantity >= item.totalQuantity) {
          toast.error('item out of stock!')
          return
        } else {
          item.quantity++
          state.totalQuantity++
          state.totalPrice += item.price
        }
      }
    },

    decrementQuantity: (state, action) => {
      const itemId = action.payload
      const item = state.cartItems.find(cartItem => cartItem.id === itemId)

      if (item) {
        if (item.quantity == 1) return
        item.quantity--
        state.totalQuantity--
        state.totalPrice -= item.price
      }
    },

    clearCart: (state) => {
      state.cartItems = []
      state.totalQuantity = 0
      state.totalPrice = 0
    },
  },
})

export const { addToCart, removeFromCart, incrementQuantity, decrementQuantity, clearCart, editCartItems } = cartSlice.actions

export default cartSlice.reducer
