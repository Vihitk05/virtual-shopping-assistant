import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Image,
  Button,
  Stack,
  Container,
  Center,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Divider,
  AbsoluteCenter,
  Text,
  useToast,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
export default function Login() {
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);
  const toast = useToast();
  const [login, setLogin] = useState({
    username: '',
    password: '',
  });
  const [buttonClicked, setButtonClicked] = useState(false);
  const navigate = useNavigate();
  const handleChange = event => {
    let value = event.target.value;
    let name = event.target.name;

    setLogin(prevalue => {
      return {
        ...prevalue,
        [name]: value,
      };
    });
  };

  const handleSubmit = () => {
    setButtonClicked(true);
    console.log(login);
    axios
      .post(
        'http://127.0.0.1:8000/api/login/',
        {
          username: login.username,
          password: login.password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          withCredentials: true, // if you want to include credentials like cookies
        }
      )
      .then(response => {
        console.log(response.data);
        localStorage.setItem('access_token', response.data.access);
        toast({
          position: 'top-right',
          title: 'Logged in sucessfully',
          status: 'success',
          duration: 9000,
          isClosable: true,
        });
        navigate('/');
      })
      .catch(error => {
        console.error('There was an error!', error);
        toast({
          position: 'top-right',
          title: 'Invalid Credentials',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      });
    setButtonClicked(false);
  };
  return (
    <Box display="flex" flexDirection="row">
      <Box width="40%" height="725px" bgColor="black">
        <Image src="/login_page.jpg" alt="LOGIN" width="100%" height="100%" />
      </Box>
      <Box bgColor="white" width="60%" padding="15% 0 0 0">
        <Stack>
          <Container>
            <Center display="flex" flexDirection="column">
              <Heading size="lg" padding="0 0 5% 0" fontWeight="bold">
                Please Login To Continue..
              </Heading>
              <Input
                size="md"
                placeholder="Username"
                marginBottom="5%"
                focusBorderColor="#c8c4fc"
                name="username"
                onChange={handleChange}
              />
              <InputGroup size="md" marginBottom="5%">
                <Input
                  pr="4.5rem"
                  type={show ? 'text' : 'password'}
                  placeholder="Enter password"
                  focusBorderColor="#c8c4fc"
                  onChange={handleChange}
                  name="password"
                />
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    onClick={handleClick}
                    bg="#c8c4fc"
                  >
                    {show ? 'Hide' : 'Show'}
                  </Button>
                </InputRightElement>
              </InputGroup>
              {buttonClicked ? (
                <Button
                  isLoading
                  bg="#c8c4fc"
                  loadingText="Login"
                  variant="outline"
                >
                  Submit
                </Button>
              ) : (
                <Button
                  size="md"
                  width="100%"
                  bg="#c8c4fc"
                  fontWeight="extrabold"
                  onClick={handleSubmit}
                >
                  Login
                </Button>
              )}

              <Box position="relative" padding="10">
                <Divider color="#c8c4fc" bgColor="#c8c4fc" />
                <AbsoluteCenter bg="white" px="4">
                  OR
                </AbsoluteCenter>
              </Box>
              <Box display="flex" gap="5px">
                <Text> New to VogueNest?</Text>
                <Link to="/signup" color="blue">
                  {' '}
                  <Text color="blue">SignUp</Text>{' '}
                </Link>
                <Text>Now!!</Text>
              </Box>
            </Center>
          </Container>
        </Stack>
      </Box>
    </Box>
  );
}
