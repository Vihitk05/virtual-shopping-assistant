import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Heading,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  MenuDivider,
  MenuGroup,
  Avatar,
  useToast,
  Input,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  IconButton,
  Text,
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { MdShoppingCart } from 'react-icons/md';
import { Search2Icon } from '@chakra-ui/icons';

export const Navbar = () => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const toast = useToast();
  const [cartItems, setCartItems] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const logout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
    toast({
      position: 'top-right',
      title: 'Logged out successfully',
      status: 'success',
      duration: 9000,
      isClosable: true,
    });
  };

  const handleSearch = () => {
    navigate(`/products/search?q=${search}`);
  };

  const fetchCartItems = () => {
    const access_token = localStorage.getItem('access_token');
    axios
      .get('http://127.0.0.1:8000/api/cart/', {
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      })
      .then(response => {
        console.log(response.data); // Inspect the data structure
        setCartItems(response.data);
      })
      .catch(error => {
        console.error('Error fetching cart items:', error);
      });
  };

  // const handleAddToCart = (productId, quantity) => {
  //   const access_token = localStorage.getItem('access_token');
  //   axios.post('http://127.0.0.1:8000/api/cart/add/', {
  //     product_id: productId,
  //     quantity: quantity,
  //   }, {
  //     headers: {
  //       Authorization: `Bearer ${access_token}`,
  //       'Content-Type': 'application/json',
  //       Accept: 'application/json',
  //     },
  //   })
  //   .then(response => {
  //     fetchCartItems(); // Refresh the cart items
  //     toast({
  //       position: 'top-right',
  //       title: 'Product added to cart',
  //       status: 'success',
  //       duration: 9000,
  //       isClosable: true,
  //     });
  //   })
  //   .catch(error => {
  //     console.error('Error adding to cart:', error);
  //   });
  // };

  const handleDeleteFromCart = productId => {
    const access_token = localStorage.getItem('access_token');
    axios
      .delete('http://127.0.0.1:8000/api/cart/delete/', {
        data: { product_id: productId },
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      })
      .then(response => {
        fetchCartItems(); // Refresh the cart items
        toast({
          position: 'top-right',
          title: 'Product removed from cart',
          status: 'success',
          duration: 9000,
          isClosable: true,
        });
      })
      .catch(error => {
        console.error('Error deleting from cart:', error);
      });
  };

  useEffect(() => {
    if (isOpen) {
      fetchCartItems();
    }
  }, [isOpen]);

  return (
    <Box
      height="60px"
      bgColor="white"
      px="2%"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
    >
      <Box display="flex" justifyContent="space-around" gap="5px">
        <Link to="/">
          <Heading size="lg">VogueNest</Heading>
        </Link>
        <Link to="/products">
          <Button variant="ghost">Products</Button>
        </Link>
        <Link to="/chat">
          <Button variant="ghost">Virtual Assistant</Button>
        </Link>
      </Box>
      <Box
        display="flex"
        alignItems="center"
        borderRadius="xl"
        focusColor="blue"
      >
        <Input
          placeholder="Search"
          width="700px"
          borderRightRadius="none"
          borderLeftRadius="md"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <IconButton
          colorScheme="blue"
          aria-label="Search database"
          icon={<Search2Icon />}
          borderRightRadius="md"
          borderLeftRadius="none"
          onClick={handleSearch}
        />
      </Box>
      <Box display="flex" alignItems="center" gap="20px">
        <IconButton
          onClick={onOpen}
          variant="outline"
          colorScheme="blue"
          aria-label="View Cart"
          fontSize="25px"
          border="none"
          icon={<MdShoppingCart />}
        />
        <Drawer onClose={onClose} isOpen={isOpen}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Cart</DrawerHeader>
            <DrawerBody>
              {cartItems.length > 0 ? (
                cartItems.map(item => (
                  <Box
                    key={item.id}
                    display="flex"
                    justifyContent="space-between"
                    mb="4"
                  >
                    <Box>
                      <Heading size="sm">
                        {item.product?.name || 'Product name not available'}
                      </Heading>
                      <Text>Quantity: {item.quantity}</Text>
                      <Text>
                        Price: ₹
                        {item.product
                          ? item.product.price * item.quantity
                          : 'N/A'}
                      </Text>
                    </Box>
                    <Button
                      colorScheme="red"
                      onClick={() => handleDeleteFromCart(item.product?.id)}
                    >
                      Remove
                    </Button>
                  </Box>
                ))
              ) : (
                <Text>No items in cart</Text>
              )}
            </DrawerBody>
          </DrawerContent>
        </Drawer>
        <Menu>
          <MenuButton
            as={IconButton}
            icon={
              <Avatar name="Kola Tioluwani" src="https://bit.ly/dan-abramov" />
            }
            borderRadius="full"
          />
          <MenuList>
            <MenuGroup title="Profile">
              <Link to="/account">
                <MenuItem>My Account</MenuItem>
              </Link>
              <MenuItem>Payments</MenuItem>
            </MenuGroup>
            <MenuDivider />
            <MenuGroup title="Help">
              <MenuItem>Docs</MenuItem>
              <MenuItem>FAQ</MenuItem>
            </MenuGroup>
            <MenuDivider />
            <MenuItem color="red" fontWeight="bold" onClick={logout}>
              Logout
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>
    </Box>
  );
};
