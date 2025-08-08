/**
 * This page handles the user registration process, 
 * allowing new users to create an account by providing their details 
 * and validating the input fields.
 * 
 * Author: Ahmed Aredah
 */

import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { MdWarning } from "react-icons/md";

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
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";
import authService from '../../services/auth.service';

function Register() {
  const textColor = useColorModeValue("gray.700", "white");
  const textColorBrand = useColorModeValue("brand.500", "brand.400");
  const brandStars = useColorModeValue("brand.500", "brand.400");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    type: "customer" // Default user type
  });
  const [passwordError, setPasswordError] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegister = async () => {
    try {
      // Validate all required fields
      const requiredFields = ['firstName', 'lastName', 'email', 'password'];
      const emptyFields = requiredFields.filter(field => !formData[field]);
      
      if (emptyFields.length > 0) {
        toast({
          title: "Missing Fields",
          description: `Please fill in all required fields: ${emptyFields.join(', ')}`,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }
    
      // Check password
      if (!validatePassword(formData.password)) {
        toast({
          title: "Invalid Password",
          description: passwordError,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }
    
      // Check email availability
      const emailCheck = await authService.checkEmail(formData.email);
      if (!emailCheck.available) {
        toast({
          title: "Email Not Available",
          description: emailCheck.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      console.log("Sending registration data:", formData);
    
      // Proceed with signup
      const { success, message, error, data } = await authService.signup(formData);

      // Log the response
      console.log("Registration response:", { success, message, error, data });

      if (success) {
        toast({
          title: "Registration successful",
          description: "You can now log in with your credentials.",
          status: "success",
          duration: 5000,
          isClosable: true,
          onCloseComplete: () => navigate('/auth/login')
        });
      } else {
        toast({
          title: "Registration failed",
          description: error || "Invalid registration details",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (err) {
      // Log the full error
      console.error("Registration error:", err);
      console.error("Error response:", err.response?.data);

      toast({
        title: "An error occurred",
        description: err.message || "Something went wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    return regex.test(password);
  };

  const handlePasswordChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      password: value
    }));
    if (validatePassword(value)) {
      setPasswordError("");
    } else {
      setPasswordError("Password must be at least 8 characters, include upper and lowercase letters, numbers, and a special character.");
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
          Registration Form
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
        mb={{ base: "20px", md: "auto" }}
      >
        <FormControl>
          {/* First Name Input */}
          <FormLabel
            ms='4px'
            fontSize='sm'
            fontWeight='500'
            color={textColor}
            display='flex'
          >
            First Name<Text color={brandStars}>*</Text>
          </FormLabel>
          <Input
            isRequired={true}
            name="firstName"
            variant='auth'
            fontSize='sm'
            type='text'
            placeholder='please enter your first name'
            mb='24px'
            value={formData.firstName}
            onChange={handleInputChange}
            border="1px solid" 
            borderColor="brand.500"
          />

          {/* Last Name Input */}
          <FormLabel
            ms='4px'
            fontSize='sm'
            fontWeight='500'
            color={textColor}
            display='flex'
          >
            Last Name<Text color={brandStars}>*</Text>
          </FormLabel>
          <Input
            isRequired={true}
            name="lastName"
            variant='auth'
            fontSize='sm'
            type='text'
            placeholder='please enter your last name'
            mb='24px'
            value={formData.lastName}
            onChange={handleInputChange}
            border="1px solid" 
            borderColor="brand.500"
          />

          {/* Email Input */}
          <FormLabel
            ms='4px'
            fontSize='sm'
            fontWeight='500'
            color={textColor}
            display='flex'
          >
            Email<Text color={brandStars}>*</Text>
          </FormLabel>
          <Input
            isRequired={true}
            name="email"
            variant='auth'
            fontSize='sm'
            type='email'
            placeholder='please enter your email'
            mb='24px'
            value={formData.email}
            onChange={handleInputChange}
            border="1px solid" 
            borderColor="brand.500"
          />

          {/* Password Input */}
          <FormLabel
            ms='4px'
            fontSize='sm'
            fontWeight='500'
            color={textColor}
            display='flex'
          >
            Password<Text color={brandStars}>*</Text>
            {passwordError && (
              <Icon as={MdWarning} color="red.500" ml={2} />
            )}
          </FormLabel>
          <InputGroup size='md'>
            <Input
              isRequired={true}
              name="password"
              fontSize='sm'
              placeholder='please enter your password'
              type={showPassword ? "text" : "password"}
              variant='auth'
              value={formData.password}
              onChange={handlePasswordChange}
              border="1px solid"
              borderColor={passwordError ? 'red.500' : 'brand.500'}
              _focus={{
                borderColor: passwordError ? 'red.500' : 'brand.600',
                boxShadow: `0 0 0 1px ${passwordError ? 'var(--chakra-colors-red-500)' : 'var(--chakra-colors-brand-600)'}`
              }}
            />
            <InputRightElement display='flex' alignItems='center' mt='4px'>
              <Icon
                color="brand.500"
                _hover={{ cursor: "pointer" }}
                as={showPassword ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                onClick={() => setShowPassword(!showPassword)}
              />
            </InputRightElement>
          </InputGroup>
          {passwordError && (
            <Text color='red.500' fontSize='sm' mt='2'>
              {passwordError}
            </Text>
          )}

          {/* Register Button */}
          <Button
            onClick={handleRegister}
            fontSize="sm"
            variant="brand"
            fontWeight="500"
            w="100%"
            h="50"
            mb="24px"
            mt="24px"
            isDisabled={passwordError !== ""}
            _hover={{ bg: "brand.600" }}
          >
            Register
          </Button>
        </FormControl>
        
        {/* Already Registered? */}
        <Flex
          flexDirection='column'
          justifyContent='center'
          alignItems='start'
          maxW='100%'
          mt='0px'
        >
          <Text color={textColor} fontWeight='400' fontSize='14px'>
            Already registered?
            <NavLink to='/auth/login'>
              <Text
                color={textColorBrand}
                as='span'
                ms='5px'
                fontWeight='500'
              >
                Log in Here
              </Text>
            </NavLink>
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default Register;