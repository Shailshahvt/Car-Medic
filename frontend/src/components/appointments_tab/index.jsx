/**
 * This component represents the Appointments Tab, 
 * allowing users to view, manage, and filter their appointments 
 * by status (upcoming, completed, or cancelled.
 * 
 * Author: Ahmed Aredah
 */

import React from 'react';
import usersService from '../../services/users.service';
import {
  Box,
  Text,
  VStack,
  HStack,
  Divider,
  Badge,
  Button,
  Flex,
  Icon,
  Spinner,
  useColorModeValue,
  Grid,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel
} from '@chakra-ui/react';
import { MdSchedule, MdCheckCircle, MdCancel, MdArrowForward } from 'react-icons/md';
import { FaCar, FaWrench } from 'react-icons/fa';

const AppointmentsTab = ({ appointments = [], isLoading = false, reloadUserProfile }) => {
  const cardBg = useColorModeValue("white", "gray.700");
  const cardBorder = useColorModeValue("gray.200", "gray.600");

  const pendingAppointments = appointments.filter(appt =>
    appt.status.toLowerCase() === 'pending' || appt.status.toLowerCase() === 'accepted'
  );

  const completedAppointments = appointments.filter(appt =>
    appt.status.toLowerCase() === 'completed'
  );

  const cancelledAppointments = appointments.filter(appt =>
    appt.status.toLowerCase() === 'cancelled' || appt.status.toLowerCase() === 'rejected'
  );

  const getBadgeColorScheme = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'green';
      case 'pending': return 'yellow';
      case 'cancelled': return 'red';
      case 'accepted': return 'blue';
      case 'rejected': return 'red';
      default: return 'gray';
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return (
      <Flex justify="center" p={10}>
        <Spinner size="xl" color="brand.500" thickness="4px" />
      </Flex>
    );
  }

  const AppointmentCard = ({ appointment }) => {
    const handleCancel = async () => {
      try {
        // Call your backend cancel API here
        const response = await usersService.cancelAppointment(appointment._id);
        
        if (response.success) {
          reloadUserProfile();  // <- reloads and moves appointment automatically
        } else {
          console.error("Failed to cancel appointment:", response.error);
        }
      } catch (error) {
        console.error("Error canceling appointment:", error.message);
      }
    };
  
    return (
      <Box
        p={5}
        borderRadius="md"
        border="1px"
        borderColor={cardBorder}
        bg={cardBg}
        boxShadow="sm"
        mb={4}
      >
        <HStack justify="space-between" mb={3}>
          <HStack>
            <Icon as={MdSchedule} color="brand.500" boxSize={5} />
            <Text fontWeight="medium">{formatDate(appointment.startTime)}</Text>
          </HStack>
          <Badge colorScheme={getBadgeColorScheme(appointment.status)}>
            {appointment.status}
          </Badge>
        </HStack>
  
        <Divider mb={4} />
  
        <Grid templateColumns="1fr 1fr" gap={4}>
          {/* service, mechanic, vehicle, total cost */}
          <Box>
            <Text fontSize="sm" color="gray.500">Service</Text>
            <HStack mt={1}>
              <Icon as={FaWrench} color="gray.500" />
              <Text>{appointment.serviceId?.name || 'Service details not available'}</Text>
            </HStack>
          </Box>
          <Box>
            <Text fontSize="sm" color="gray.500">Mechanic</Text>
            <Text mt={1}>{appointment.mechanicId?.businessName || 'Mechanic details not available'}</Text>
          </Box>
          <Box>
            <Text fontSize="sm" color="gray.500">Vehicle</Text>
            <HStack mt={1}>
              <Icon as={FaCar} color="gray.500" />
              <Text>{appointment.vehicle?.licensePlate || 'Vehicle details not available'}</Text>
            </HStack>
          </Box>
          <Box>
            <Text fontSize="sm" color="gray.500">Total Cost</Text>
            <Text mt={1} fontWeight="bold">
              ${appointment.totalCost?.toFixed(2) || 'N/A'}
            </Text>
          </Box>
        </Grid>
  
        {appointment.status.toLowerCase() === 'pending' && (
          <HStack mt={4} justify="flex-end">
            <Button
              size="sm"
              colorScheme="red"
              variant="outline"
              onClick={handleCancel} 
            >
              Cancel
            </Button>
          </HStack>
        )}
  
        {appointment.status.toLowerCase() === 'completed' && (
          <HStack mt={4} justify="flex-end">
            <Button
              size="sm"
              colorScheme="orange"
              rightIcon={<Icon as={MdArrowForward} />}
            >
              View Details
            </Button>
          </HStack>
        )}
      </Box>
    );
  };
  

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="lg" fontWeight="medium">My Appointments</Text>
        {reloadUserProfile && (
          <Button size="sm" colorScheme="orange" onClick={reloadUserProfile}>
            Refresh
          </Button>
        )}
      </Flex>

      <Tabs variant="enclosed" colorScheme="orange">
        <TabList>
          <Tab _selected={{ bg: 'brand.50', borderColor: 'brand.500', borderBottom: '2px solid' }}>
            Upcoming ({pendingAppointments.length})
          </Tab>
          <Tab _selected={{ bg: 'brand.50', borderColor: 'brand.500', borderBottom: '2px solid' }}>
            Completed ({completedAppointments.length})
          </Tab>
          <Tab _selected={{ bg: 'brand.50', borderColor: 'brand.500', borderBottom: '2px solid' }}>
            Cancelled ({cancelledAppointments.length})
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            {pendingAppointments.length === 0 ? (
              <Text color="gray.500" textAlign="center" py={4}>
                No upcoming appointments. Book a service to get started.
              </Text>
            ) : (
              <VStack align="stretch" spacing={4}>
                {pendingAppointments.map(appt => (
                  <AppointmentCard key={appt._id} appointment={appt} />
                ))}
              </VStack>
            )}
          </TabPanel>

          <TabPanel>
            {completedAppointments.length === 0 ? (
              <Text color="gray.500" textAlign="center" py={4}>
                No completed appointments yet.
              </Text>
            ) : (
              <VStack align="stretch" spacing={4}>
                {completedAppointments.map(appt => (
                  <AppointmentCard key={appt._id} appointment={appt} />
                ))}
              </VStack>
            )}
          </TabPanel>

          <TabPanel>
            {cancelledAppointments.length === 0 ? (
              <Text color="gray.500" textAlign="center" py={4}>
                No cancelled appointments.
              </Text>
            ) : (
              <VStack align="stretch" spacing={4}>
                {cancelledAppointments.map(appt => (
                  <AppointmentCard key={appt._id} appointment={appt} />
                ))}
              </VStack>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default AppointmentsTab;
