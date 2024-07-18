import { Box, Button, Image, Text } from '@chakra-ui/react';
import Footer from '../components/footer';
import { Navbar } from '../components/navbar';
import FilePondComponent from '../components/uploadFile';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function VirtualTryOn() {
  let { pk } = useParams();
  const access_token = localStorage.getItem('access_token');
  const [productData, setProductData] = useState([]);
  
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

  return (
    <>
      <Navbar />
      <Box my="3%">
        <Box display="flex" justifyContent="space-around" flexDirection="row">
          <Box
            width="48%"
            display="flex"
            justifyContent="space-between"
            flexDirection="column"
          >
            <Box width="100%" border="3px solid gray" borderStyle="dotted" borderRadius="20px" padding="10px">
              <FilePondComponent />
            </Box>
            <Box width="100%" display="flex" justifyContent="center" mt="2%" border="3px solid gray" borderRadius="20px" borderStyle="dotted">
              <Image src={productData.image_url} />
            </Box>
          </Box>
          <Box width="48%" display="flex" justifyContent="center" alignItems="center" border="3px solid gray" borderRadius="20px" borderStyle="dotted">
            {/* This is an empty box, add content here if needed */}
            <Text color="gray" fontWeight="bold">Output Image</Text>
          </Box>
        </Box>
        <Box my="2%" display="flex" justifyContent="center" width="100%">
          <Button width="98%" variant="solid" colorScheme="blue">Try On</Button>
        </Box>
      </Box>
      <Footer />
    </>
  );
}
