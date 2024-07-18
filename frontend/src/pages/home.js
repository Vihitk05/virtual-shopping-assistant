import {
  Box,
  Heading,
  Image,
  Button,
  HStack,
  Card,
  CardFooter,
  Text,
  useToast,
  Badge,
  Skeleton,
  SkeletonText,
} from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { IoIosCart } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/navbar';
import Footer from '../components/footer';

export default function Home() {
  const navigate = useNavigate();
  const basicBoxStyles = {
    background: 'url(/home_page.jpg) top/cover',
  };
  const category = {
    1: 'Men',
    2: 'Women',
  };
  const categoryBoxStyles1 = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    boxSize: '450px',
    color: 'white',
    textShadow: '0 0 20px black',
    fontWeight: 'bold',
    fontSize: '60px',
    px: 4,
    background: 'url(/man.jpg) center/cover no-repeat',
  };
  const categoryBoxStyles2 = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    boxSize: '450px',
    color: 'white',
    textShadow: '0 0 20px black',
    fontWeight: 'bold',
    fontSize: '60px',
    px: 4,
    background: 'url(/women.jpg) center/cover no-repeat',
  };
  const categoryBoxStyles3 = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    boxSize: '450px',
    color: 'white',
    textShadow: '0 0 20px black',
    fontWeight: 'bold',
    fontSize: '60px',
    px: 4,
    background: 'url(/kid.jpg) center/cover no-repeat',
  };

  const [productData, setProductData] = useState([]);
  const access_token = localStorage.getItem('access_token');
  const toast = useToast();
  useEffect(() => {
    axios
      .get('http://127.0.0.1:8000/api/products/home/', {
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      })
      .then(response => {
        // console.log(response.data);
        setProductData(response.data);
      })
      .catch(error => {
        console.log('Error fetching product data:', error);
        toast({
          position: 'top-right',
          title: 'Please Login First',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
        navigate('/login');
      });
  }, [access_token, toast, navigate]);
  // console.log(productData);
  return (
    <>
      <Navbar />
      <Box display="flex" sx={basicBoxStyles} justifyContent="row">
        <Box
          width="50%"
          height="669px"
          display="flex"
          flexDirection="column"
          padding="15% 0 0 5%"
        >
          <Heading size="4xl" colorScheme="white" color="black">
            Sale 20% off
          </Heading>
          <Heading size="4xl" colorScheme="white" color="white">
            On Everything
          </Heading>
          <Heading size="md" colorScheme="white" marginTop="3%" color="white">
            Buy the Best Products over here.
          </Heading>
          <Button
            width="30%"
            marginTop="2%"
            bgColor="black"
            color="white"
            fontWeight="extrabold"
          >
            Shop Now
          </Button>
        </Box>
        <Box width="50%" height="729px"></Box>
      </Box>
      <Box marginTop="5%" marginLeft="5%">
        <Heading>Our Latest Products</Heading>
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
          <HStack spacing={4}>
            {Array.isArray(productData) && productData.length > 0 ? (
              productData.map(product => (
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
      <Box mt="5%" ml="5%">
        <Heading>Categories</Heading>
        <HStack mt="3%" mb="5%">
          <Link to="/products">
            <Box
              sx={categoryBoxStyles1}
              filter="grayscale(80%)"
              borderRadius="2xl"
            >
              Men
            </Box>
          </Link>
          <Link to="/products">
            <Box
              sx={categoryBoxStyles2}
              filter="grayscale(80%)"
              borderRadius="2xl"
            >
              Women
            </Box>
          </Link>
          <Link to="/products">
            <Box
              sx={categoryBoxStyles3}
              filter="grayscale(80%)"
              borderRadius="2xl"
            >
              Kids
            </Box>
          </Link>
        </HStack>
      </Box>
      <Footer />
    </>
  );
}
