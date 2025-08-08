/**
 * This component represents the Garage Tab, 
 * allowing users to view, add, and remove vehicles from their garage. 
 * It includes a modal for adding vehicle details and integrates with car services.
 * 
 * Author: Ahmed Aredah
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  Grid,
  Text,
  HStack,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Select,
  useDisclosure,
  Divider,
  Icon,
  useColorModeValue,
  Alert,
  AlertIcon,
  InputGroup,
  InputLeftElement
} from '@chakra-ui/react';
import { FaPlus, FaCar, FaTrash } from 'react-icons/fa';
import { MdBuild, MdLocalCarWash } from 'react-icons/md';
import carService from '../../services/car.service';

const GarageTab = ({ vehicles, onAddVehicle, onRemoveVehicle, isLoading }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [carMakes, setCarMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedMake, setSelectedMake] = useState('');
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  
  const [vehicleData, setVehicleData] = useState({
    carModelId: '',
    licensePlate: '',
    color: '',
    year: new Date().getFullYear(),
    vin: '',
    purchaseYear: new Date().getFullYear(),
    mileage: ''
  });
  
  const cardBg = useColorModeValue("white", "gray.700");
  const cardBorder = useColorModeValue("gray.200", "gray.600");
  
  useEffect(() => {
    const fetchCarMakes = async () => {
      try {
        const data = await carService.getCarMakes();
        setCarMakes(data);
      } catch (error) {
        console.error("Failed to fetch car makes:", error);
      }
    };
    
    fetchCarMakes();
  }, []);
  
  const handleMakeChange = async (e) => {
    const make = e.target.value;
    setSelectedMake(make);
    setVehicleData(prev => ({ ...prev, carModelId: '' }));
    
    if (make) {
      try {
        setIsLoadingModels(true);
        const data = await carService.getModelsByMake(make);
        setModels(data);
      } catch (error) {
        console.error("Failed to fetch car models:", error);
        setModels([]);
      } finally {
        setIsLoadingModels(false);
      }
    } else {
      setModels([]);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVehicleData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = () => {
    onAddVehicle(vehicleData);
    resetForm();
    onClose();
  };
  
  const resetForm = () => {
    setVehicleData({
      carModelId: '',
      licensePlate: '',
      color: '',
      year: new Date().getFullYear(),
      vin: '',
      purchaseYear: new Date().getFullYear(),
      mileage: ''
    });
    setSelectedMake('');
    setModels([]);
  };
  
  const confirmRemoveVehicle = (vehicleId) => {
    if (window.confirm("Are you sure you want to remove this vehicle from your garage?")) {
      onRemoveVehicle(vehicleId);
    }
  };
  
  const formatYear = (year) => year || 'N/A';
  const formatMileage = (mileage) => mileage ? `${mileage.toLocaleString()} km` : 'N/A';
  
  return (
    <Box>
      <HStack justify="space-between" mb={6}>
        <Text fontSize="lg" fontWeight="medium">My Garage</Text>
        <Button 
          leftIcon={<Icon as={FaPlus} />}
          onClick={onOpen}
          colorScheme="orange"
          size="sm"
        >
          Add Vehicle
        </Button>
      </HStack>
      
      {vehicles.length === 0 ? (
        <Alert status="info" borderRadius="md">
          <AlertIcon />
          You don't have any vehicles in your garage yet. Add a vehicle to get started.
        </Alert>
      ) : (
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={6}>
          {vehicles.map((vehicle) => (
            <Box 
              key={vehicle._id}
              p={5}
              borderRadius="md"
              border="1px"
              borderColor={cardBorder}
              bg={cardBg}
              boxShadow="md"
              position="relative"
            >
              <Button
                position="absolute"
                top={2}
                right={2}
                size="sm"
                colorScheme="red"
                variant="ghost"
                onClick={() => confirmRemoveVehicle(vehicle._id)}
              >
                <Icon as={FaTrash} />
              </Button>
              
              <Flex align="center" mb={4}>
                <Icon as={FaCar} boxSize={8} color="brand.500" mr={3} />
                <VStack align="start" spacing={0}>
                  <Text fontWeight="bold">{vehicle.licensePlate}</Text>
                  <Text fontSize="sm" color="gray.500">
                    {vehicle.carModel?.make} {vehicle.carModel?.model} {formatYear(vehicle.year)}
                  </Text>
                </VStack>
              </Flex>
              
              <Divider mb={4} />
              
              <VStack align="start" spacing={3}>
                <HStack>
                  <Text fontWeight="medium" fontSize="sm" color="gray.500" width="100px">Color:</Text>
                  <Text>{vehicle.color || 'Not specified'}</Text>
                </HStack>
                
                <HStack>
                  <Text fontWeight="medium" fontSize="sm" color="gray.500" width="100px">Year:</Text>
                  <Text>{formatYear(vehicle.year)}</Text>
                </HStack>
                
                <HStack>
                  <Text fontWeight="medium" fontSize="sm" color="gray.500" width="100px">Mileage:</Text>
                  <Text>{formatMileage(vehicle.mileage)}</Text>
                </HStack>
                
                {vehicle.vin && (
                  <HStack>
                    <Text fontWeight="medium" fontSize="sm" color="gray.500" width="100px">VIN:</Text>
                    <Text>{vehicle.vin}</Text>
                  </HStack>
                )}
                
                <HStack mt={2}>
                  <Button
                    size="sm"
                    leftIcon={<Icon as={MdBuild} />}
                    variant="outline"
                    colorScheme="orange"
                  >
                    Service History
                  </Button>
                </HStack>
              </VStack>
            </Box>
          ))}
        </Grid>
      )}
      
      {/* Add Vehicle Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add a Vehicle</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={5} align="stretch">
              <HStack>
                <FormControl id="make" isRequired>
                  <FormLabel>Make</FormLabel>
                  <Select
                    placeholder="Select Make"
                    value={selectedMake}
                    onChange={handleMakeChange}
                    borderColor="brand.500"
                  >
                    {carMakes.map(make => (
                      <option key={make.id} value={make.id}>{make.name}</option>
                    ))}
                  </Select>
                </FormControl>
                
                <FormControl id="model" isRequired isDisabled={!selectedMake || isLoadingModels}>
                  <FormLabel>Model</FormLabel>
                  <Select
                    placeholder={isLoadingModels ? "Loading..." : "Select Model"}
                    value={vehicleData.carModelId}
                    name="carModelId"
                    onChange={handleInputChange}
                    borderColor="brand.500"
                  >
                    {models.map(model => (
                      <option key={model.id} value={model.id}>{model.name}</option>
                    ))}
                  </Select>
                </FormControl>
              </HStack>
              
              <HStack>
                <FormControl id="year" isRequired>
                  <FormLabel>Year</FormLabel>
                  <Input
                    type="number"
                    name="year"
                    value={vehicleData.year}
                    onChange={handleInputChange}
                    borderColor="brand.500"
                    max={new Date().getFullYear() + 1}
                    min={1900}
                  />
                </FormControl>
                
                <FormControl id="color" isRequired>
                  <FormLabel>Color</FormLabel>
                  <Input
                    name="color"
                    value={vehicleData.color}
                    onChange={handleInputChange}
                    borderColor="brand.500"
                  />
                </FormControl>
              </HStack>
              
              <FormControl id="licensePlate" isRequired>
                <FormLabel>License Plate</FormLabel>
                <Input
                  name="licensePlate"
                  value={vehicleData.licensePlate}
                  onChange={handleInputChange}
                  borderColor="brand.500"
                  placeholder="e.g., ABC-1234"
                />
              </FormControl>
              
              <FormControl id="vin">
                <FormLabel>VIN (Vehicle Identification Number)</FormLabel>
                <Input
                  name="vin"
                  value={vehicleData.vin}
                  onChange={handleInputChange}
                  borderColor="brand.500"
                  placeholder="Optional"
                />
              </FormControl>
              
              <HStack>
                <FormControl id="purchaseYear">
                  <FormLabel>Purchase Year</FormLabel>
                  <Input
                    type="number"
                    name="purchaseYear"
                    value={vehicleData.purchaseYear}
                    onChange={handleInputChange}
                    borderColor="brand.500"
                    max={new Date().getFullYear()}
                    min={1900}
                  />
                </FormControl>
                
                <FormControl id="mileage">
                  <FormLabel>Current Mileage (km)</FormLabel>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      color="gray.500"
                      fontSize="1.2em"
                      children="km"
                    />
                    <Input
                      type="number"
                      name="mileage"
                      value={vehicleData.mileage}
                      onChange={handleInputChange}
                      borderColor="brand.500"
                      pl="50px"
                      min={0}
                    />
                  </InputGroup>
                </FormControl>
              </HStack>
            </VStack>
          </ModalBody>
          
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="orange"
              leftIcon={<Icon as={MdLocalCarWash} />}
              onClick={handleSubmit}
              isLoading={isLoading}
              isDisabled={!vehicleData.carModelId || !vehicleData.licensePlate || !vehicleData.color}
            >
              Add to Garage
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default GarageTab;