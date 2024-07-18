// cartContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const fetchCartItems = () => {
    const access_token = localStorage.getItem('access_token');
    axios.get('http://127.0.0.1:8000/api/cart/', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })
    .then(response => {
      setCartItems(response.data.order_products);
      setTotalPrice(response.data.total_price);
      console.log(response.data);
    })
    .catch(error => {
      console.error('Error fetching cart items:', error);
    });
  };

  const addToCart = (productId, quantity = 1) => {
    const access_token = localStorage.getItem('access_token');
    axios.post('http://127.0.0.1:8000/api/cart/add/', 
      { product_id: productId, quantity: quantity },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
      })
    .then(response => {
      fetchCartItems(); // Refresh cart items
    })
    .catch(error => {
      console.error('Error adding item to cart:', error);
    });
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  return (
    <CartContext.Provider value={{ cartItems, totalPrice, fetchCartItems, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};
