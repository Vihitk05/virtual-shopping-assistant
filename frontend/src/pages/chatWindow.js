import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  Card,
  Image,
  Badge,
  CardFooter,
  Button,
  Skeleton,
  SkeletonText,
  Heading,
  Avatar,
} from '@chakra-ui/react';
import axios from 'axios';
import { IoIosSend, IoIosCart } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/navbar';
import Footer from '../components/footer';

const ChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [buttonClicked, setButtonClicked] = useState(false);
  const token = localStorage.getItem('access_token'); // Assuming access token is stored in localStorage
  const category = useMemo(
    () => ({
      1: 'Men',
      2: 'Women',
    }),
    []
  );
  useEffect(() => {
    fetchChatHistory();
  }, []);

  const fetchChatHistory = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(
        'http://127.0.0.1:8000/api/chat/history/',
        config
      );
      const chatHistory = response.data;
      console.log(response.data);
      setMessages(chatHistory);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  const sendMessage = async () => {
    setButtonClicked(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      console.log('Inside POST', input);
      const response = await axios.post(
        'http://127.0.0.1:8000/api/chat/',
        { message: input },
        config
      );
      const newMessage = {
        message: input,
        response: response.data.response,
        recommendations: response.data.recommendations,
      };
      console.log(response.data);
      setMessages([...messages, newMessage]);
      setInput('');
      setButtonClicked(false);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <>
      <Navbar />
      <Box>
        <Box
          height="600px"
          overflowY="auto"
          padding="10px"
          border="1px solid #ccc"
          borderRadius="md"
          sx={
            { 
           '::-webkit-scrollbar':{
                  display:'none'
              }
           }
         }
        >
          {messages.map((msg, index) => (
            <Box
              key={index}
              marginY="5px"
              display="flex"
              justifyContent="space-between"
              flexDirection="column"
            >
              <Box display="flex" justifyContent="space-between">
                <Text width="60%"></Text>
                <Box display="flex" justifyContent="space-around" gap="10px">
                  <Text
                    alignSelf="flex-end"
                    my="1%"
                    backgroundColor="#eeeeee"
                    fontWeight="bold"
                    padding="15px"
                    borderRadius="20px"
                  >
                    {msg.message}
                  </Text>
                  <Avatar
                    name="Kola Tioluwani"
                    src="https://bit.ly/dan-abramov"
                  />
                </Box>
              </Box>
              <Box width="50%">
                <Box display="flex" justifyContent="space-around" alignItems="start">
                  <Avatar
                    name="Kola Tioluwani"
                    src="/bot.jpg"
                  />
                  <Text
                    alignSelf="flex-start"
                    backgroundColor="blue"
                    marginLeft="15px"
                    color="white"
                    padding="15px"
                    borderRadius="20px"
                  >
                    {msg.response.split('Recommended products:')[0]}
                  </Text>
                </Box>

                <Box
                  display="flex"
                  justifyContent="space-around"
                  flexWrap="wrap"
                  my="2%"
                >
                  {Array.isArray(JSON.parse(msg.recommendations)) &&
                  JSON.parse(msg.recommendations).length > 0 ? (
                    JSON.parse(msg.recommendations).map(product => (
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

                            <Text
                              color="blue.600"
                              fontSize="xl"
                              fontWeight="bold"
                            >
                              ₹{product.price}
                            </Text>
                          </CardFooter>
                        </Card>
                      </Link>
                    ))
                  ) : (
                    <Box
                      display="flex"
                      justifyContent="space-around"
                      flexWrap="wrap"
                    >
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
              </Box>
            </Box>
          ))}
        </Box>
        <Box
          height="95px"
          display="flex"
          justifyContent="center"
          mx="10%"
          alignItems="center"
        >
          <InputGroup size="md">
            <Input
              pr="4.5rem"
              placeholder="Enter your query"
              focusBorderColor="blue"
              value={input}
              onChange={e => {
                setInput(e.target.value);
              }}
            />
            <InputRightElement>
              <IconButton
                onClick={sendMessage}
                variant="ghost"
                _hover={{ backgroundColor: 'blue', color: 'white' }}
                borderLeftRadius="none"
                isLoading={buttonClicked}
                icon={<IoIosSend size={25} _hover={{ color: 'white' }} />}
              />
            </InputRightElement>
          </InputGroup>
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default ChatWindow;
