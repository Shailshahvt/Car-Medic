import React, { useState, useEffect } from 'react';
import { 
  Box, 
  VStack, 
  Text, 
  Flex, 
  Icon,
  Link as ChakraLink
} from '@chakra-ui/react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { MdHome, MdBuild, MdStar, MdSettings, MdEmergency, MdAccountCircle, MdExitToApp } from 'react-icons/md';
import LocalStorage from '../../utils/LocalStorage';

// Default sidebar items
const defaultSidebarItems = [
  { name: 'Home', path: '/home', icon: MdHome },
  { name: 'Periodic Services', path: '/periodic-services', icon: MdBuild },
  { name: 'Value Added Services', path: '/value-services', icon: MdStar },
  { name: 'Mechanical', path: '/mechanic/find-available-slots', icon: MdSettings },
  { name: 'Emergency Service', path: '/emergency', icon: MdEmergency },
];

// customItems array: is customizable for the team :) 
const Sidebar = ({ customItems }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarItems, setSidebarItems] = useState(defaultSidebarItems);
  const [isAuthenticated, setIsAuthenticated] = useState(LocalStorage.isAuthenticated());

  useEffect(() => {
    if (customItems && Array.isArray(customItems) && customItems.length > 0) {
      setSidebarItems(customItems);
    }
  }, [customItems]);

  useEffect(() => {
    const updateAuthState = () => setIsAuthenticated(LocalStorage.isAuthenticated());

    window.addEventListener("storage", updateAuthState);
    return () => window.removeEventListener("storage", updateAuthState);
  }, []);

  const handleLogout = () => {
    console.log("Force Logout and Redirect to Home");
    LocalStorage.clearAuth();
    window.location.href = "/";  // ✅ Redirects to home page instead of login
  };
  

  return (
    <Box 
      as="nav" 
      bg="gray.800"
      color="white"
      w="240px"
      h="calc(100vh - 80px)"  // Sidebar height adjusts for header
      position="fixed"
      left="0"
      top="80px"  // Starts below the header
      zIndex="900"
      overflowY="auto"
    >
      <VStack spacing={0} align="stretch">
        {sidebarItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);

          return (
            <ChakraLink
              as={RouterLink}
              to={item.path}
              key={item.name}
              _hover={{ textDecoration: 'none' }}
            >
              <Flex
                align="center"
                p={4}
                mx={4}
                borderRadius="lg"
                role="group"
                cursor="pointer"
                bg={isActive ? 'gray.700' : 'transparent'}
                _hover={{ bg: 'gray.700' }}
                transition="all 0.3s"
              >
                <Icon mr={4} fontSize="20px" as={item.icon} color="orange.400" />
                <Text fontSize="lg">{item.name}</Text>
              </Flex>
            </ChakraLink>
          );
        })}

        <Box mt="auto">
          {!isAuthenticated ? (
            <ChakraLink as={RouterLink} to="/auth/login" _hover={{ textDecoration: "none" }}>
              <Flex
                align="center"
                p={4}
                mx={4}
                borderRadius="lg"
                role="group"
                cursor="pointer"
                bg={location.pathname === "/auth/login" ? "gray.700" : "transparent"}
                _hover={{ bg: "gray.700" }}
                transition="all 0.3s"
              >
                <Icon mr={4} fontSize="20px" as={MdAccountCircle} color="orange.400" />
                <Text fontSize="lg">Sign In</Text>
              </Flex>
            </ChakraLink>
          ) : (
            <>
              <ChakraLink as={RouterLink} to="/profile" _hover={{ textDecoration: "none" }}>
                <Flex
                  align="center"
                  p={4}
                  mx={4}
                  borderRadius="lg"
                  role="group"
                  cursor="pointer"
                  bg={location.pathname === "/profile" ? "gray.700" : "transparent"}
                  _hover={{ bg: "gray.700" }}
                  transition="all 0.3s"
                >
                  <Icon mr={4} fontSize="20px" as={MdAccountCircle} color="orange.400" />
                  <Text fontSize="lg">Profile</Text>
                </Flex>
              </ChakraLink>

              <Flex
                align="center"
                p={4}
                mx={4}
                borderRadius="lg"
                role="group"
                cursor="pointer"
                bg="transparent"
                _hover={{ bg: "gray.700" }}
                transition="all 0.3s"
                onClick={handleLogout}
              >
                <Icon mr={4} fontSize="20px" as={MdExitToApp} color="red.400" />
                <Text fontSize="lg">Sign Out</Text>
              </Flex>
            </>
          )}
        </Box>
      </VStack>
    </Box>
  );
};

export default Sidebar;
