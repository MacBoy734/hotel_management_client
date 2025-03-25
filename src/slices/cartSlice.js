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

    incrementQuantity: (state, action) => {
      const itemId = action.payload
      const item = state.cartItems.find(cartItem => cartItem.id === itemId)

      if (item) {
        if(item.quantity >= item.totalQuantity) {
          toast.error('item out of stock!')
          return
        }else{
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
        if(item.quantity == 1) return
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

export const { addToCart, removeFromCart, incrementQuantity, decrementQuantity, clearCart } = cartSlice.actions

export default cartSlice.reducer
