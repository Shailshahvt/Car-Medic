/**
 * This page handles the Forgot Password functionality, 
 * allowing users to request a password reset link by entering their email address.
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
  Input,
  Text,
  useColorModeValue,
  useToast
} from "@chakra-ui/react";

import authService from '../../services/auth.service'

function ForgotPassword() {
  // Chakra color mode
  const textColor = useColorModeValue("gray.700", "white");
  const textColorBrand = useColorModeValue("brand.500", "brand.400");
  const brandStars = useColorModeValue("brand.500", "brand.400");
  
  const [email, setEmail] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await authService.forgotPassword(email);
      if (response.success) {
        toast({
          title: "Success",
          description: "If an account exists with this email, you will receive password reset instructions.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        navigate("/auth/login");
      } else {
        toast({
          title: "Error",
          description: response.error,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred. Please try again later.",
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
            Forgot Password
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
              placeholder='Please enter your email'
              mb='24px'
              fontWeight='500'
              size='lg'
              border="1px solid"
              borderColor="brand.500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              onClick={handleSubmit}
              fontSize="sm"
              variant="brand"
              fontWeight="500"
              w="100%"
              h="50"
              mb="24px"
              _hover={{ bg: "brand.600" }}
            >
              Send Reset Link
            </Button>
          </FormControl>
          <Flex
            flexDirection='column'
            justifyContent='center'
            alignItems='start'
            maxW='100%'
            mt='0px'>
            <NavLink to='/auth/login'>
              <Text
                color={textColorBrand}
                fontSize='sm'
                w='124px'
                fontWeight='500'>
                Back to Login
              </Text>
            </NavLink>
          </Flex>
        </Flex>
    </Flex>
  );
}

export default ForgotPassword;