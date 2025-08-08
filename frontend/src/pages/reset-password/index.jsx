/**
 * This page handles the Reset Password functionality, 
 * allowing users to set a new password using a reset token from their email.
 * 
 * Author: Ahmed Aredah
 */

import React, { useState }  from "react";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
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

function ResetPassword() {
  // Chakra color mode
  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.400";
  const textColorBrand = useColorModeValue("brand.500", "white");
  const brandStars = useColorModeValue("brand.500", "brand.400");
  
  // Get token from URL
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  
  const [show, setShow] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const toast = useToast();
  const navigate = useNavigate();
  
  const handleClick = () => setShow(!show);

  const handleSubmit = async () => {
    // Validate token exists
    if (!token) {
      toast({
        title: "Invalid Reset Link",
        description: "Please use the reset link from your email",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    // Validate passwords
    if (!newPassword || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await authService.resetPassword(token, newPassword);
      if (response.success) {
        toast({
          title: "Success",
          description: "Your password has been reset successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        navigate("/auth/login");
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to reset password",
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
      marginTop="20px"
      >
        <Box me='auto'>
          <Heading color={textColor} fontSize='36px' mb='10px'>
            Reset Password
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
              New Password<Text color={brandStars}>*</Text>
            </FormLabel>
            <InputGroup size='md'>
              <Input
                isRequired={true}
                fontSize='sm'
                placeholder='Enter new password'
                mb='24px'
                size='lg'
                type={show ? "text" : "password"}
                variant='auth'
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                border='2px solid #1393b6'
              />
              <InputRightElement display='flex' alignItems='center' mt='4px'>
                <Icon
                  color={textColorSecondary}
                  _hover={{ cursor: "pointer" }}
                  as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                  onClick={handleClick}
                />
              </InputRightElement>
            </InputGroup>

            <FormLabel
              display='flex'
              ms='4px'
              fontSize='sm'
              fontWeight='500'
              color={textColor}
              mb='8px'>
              Confirm Password<Text color={brandStars}>*</Text>
            </FormLabel>
            <InputGroup size='md'>
              <Input
                isRequired={true}
                fontSize='sm'
                placeholder='Confirm new password'
                mb='24px'
                size='lg'
                type={show ? "text" : "password"}
                variant='auth'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                border='2px solid #1393b6'
              />
            </InputGroup>

            <Button
              onClick={handleSubmit}
              backgroundColor={textColorSecondary}
              fontSize="sm"
              variant="brand"
              fontWeight="500"
              w="100%"
              h="50"
              mb="24px"
              bg="rgba(190, 190, 190, 0.5)"
            >
              Reset Password
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

export default ResetPassword;