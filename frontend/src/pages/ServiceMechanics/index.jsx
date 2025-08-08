import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Text, Grid, GridItem, VStack, Button, useToast
} from '@chakra-ui/react';
import axios from 'axios';
import Header from '../../components/header';

const ServiceMechanics = () => {
  const { serviceName } = useParams();
  const [mechanics, setMechanics] = useState([]);
  const [selectedMechanic, setSelectedMechanic] = useState(null);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const fetchMechanics = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/mechanics/by-service`, {
          params: { name: serviceName }
        });
        setMechanics(response.data.mechanics);
      } catch (err) {
        console.error('Error fetching mechanics by service:', err);
      }
    };

    fetchMechanics();
  }, [serviceName]);

  const handleBooking = async () => {
    if (!selectedMechanic) {
      return toast({ title: 'Select a mechanic', status: 'warning' });
    }
    
    try {
      const token = localStorage.getItem('token');
      
      // Log the actual payload
      console.log("Booking payload:", {
        mechanicId: selectedMechanic._id,
        serviceName,
        startTime: new Date().toISOString()
      });
      
      const selectedService = selectedMechanic.services[0]; // or match by name if needed

      const { data } = await axios.post(
        'http://localhost:5001/api/appointments/book',
        {
          mechanicId: selectedMechanic._id,
          serviceId: selectedService.serviceId,
          startTime: new Date().toISOString(),
          type: 'scheduled'
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      
      navigate('/confirmation', {
        state: { mechanic: selectedMechanic, bookingId: data.appointment._id }
      });
    } catch (err) {
      console.error('Booking failed:', err.response?.data || err);
      toast({ title: 'Booking failed', status: 'error' });
    }
  };
  
  

  return (
    <Box>
      <Header />
      <Box pt="120px" px={8}>
        <Text fontSize="3xl" fontWeight="bold" color="orange.400" mb={6}>
          Mechanics Offering: {serviceName}
        </Text>

        {mechanics.length === 0 ? (
          <Text fontSize="lg" color="gray.500">No mechanics offer this service yet.</Text>
        ) : (
          <Grid templateColumns="repeat(4, 1fr)" gap={6}>
            {mechanics.map((mechanic, index) => (
              <GridItem
                key={index}
                textAlign="center"
                border="2px solid"
                borderColor={selectedMechanic?._id === mechanic._id ? 'orange.400' : '#ccc'}
                borderRadius="md"
                p={4}
                cursor="pointer"
                onClick={() => {
                  console.log("Selected mechanic:", mechanic);  // Add this log
                  setSelectedMechanic(mechanic);
                }}
                
              >
                <Text mt={2} fontSize="lg" fontWeight="bold">{mechanic.businessName}</Text>
                <Text fontSize="sm" color="gray.600">
                  Location: {mechanic.location?.coordinates?.join(', ') || "N/A"}
                </Text>
                <Text fontSize="sm">Hourly Rate: ${mechanic.hourlyRate}</Text>
                <Text fontSize="sm">Rating: {mechanic.averageRating} ⭐ ({mechanic.totalReviews} reviews)</Text>
              </GridItem>
            ))}
          </Grid>
        )}

        <VStack mt={10}>
          <Button
            colorScheme="orange"
            size="lg"
            isDisabled={!selectedMechanic}
            onClick={handleBooking}
            
          >
            Book Now
          </Button>
        </VStack>
      </Box>
    </Box>
  );
};

export default ServiceMechanics;