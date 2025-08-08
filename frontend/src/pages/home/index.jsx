import React, { useState, useEffect } from "react";
import { Box, Flex, VStack, Text, Image, useColorModeValue, Grid, GridItem } from "@chakra-ui/react";
import LocalStorage from "../../utils/LocalStorage";
import Header from "../../components/header";
import mechanic1 from '../../assets/images/mechanic1.png';
import mechanic2 from '../../assets/images/mechanic2.jpeg';
import mechanic3 from '../../assets/images/mechanic3.avif';
import mechanic4 from '../../assets/images/mechanic4.jpeg';
import service1 from '../../assets/images/service1.jpg';
import service2 from '../../assets/images/service2.png';
import service3 from '../../assets/images/service3.jpg';
import service4 from '../../assets/images/service4.png';
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(LocalStorage.isAuthenticated());
  const navigate = useNavigate();

  useEffect(() => {
    const updateAuthState = () => setIsAuthenticated(LocalStorage.isAuthenticated());
    window.addEventListener("storage", updateAuthState);
    return () => window.removeEventListener("storage", updateAuthState);
  }, []);

  return (
    <Box>
      <Header />
      <Box pt="120px" minH="calc(100vh - 100px)" px={8}> 
        <Flex justify="center" align="center" px={8} mb={6}>  
          <Text fontSize="3xl" fontWeight="bold" color="orange.400" textAlign="center">
            {isAuthenticated ? "Welcome to CarMedic" : "Welcome to CarMedic"}
          </Text>
        </Flex>

        <VStack spacing={4} align="start" mt={2} w="full">
          <Text fontSize="2xl" fontWeight="bold" mb={1}>
            Popular Mechanics
          </Text>
          <Grid templateColumns="repeat(4, 1fr)" gap={4} w="full">
            {[
              { img: mechanic1 },
              { img: mechanic2 },
              { img: mechanic3 },
              { img: mechanic4 }
            ].map((mechanic, index) => (
              <GridItem key={index} textAlign="center">
                <Image 
                  src={mechanic.img} 
                  alt={mechanic.name} 
                  border="2px solid black"
                  borderRadius="md"
                  width="100%" 
                  height="220px"
                  objectFit="cover"
                />
                <Text mt={1} fontSize="md" fontWeight="bold">{mechanic.name}</Text>
              </GridItem>
            ))}
          </Grid>
        </VStack>

        <VStack spacing={4} align="start" mt={2} w="full">
          <Text fontSize="2xl" fontWeight="bold" mb={1}>
            Popular Services
          </Text>
          <Grid templateColumns="repeat(4, 1fr)" gap={4} w="full">
          {[
              { name: "Oil Change", img: service1 },
              { name: "Tire Rotation", img: service2 },
              { name: "Engine Inspection", img: service3 },
              { name: "AC Repair", img: service4 }
            ].map((service, index) => (
              <GridItem
                key={index}
                textAlign="center"
                cursor="pointer"
                onClick={() => navigate(`/services/${encodeURIComponent(service.name)}`)}
              >
                <Image 
                  src={service.img}
                  alt={service.name}
                  border="2px solid black"
                  borderRadius="md"
                  width="100%"
                  height="220px"
                  objectFit="cover"
                />
                <Text mt={1} fontSize="md" fontWeight="bold">{service.name}</Text>
              </GridItem>
            ))}
          </Grid>
        </VStack>

        <Box mt={10}> 
          <Text fontSize="2xl" fontWeight="bold" mb={4}>
            About Us
          </Text>
          <Text fontSize="md" color={useColorModeValue("gray.800", "gray.300")} mb={3}>
            At <strong>CarMedic</strong>, we are committed to providing top-notch automotive services with a 
            focus on quality, reliability, and customer satisfaction. Our team of highly skilled 
            mechanics specializes in various fields, ensuring your vehicle gets the best care possible.
          </Text>
          <Text fontSize="md" color={useColorModeValue("gray.800", "gray.300")} mb={3}>
            From routine maintenance like <strong>oil changes</strong> and <strong>tire rotations</strong> to <strong>complex engine diagnostics</strong>, 
            we offer a wide range of services tailored to keep your car running smoothly. 
            With CarMedic, you can trust that your vehicle is in the hands of professionals.
          </Text>
          <Text fontSize="md" fontWeight="bold" color="orange.400">
            Experience the best in auto care – because your car deserves it!
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
