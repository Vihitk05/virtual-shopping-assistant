import React from 'react';
import { ChakraProvider, theme } from '@chakra-ui/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import SignUp from './pages/signup';
import Home from './pages/home';
import Products from './pages/products';
import ProductPage from './pages/productPage';
import { CartProvider } from './components/cartContext';
import VirtualTryOn from './pages/virtual_try_on';
import ChatWindow from './pages/chatWindow';
import Account from './pages/account';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="login" element={<Login />} />
            <Route path="" index element={<Home />} />
            <Route path="signup" element={<SignUp />} />
            <Route path="products/search" element={<Products />} />
            <Route path="products" element={<Products />} />
            <Route path="products/:pk" element={<ProductPage />} />
            <Route path="products/virtual-try-on/:pk" element={<VirtualTryOn />} />
            <Route path="chat" element={<ChatWindow />} />
            <Route path="account" element={<Account />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </ChakraProvider>
  );
}

export default App;
