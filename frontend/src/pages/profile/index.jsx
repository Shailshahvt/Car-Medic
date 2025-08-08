/**
 * This page represents the Profile Page, 
 * allowing users to manage their personal information, vehicles, 
 * security settings, and appointments through various tabs.
 * 
 * Author: Ahmed Aredah, Sahil Sharma
 */

import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useToast,
  Heading,
  Flex,
  Text,
  Divider,
  Spinner,
  useColorModeValue
} from '@chakra-ui/react';
import PersonalInfoTab from '../../components/personal_info_tab';
import GarageTab from '../../components/garage_tab';
import SecurityTab from '../../components/security_tab';
import AppointmentsTab from '../../components/appointments_tab';
import usersService from '../../services/users.service';

const ProfilePage = () => {
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const toast = useToast();
    const bgColor = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.700");
    
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setIsLoading(true);
                const response = await usersService.getProfile();
                if (response.success) {
                    setUserData(response.data);
                } else {
                    toast({
                        title: "Error fetching profile",
                        description: response.error,
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                    });
                }
            } catch (error) {
                toast({
                    title: "Error fetching profile",
                    description: error.message || "Failed to load profile data",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchUserProfile();
    }, [toast]);
  
    const handleProfileUpdate = async (updatedData) => {
        try {
        setIsLoading(true);
        const response = await usersService.updateProfile(updatedData);
        if (response.success) {
            setUserData(response.data);
            toast({
            title: "Profile updated",
            description: "Your profile has been updated successfully",
            status: "success",
            duration: 3000,
            isClosable: true,
            });
        } else {
            toast({
                title: "Update failed",
                description: response.error,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
        } catch (error) {
            toast({
                title: "Update failed",
                description: error.message || "Failed to update profile",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleAddVehicle = async (vehicleData) => {
        try {
        setIsLoading(true);
        const response = await usersService.addVehicle(vehicleData);
        if (response.success) {
            // Update the local state with the new vehicle
            setUserData(prev => ({
                ...prev,
                garage: [...(prev.garage || []), response.data]
            }));
            
            toast({
                title: "Vehicle added",
                description: "Vehicle has been added to your garage",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } else {
            toast({
                title: "Failed to add vehicle",
                description: response.error,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
        } catch (error) {
            toast({
                title: "Failed to add vehicle",
                description: error.message || "Could not add vehicle to garage",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const reloadUserProfile = async () => {
        try {
          setIsLoading(true);
          const response = await usersService.getProfile();
          if (response.success) {
            setUserData(response.data);
          } else {
            toast({
              title: "Error refreshing profile",
              description: response.error,
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          }
        } catch (error) {
          toast({
            title: "Error refreshing profile",
            description: error.message || "Failed to reload profile",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        } finally {
          setIsLoading(false);
        }
      };
      
    
    const handleRemoveVehicle = async (vehicleId) => {
        try {
        setIsLoading(true);
        const response = await usersService.removeVehicle(vehicleId);
        
        if (response.success) {
            // Update the local state by removing the vehicle
            setUserData(prev => ({
                ...prev,
                garage: prev.garage.filter(vehicle => vehicle._id !== vehicleId)
            }));
            
            toast({
                title: "Vehicle removed",
                description: response.message || "Vehicle has been removed from your garage",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } else {
            toast({
                title: "Failed to remove vehicle",
                description: response.error,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
        } catch (error) {
            toast({
                title: "Failed to remove vehicle",
                description: error.message || "Could not remove vehicle from garage",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && !userData) {
        return (
            <Flex justify="center" align="center" h="calc(100vh - 80px)">
                <Spinner size="xl" color="brand.500" thickness="4px" />
            </Flex>
        );
    }

    return (
        <Container maxW="container.xl" py={8}>
            <Flex direction="column" mb={8}>
                <Heading size="lg" mb={2}>My Profile</Heading>
                <Text color="gray.600">Manage your personal information and vehicles</Text>
                <Divider mt={4} />
            </Flex>

            <Box 
                bg={bgColor} 
                borderRadius="lg" 
                boxShadow="md" 
                border="1px" 
                borderColor={borderColor}
                overflow="hidden"
            >
                <Tabs variant="enclosed" colorScheme="orange" isLazy>
                <TabList px={4} pt={4}>
                    <Tab _selected={{ bg: 'brand.50', borderColor: 'brand.500', borderBottom: '2px solid' }}>Personal Info</Tab>
                    <Tab _selected={{ bg: 'brand.50', borderColor: 'brand.500', borderBottom: '2px solid' }}>My Garage</Tab>
                    <Tab _selected={{ bg: 'brand.50', borderColor: 'brand.500', borderBottom: '2px solid' }}>Security</Tab>
                    <Tab _selected={{ bg: 'brand.50', borderColor: 'brand.500', borderBottom: '2px solid' }}>Appointments</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel>
                    <PersonalInfoTab 
                        userData={userData} 
                        onUpdate={handleProfileUpdate}
                        isLoading={isLoading}
                    />
                    </TabPanel>
                    <TabPanel>
                    <GarageTab 
                        vehicles={userData?.garage || []}
                        onAddVehicle={handleAddVehicle}
                        onRemoveVehicle={handleRemoveVehicle}
                        isLoading={isLoading}
                    />
                    </TabPanel>
                    <TabPanel>
                    <SecurityTab 
                        userData={userData}
                        onUpdate={handleProfileUpdate}
                        isLoading={isLoading}
                    />
                    </TabPanel>
                    <TabPanel>
                    <AppointmentsTab 
                        appointments={userData?.appointmentHistory || []}
                        isLoading={isLoading}
                        reloadUserProfile={reloadUserProfile}
                        />
                    </TabPanel>
                </TabPanels>
                </Tabs>
            </Box>
        </Container>
    );
};

export default ProfilePage;