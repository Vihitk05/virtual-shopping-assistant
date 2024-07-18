import { useEffect, useState, useCallback, useMemo } from 'react';
import { Navbar } from '../components/navbar';
import axios from 'axios';
import {
  useToast,
  Box,
  Heading,
  Text,
  Input,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  Tooltip,
  CheckboxGroup,
  Stack,
  Checkbox,
  Card,
  Image,
  Badge,
  CardFooter,
  Button,
  Skeleton,
  SkeletonText,
} from '@chakra-ui/react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { IoIosCart } from 'react-icons/io';
import Footer from '../components/footer';

const ITEMS_PER_PAGE = 30;

export default function Products() {
  const [productData, setProductData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sliderValue, setSliderValue] = useState(5000);
  const [showTooltip, setShowTooltip] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchParams] = useSearchParams();
  const access_token = localStorage.getItem('access_token');
  const toast = useToast();
  const navigate = useNavigate();
  const category = useMemo(
    () => ({
      1: 'Men',
      2: 'Women',
    }),
    []
  );

  useEffect(() => {
    const search = searchParams.get('q');
    if (search){
      setSearchTerm(search)
    }
    axios
      .get('http://127.0.0.1:8000/api/products/', {
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      })
      .then(response => {
        setProductData(response.data);
        setFilteredData(response.data);
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
  }, [access_token, toast, navigate,searchParams]);

  const applyFilters = useCallback(() => {
    let filtered = productData;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sliderValue) {
      filtered = filtered.filter(product => product.price <= sliderValue);
    }

    if (selectedCategories.length) {
      filtered = filtered.filter(product =>
        selectedCategories.includes(category[product.category])
      );
    }

    setFilteredData(filtered);
    setCurrentPage(1); // Reset to the first page whenever filters change
  }, [productData, searchTerm, sliderValue, selectedCategories, category]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handlePageChange = page => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProducts = filteredData.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const renderPaginationButtons = () => {
    const buttons = [];
    const pageWindow = 2; // Number of pages to show before and after the current page
    // const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

    if (currentPage > 1) {
      buttons.push(
        <Button
          key="first"
          onClick={() => handlePageChange(1)}
          mx="3"
          borderRadius="full"
        >
          1
        </Button>
      );
      if (currentPage > pageWindow + 2) {
        buttons.push(
          <Button key="prev-ellipsis" disabled mx="3" borderRadius="full">
            ...
          </Button>
        );
      }
    }

    for (
      let i = Math.max(1, currentPage - pageWindow);
      i <= Math.min(totalPages, currentPage + pageWindow);
      i++
    ) {
      buttons.push(
        <Button
          key={i}
          onClick={() => handlePageChange(i)}
          isDisabled={currentPage === i}
          mx="3"
          borderRadius="full"
        >
          {i}
        </Button>
      );
    }

    if (currentPage < totalPages - pageWindow - 1) {
      buttons.push(
        <Button key="next-ellipsis" disabled mx="3" borderRadius="full">
          ...
        </Button>
      );
    }
    if (currentPage < totalPages) {
      buttons.push(
        <Button
          key="last"
          onClick={() => handlePageChange(totalPages)}
          mx="3"
          borderRadius="full"
        >
          {totalPages}
        </Button>
      );
    }

    return buttons;
  };

  return (
    <>
      <Navbar />
      <Box display="flex" justifyContent="space-around" my="5">
        <Box width="23%" borderRadius="xl" padding="2%">
          <Heading size="md" fontWeight="700">
            Filters
          </Heading>
          <Text mt="10">Search</Text>
          <Input
            placeholder="Search Products"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <Text mt="5">Price</Text>
          <Slider
            id="slider"
            defaultValue={5000}
            min={0}
            max={5000}
            colorScheme="blue"
            onChange={v => setSliderValue(v)}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <SliderMark value={0} mt="1" ml="-2.5" fontSize="sm">
              ₹0
            </SliderMark>
            <SliderMark value={2500} mt="1" ml="-2.5" fontSize="sm">
              ₹2500
            </SliderMark>
            <SliderMark value={5000} mt="1" ml="-30px" fontSize="sm">
              ₹5000
            </SliderMark>
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <Tooltip
              hasArrow
              bg="blue.500"
              color="white"
              placement="top"
              isOpen={showTooltip}
              label={`₹${sliderValue}`}
            >
              <SliderThumb />
            </Tooltip>
          </Slider>
          <Text mt="5">Category</Text>
          <CheckboxGroup
            colorScheme="blue"
            value={selectedCategories}
            onChange={values => setSelectedCategories(values)}
          >
            <Stack>
              <Checkbox value="Men">Men</Checkbox>
              <Checkbox value="Women">Women</Checkbox>
            </Stack>
          </CheckboxGroup>
        </Box>
        <Box
          width="73%"
          display="flex"
          justifyContent="space-around"
          flexWrap="wrap"
          flexDirection="column"
        >
          <Box display="flex" justifyContent="center" mt="5">
            {renderPaginationButtons()}
          </Box>
          <Box display="flex" justifyContent="space-around" flexWrap="wrap">
            {Array.isArray(currentProducts) && currentProducts.length > 0 ? (
              currentProducts.map(product => (
                <Link to={`/products/${product.id}/`}>
                  <Card
                    my="2%"
                    maxW="300px"
                    minW="300px"
                    width="350px"
                    key={product.id}
                  >
                    <Image
                      src={product.image_url}
                      alt="Green double couch with wooden legs"
                      borderTopRadius="lg"
                      width="300px"
                      height="400px"
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
          </Box>
          <Box display="flex" justifyContent="center" mt="5">
            {renderPaginationButtons()}
          </Box>
        </Box>
      </Box>
      <Footer />
    </>
  );
}
