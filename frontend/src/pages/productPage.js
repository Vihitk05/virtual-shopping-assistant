import { Link, useParams } from 'react-router-dom';
import { Navbar } from '../components/navbar';
import {
  Badge,
  Box,
  Button,
  Heading,
  Image,
  Text,
  Skeleton,
  SkeletonText,
  Card,
  CardFooter,
  HStack,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
// import { CiBoxes } from 'react-icons/ci';
import { Icon } from '@chakra-ui/react';
import { MdShoppingCart } from 'react-icons/md';
import { IoIosShirt, IoIosCart } from 'react-icons/io';
// import { FaCartShopping } from "react-icons/fa6";
import axios from 'axios';
import Footer from '../components/footer';
import { useCart } from '../components/cartContext';

export default function ProductPage() {
  let { pk } = useParams();
  const access_token = localStorage.getItem('access_token');
  const [productsData, setProductsData] = useState([]);
  const [productData, setProductData] = useState({});
  const { fetchCartItems } = useCart();
  const toast = useToast();
  console.log(pk);
  const addToCart = (productId, quantity = 1) => {
    axios
      .post(
        'http://127.0.0.1:8000/api/cart/add/',
        { product_id: productId, quantity: quantity },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      )
      .then(response => {
        toast({
          title: 'Added to cart',
          description: 'The product has been added to your cart.',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
        fetchCartItems(); // Call this function to update the cart items in the navbar
      })
      .catch(error => {
        toast({
          title: 'Error',
          description: 'There was an error adding the product to your cart.',
          status: 'error',
          duration: 2000,
          isClosable: true,
        });
        console.error(
          'There was an error adding the product to the cart:',
          error
        );
      });
  };

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/products/${pk}/related`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      })
      .then(response => {
        console.log(response.data);
        setProductsData(response.data);
      })
      .catch(error => {
        console.log('Error fetching related product data:', error);
      });
  }, [pk, access_token]);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/products/${pk}/`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      })
      .then(response => {
        console.log(response.data);
        setProductData(response.data);
      })
      .catch(error => {
        console.log('Error fetching product data:', error);
      });
  }, [pk, access_token]);
  const category = useMemo(
    () => ({
      1: 'Men',
      2: 'Women',
    }),
    []
  );
  return (
    <>
      <Navbar />
      <Box display="flex" justifyContent="space-around">
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          padding="3% 0 3% 3%"
        >
          <Image src={productData.image_url} width="500px" height="550px" />
        </Box>
        <Box width="50%" padding="3%">
          <Text fontSize="xl">
            <Badge
              variant="outline"
              fontSize="0.8em"
              fontWeight="bold"
              colorScheme="gray"
            >
              {category[productData.category]}
            </Badge>
          </Text>
          <Heading size="3xl">{productData.name}</Heading>
          <Text fontSize="4xl" fontWeight="bold" mt="1%">
            ₹{productData.price}
          </Text>
          <Text mt="3%">{productData.description}</Text>
          <Box display="flex" gap="30px" alignItems="center">
            <Box>
              <Button
                variant="solid"
                colorScheme="blue"
                mt="10%"
                display="flex"
                alignItems="center"
                justifyContent="space-around"
                gap="5px"
                onClick={() => addToCart(productData.id)}
              >
                Add To Cart
                <Icon boxSize={6} as={MdShoppingCart} />
              </Button>
            </Box>

            <Box>
              <Link to={`/products/virtual-try-on/${productData.id}`}>
                <Button
                  variant="outline"
                  colorScheme="blue"
                  mt="10%"
                  display="flex"
                  alignItems="center"
                  justifyContent="space-around"
                  gap="5px"
                >
                  Virtual Try On
                  <Icon boxSize={6} as={IoIosShirt} />
                </Button>
              </Link>
            </Box>
          </Box>

          <Box display="flex" alignItems="center" gap="10px" mt="2%">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="w-4 h-4"
            >
              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
              <path d="m3.3 7 8.7 5 8.7-5"></path>
              <path d="M12 22V12"></path>
            </svg>
            <Text fontSize="large">{productData.stock} in stock</Text>
          </Box>
        </Box>
      </Box>
      <Box padding="5%">
        <Heading>Related Products</Heading>
        <Box
          display="flex"
          overflowX="auto"
          padding="1rem"
          css={{
            '&::-webkit-scrollbar': {
              display: 'none',
            },
          }}
        >
          <HStack
            spacing={10}
            display="flex"
            justifyContent="space-evenly"
            alignItems="center"
          >
            {Array.isArray(productsData) && productsData.length > 0 ? (
              productsData.map(product => (
                <Link to={`/products/${product.id}/`}>
                  <Card maxW="sm" minW="sm" key={product.id}>
                    {/* <CardBody> */}
                    <Image
                      src={product.image_url}
                      alt="Green double couch with wooden legs"
                      borderTopRadius="lg"
                      width="100%"
                      height="100%"
                      objectFit="cover"
                    />
                    <Badge
                      mt="2"
                      ml="5"
                      variant="solid"
                      width="fit-content"
                      colorScheme="green"
                    >
                      {category[product.category]}
                    </Badge>
                    <Heading size="sm" mt="2" ml="5">
                      {product.name}
                    </Heading>
                    {/* </CardBody> */}
                    <CardFooter
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Link to={`/products/${product.id}/`}>
                        <Button
                          colorScheme="blue"
                          size="md"
                          display="flex"
                          alignItems="center"
                        >
                          Buy Now <IoIosCart size={25} />
                        </Button>
                      </Link>
                      <Text color="blue.600" fontSize="xl" fontWeight="bold">
                        ₹{product.price}
                      </Text>
                    </CardFooter>
                  </Card>
                </Link>
              ))
            ) : (
              <Box display="flex" justifyContent="space-around" flexWrap="wrap">
                <Box boxShadow="lg" bg="white" my="2%" borderRadius="lg">
                  <Skeleton
                    width="300px"
                    height="400px"
                    size="10"
                    borderTopRadius="lg"
                  />
                  <SkeletonText
                    mt="4"
                    noOfLines={3}
                    spacing="4"
                    skeletonHeight="2"
                    padding="3"
                  />
                </Box>
                <Box boxShadow="lg" bg="white" my="2%" borderRadius="lg">
                  <Skeleton
                    width="300px"
                    height="400px"
                    size="10"
                    borderTopRadius="lg"
                  />
                  <SkeletonText
                    mt="4"
                    noOfLines={3}
                    spacing="4"
                    skeletonHeight="2"
                    padding="3"
                  />
                </Box>
                <Box boxShadow="lg" bg="white" my="2%" borderRadius="lg">
                  <Skeleton
                    width="300px"
                    height="400px"
                    size="10"
                    borderTopRadius="lg"
                  />
                  <SkeletonText
                    mt="4"
                    noOfLines={3}
                    spacing="4"
                    skeletonHeight="2"
                    padding="3"
                  />
                </Box>
              </Box>
            )}
          </HStack>
        </Box>
      </Box>
      <Footer />
    </>
  );
}
