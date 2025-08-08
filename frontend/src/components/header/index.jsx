/**
 * This component represents the Header, 
 * displaying the CarMedic logo and providing navigation functionality 
 * based on the user's authentication status.
 * 
 * Author: Ahmed Aredah
 */

import React from 'react';
import { Box, Flex, Image, Text } from '@chakra-ui/react';
import logoImg from '../../assets/images/Logo.png';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import LocalStorage from '../../utils/LocalStorage';


const Header = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(LocalStorage.isAuthenticated());

  useEffect(() => {
    const handleStorageChange = () => setIsAuthenticated(LocalStorage.isAuthenticated());
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    LocalStorage.clearAuth(); // Clears token and user
    setIsAuthenticated(false);
    navigate('/');
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <Box 
      as="header" 
      bg="gray.800" 
      w="100%" 
      py={4} 
      px={6}
      position="fixed"
      top="0"
      left="0"
      zIndex="1000"
      height="80px"
    >
      <Flex align="center" justify="center" height="100%">
        <Flex align="center">
          {/* Logo Icon */}
          <Image 
            src={logoImg} 
            alt="CarMedic Logo" 
            height="60px"
            mr={4}
          />
          
          {/* Logo Text */}
          <Box>
            <Text 
              fontSize="5xl" 
              fontWeight="bold" 
              color="white"
              lineHeight="1"
            >
              CarMedic
            </Text>
            <Text 
              fontSize="xl" 
              letterSpacing="wider" 
              color="orange.400"
              mt={1}
            >
              GET IT FIXED
            </Text>
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;