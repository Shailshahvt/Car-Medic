import React, { useState } from "react";
// Chakra imports
import { ChevronDownIcon, SearchIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  Text,
  Menu, 
  MenuButton, 
  MenuList, 
  MenuItem, 
  InputLeftElement, 
  Tag, 
  TagLabel, 
  TagCloseButton,
  useToast
} from "@chakra-ui/react";
// Assets
import axios from "axios"; // Import axios for API calls
import MechanicSlot from '../../components/mechanic_slot';
import Constants from '../../constants';

function FindAvailableSlots() {
  const [selectedMechanic, setSelectedMechanic] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredServices, setFilteredServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]); 
  const mechanicList = [
    { name: "Mechanic 1", time: "1:00 PM", cost: 400 },
    { name: "Mechanic 2", time: "12:00 AM", cost: 500 },
    { name: "Mechanic 3", time: "04:00 PM", cost: 250 },
    { name: "Mechanic 4", time: "1:00 PM", cost: 400 },
    { name: "Mechanic 5", time: "12:00 AM", cost: 500 },
    { name: "Mechanic 6", time: "04:00 PM", cost: 250 },
    { name: "Mechanic 7", time: "1:00 PM", cost: 400 },
    { name: "Mechanic 8", time: "12:00 AM", cost: 500 },
    { name: "Mechanic 9", time: "04:00 PM", cost: 250 },
    { name: "Mechanic 10", time: "1:00 PM", cost: 400 },
    { name: "Mechanic 11", time: "12:00 AM", cost: 500 },
    { name: "Mechanic 12", time: "04:00 PM", cost: 250 },
    { name: "Mechanic 13", time: "1:00 PM", cost: 400 },
    { name: "Mechanic 14", time: "12:00 AM", cost: 500 },
    { name: "Mechanic 15", time: "04:00 PM", cost: 250 },
    { name: "Mechanic 16", time: "1:00 PM", cost: 400 },
    { name: "Mechanic 17", time: "12:00 AM", cost: 500 },
    { name: "Mechanic 18", time: "04:00 PM", cost: 250 }
  ]

  const [filteredMechanics, setFilteredMechanics] = useState(mechanicList);
  const toast = useToast(); // Initialize toast for notifications

  function selectedMechanicHandler(index) {
    if (index == selectedMechanic) {
      setSelectedMechanic(null)
    }
    else {
      setSelectedMechanic(index)
    }
  }

  function searchHandler(event) {
    const value = event.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      setFilteredMechanics(mechanicList);
    } else {
      const matches = mechanicList.filter(mechanic =>
        mechanic.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredMechanics(matches);
    }

    if (value.trim() === "") {
      setFilteredServices([]);
    } else {
      const matches = Constants.services.filter(service =>
        service.includes(value.toLowerCase())
      );
      setFilteredServices(matches);

      if (value.trim() === "") {
        setFilteredServices([]);
      } else {
        const matches = Constants.services.filter(service =>
          service.includes(value.toLowerCase())
        );
        setFilteredServices(matches);
      }
    }
  }

  function selectServiceHandler(service) {
    if (!selectedServices.includes(service)) {
      setSelectedServices([...selectedServices, service]);
    }

    setSearchTerm('');
    setFilteredServices([]);
  }

  function removeServiceHandler(service) {
    setSelectedServices(selectedServices.filter(s => s !== service));
  }

  async function completeBookingHandler() {
    if (!selectedMechanic) return;

    const bookingDetails = {
      mechanic: filteredMechanics[selectedMechanic - 1],
      services: selectedServices,
    };

    try {
      // Save booking in the database
      // await axios.post("/api/bookings", bookingDetails);

      // Show confirmation message
      toast({
        title: "Booking Confirmed",
        description: "Your booking has been successfully saved.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Reset state after booking
      setSelectedMechanic(null);
      setSelectedServices([]);
    } catch (error) {
      // Handle errors
      toast({
        title: "Booking Failed",
        description: "An error occurred while saving your booking.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }

  return (
    <Box width="1040px" mx="auto" paddingBottom="80px">
      <Text fontSize="lg" fontWeight="bold" ml="20px" mt="20px">Available Mechanics</Text>

      <Flex mt='20px' ml='20px' mr='20px'>
        <Box position="relative" width="300px" >
          <InputGroup >
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Add more services"
              variant="outline"
              borderRadius="10px"
              value={searchTerm}
              onChange={(event) => searchHandler(event)}
            />
          </InputGroup>

          <Flex mt="5px" flexWrap="wrap" width="1040px">
            {selectedServices.map((service, index) => (
              <Tag key={index} size="md" borderRadius="full" variant="solid" background="gray.200" m="2px">
                <TagLabel color="brand.800">{service}</TagLabel>
                <TagCloseButton color="brand.800" onClick={() => removeServiceHandler(service)} />
              </Tag>
            ))}
          </Flex>

          {filteredServices.length > 0 && (
            <Box
              position="absolute"
              width="100%"
              background="white"
              boxShadow="md"
              borderRadius="5px"
              mt="2px"
              zIndex="10"
            >
              {filteredServices.map((service, index) => (
                <Text
                  key={index}
                  p="8px"
                  cursor="pointer"
                  _hover={{ background: "gray.100" }}
                  onClick={() => selectServiceHandler(service)}
                >
                  {service}
                </Text>
              ))}
            </Box>
          )}

        </Box>


        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />} background="gray.100" size="sm" ml="auto">
            Sort By
          </MenuButton>
          <MenuList>
            <MenuItem>Cost</MenuItem>
            <MenuItem>Time</MenuItem>
          </MenuList>
        </Menu>
      </Flex>

      <Flex wrap="wrap" justify="flex-start">
        {filteredMechanics.map((mechanic, index) => (
          <MechanicSlot
            key={index + 1}
            name={mechanic.name}
            time={mechanic.time}
            cost={mechanic.cost}
            onClick={() => selectedMechanicHandler(index + 1)}
            isSelected={selectedMechanic == index + 1}
          />
        ))}
      </Flex>

      <Box
        position="fixed"
        bottom="0"
        left="0"
        width="100%"
        background="white"
        boxShadow="0px -2px 10px rgba(0, 0, 0, 0.1)"
        p="10px"
        textAlign="center"
      >
        <Button
          background="gray.100"
          size="lg"
          borderColor="black"
          borderRadius="20px"
          isDisabled={!selectedMechanic}
          onClick={completeBookingHandler} // Attach the handler
        >
          <Text fontSize="md" color="brand.800">Complete Booking</Text>
        </Button>
      </Box>
    </Box>
  );
}

export default FindAvailableSlots;