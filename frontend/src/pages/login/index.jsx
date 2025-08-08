/**
 * This page handles the user login process, 
 * allowing users to authenticate by providing their email and password.
 * 
 * Author: Ahmed Aredah
 */

import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
// Chakra imports
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useColorModeValue,
  useToast
} from "@chakra-ui/react";
// Assets
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";

import authService from '../../services/auth.service'
import LocalStorage from '../../utils/LocalStorage';

function LogIn() {
  // Chakra color mode
  const textColor = useColorModeValue("gray.700", "white");
  const textColorBrand = useColorModeValue("brand.500", "brand.400");
  const brandStars = useColorModeValue("brand.500", "brand.400");
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const { success, data, error } = await authService.login(email, password);
      console.log("Login response:", { success, data });
      
      if (success) {
        // Check if authentication worked
        console.log("Auth status after login:", LocalStorage.isAuthenticated());

        // Retrieve the complete user object from localStorage
        const storedUser = LocalStorage.getUser();
        const userEmail = storedUser?.email || email; // fallback to input email if missing
        const userType = storedUser?.type || "customer"; // default type if not found

        localStorage.setItem("auth-refresh", Date.now());
        
        toast({
          title: `Welcome, ${userEmail}!`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        
        if (userType === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      } else {
        toast({
          title: "Login failed",
          description: error || "Invalid credentials",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (err) {
      console.error("Login error:", err);
      toast({
        title: "An error occurred",
        description: err.message || "Something went wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex
      maxW={{ base: "100%", md: "max-content" }}
      w='100%'
      mx='auto'
      my='auto'
      me='auto'
      h='100%'
      alignItems='center'
      justifyContent='center'
      flexDirection='column'
      marginTop="40px"
      pt="20px"
      >
        <Box me='auto'>
          <Heading color={textColor} fontSize='36px' mb='10px'>
            Login Form
          </Heading>
        </Box>
        <Flex
          zIndex='2'
          direction='column'
          w={{ base: "100%", md: "420px" }}
          maxW='100%'
          background='transparent'
          borderRadius='15px'
          mx={{ base: "auto", lg: "unset" }}
          me='auto'
          mb={{ base: "20px", md: "auto" }}>
          <FormControl>
            <FormLabel
              display='flex'
              ms='4px'
              fontSize='sm'
              fontWeight='500'
              color={textColor}
              mb='8px'>
              Email<Text color={brandStars}>*</Text>
            </FormLabel>
            <Input
              isRequired={true}
              variant='auth'
              fontSize='sm'
              ms={{ base: "0px", md: "0px" }}
              type='email'
              placeholder='please enter your email'
              mb='24px'
              fontWeight='500'
              size='lg'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              border="1px solid"
              borderColor="brand.500"
            />
            <FormLabel
              ms='4px'
              fontSize='sm'
              fontWeight='500'
              color={textColor}
              display='flex'>
              Password<Text color={brandStars}>*</Text>
            </FormLabel>
            <InputGroup size='md'>
              <Input
                isRequired={true}
                fontSize='sm'
                placeholder='please enter your password'
                mb='24px'
                size='lg'
                type={show ? "text" : "password"}
                variant='auth'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                border="1px solid" 
                borderColor="brand.500"
              />
              <InputRightElement display='flex' alignItems='center' mt='4px'>
                <Icon
                  color="brand.500"
                  _hover={{ cursor: "pointer" }}
                  as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                  onClick={handleClick}
                />
              </InputRightElement>
            </InputGroup>
            <Flex justifyContent='space-between' align='center' mb='24px'>
              <NavLink to='/auth/forgot-password'>
                <Text
                  color={textColorBrand}
                  fontSize='sm'
                  w='124px'
                  fontWeight='500'>
                  Forgot password?
                </Text>
              </NavLink>
            </Flex>
            <Button
              onClick={handleLogin}
              fontSize="sm"
              variant="brand"
              fontWeight="500"
              w="100%"
              h="50"
              mb="24px"
              _hover={{ bg: "brand.600" }}>
            Login
            </Button>
          </FormControl>
          <Flex
            flexDirection='column'
            justifyContent='center'
            alignItems='start'
            maxW='100%'
            mt='0px'>
            <Text color={textColor} fontWeight='400' fontSize='14px'>
              Not registered yet?
              <NavLink to='/auth/register'>
                <Text
                  color={textColorBrand}
                  as='span'
                  ms='5px'
                  fontWeight='500'>
                  Create an Account
                </Text>
              </NavLink>
            </Text>
          </Flex>
        </Flex>
    </Flex>
  );
}

export default LogIn;