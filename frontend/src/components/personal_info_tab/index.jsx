/**
 * This component represents the Personal Info Tab, 
 * allowing users to view and edit their personal information, 
 * including name, email, and phone number.
 * 
 * Author: Ahmed Aredah
 */

import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  HStack,
  Text,
  Divider,
  useColorModeValue
} from '@chakra-ui/react';

const PersonalInfoTab = ({ userData, onUpdate, isLoading }) => {
  const [formData, setFormData] = useState({
    firstName: userData?.firstName || '',
    lastName: userData?.lastName || '',
    email: userData?.email || '',
    phone: userData?.phone || ''
  });
  
  const [isEditing, setIsEditing] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
    setIsEditing(false);
  };
  
  const bgColor = useColorModeValue("gray.50", "gray.700");
  
  if (!isEditing) {
    return (
      <Box>
        <HStack justify="space-between" mb={6}>
          <Text fontSize="lg" fontWeight="medium">Personal Information</Text>
          <Button 
            onClick={() => setIsEditing(true)}
            colorScheme="orange"
            variant="outline"
            size="sm"
          >
            Edit Profile
          </Button>
        </HStack>
        
        <VStack align="stretch" spacing={5} bg={bgColor} p={5} borderRadius="md">
          <HStack>
            <Box w="50%">
              <Text fontWeight="medium" fontSize="sm" color="gray.500">First Name</Text>
              <Text fontSize="md">{userData?.firstName}</Text>
            </Box>
            <Box w="50%">
              <Text fontWeight="medium" fontSize="sm" color="gray.500">Last Name</Text>
              <Text fontSize="md">{userData?.lastName}</Text>
            </Box>
          </HStack>
          
          <Divider />
          
          <Box>
            <Text fontWeight="medium" fontSize="sm" color="gray.500">Email Address</Text>
            <Text fontSize="md">{userData?.email}</Text>
          </Box>
          
          <Divider />
          
          <Box>
            <Text fontWeight="medium" fontSize="sm" color="gray.500">Phone Number</Text>
            <Text fontSize="md">{userData?.phone || 'Not provided'}</Text>
          </Box>
          
          <Divider />
          
          <Box>
            <Text fontWeight="medium" fontSize="sm" color="gray.500">Account Type</Text>
            <Text fontSize="md" textTransform="capitalize">{userData?.type}</Text>
          </Box>
          
          <Divider />
          
          <Box>
            <Text fontWeight="medium" fontSize="sm" color="gray.500">Account Status</Text>
            <Text 
              fontSize="md" 
              textTransform="capitalize"
              color={userData?.status === 'active' ? 'green.500' : 'red.500'}
            >
              {userData?.status}
            </Text>
          </Box>
        </VStack>
      </Box>
    );
  }
  
  return (
    <Box as="form" onSubmit={handleSubmit}>
      <HStack justify="space-between" mb={6}>
        <Text fontSize="lg" fontWeight="medium">Edit Personal Information</Text>
        <HStack>
          <Button 
            onClick={() => setIsEditing(false)}
            variant="outline"
            size="sm"
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            colorScheme="orange"
            size="sm"
            isLoading={isLoading}
          >
            Save Changes
          </Button>
        </HStack>
      </HStack>
      
      <VStack align="stretch" spacing={5}>
        <HStack spacing={5}>
          <FormControl id="firstName">
            <FormLabel>First Name</FormLabel>
            <Input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              borderColor="brand.500"
            />
          </FormControl>
          
          <FormControl id="lastName">
            <FormLabel>Last Name</FormLabel>
            <Input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              borderColor="brand.500"
            />
          </FormControl>
        </HStack>
        
        <FormControl id="email">
          <FormLabel>Email Address</FormLabel>
          <Input
            name="email"
            value={formData.email}
            onChange={handleChange}
            borderColor="brand.500"
            isReadOnly
            bg="gray.100"
            _hover={{ cursor: "not-allowed" }}
          />
          <Text fontSize="xs" color="gray.500" mt={1}>
            Email cannot be changed. Contact support for assistance.
          </Text>
        </FormControl>
        
        <FormControl id="phone">
          <FormLabel>Phone Number</FormLabel>
          <Input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            borderColor="brand.500"
            placeholder="e.g., +1 (123) 456-7890"
          />
        </FormControl>
      </VStack>
    </Box>
  );
};

export default PersonalInfoTab;