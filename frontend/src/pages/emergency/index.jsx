import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Text, VStack, HStack } from '@chakra-ui/react';

const EmergencyService = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    carMake: '',
    carModel: '',
    location: '',
    issue: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Emergency booking submitted! Our team will reach out shortly.');
  };

  return (
      <Box 
        p={8}
        bg="white"
        borderRadius="lg"
        boxShadow="xl"
        maxW="800px"
        w="100%"
        mt={10}
        mx="auto"
        ml="-40px"
      >

      <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb={6}>Emergency Booking</Text>
      
      <form onSubmit={handleSubmit}>
        <VStack spacing={5} align="stretch">
          
          <HStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Name</FormLabel>
              <Input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your name" />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" />
            </FormControl>
          </HStack>

          <HStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Phone Number</FormLabel>
              <Input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter phone number" />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Car Make</FormLabel>
              <Input type="text" name="carMake" value={formData.carMake} onChange={handleChange} placeholder="E.g., Toyota" />
            </FormControl>
          </HStack>

          <HStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Car Model</FormLabel>
              <Input type="text" name="carModel" value={formData.carModel} onChange={handleChange} placeholder="E.g., Corolla" />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Location</FormLabel>
              <Input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Enter location" />
            </FormControl>
          </HStack>

          <FormControl isRequired>
            <FormLabel>Service Required</FormLabel>
            <Input type="text" name="issue" value={formData.issue} onChange={handleChange} placeholder="Briefly describe your emergency" />
          </FormControl>

          <Button type="submit" colorScheme="orange" width="full">Submit Emergency Request</Button>
        </VStack>
      </form>
    </Box>
  );
};

export default EmergencyService;
