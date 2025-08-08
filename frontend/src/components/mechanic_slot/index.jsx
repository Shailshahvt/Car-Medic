/**
 * This component represents a Mechanic Slot, 
 * displaying available slots for mechanics with details such as name, time, and cost. 
 * It supports selection and click handling.
 * 
 * Author: Ahmed Aredah
 */

import { Box, Text, Divider } from "@chakra-ui/react";

const MechanicSlot = ({ name, time, cost, onClick, isSelected }) => (
    <Box
        p="20px"
        border="1px solid"
        borderColor="brand.500"
        borderRadius="10px"
        background={isSelected ? "cyan.100" : "gray.200"}
        m="20px"
        textAlign="center"
        width="220px"
        cursor="pointer"
        onClick={onClick}
    >
        <Text className='name' fontSize="lg" fontWeight="bold" color="brand.700">{name}</Text>
        <Text className='time' fontSize="md" color="brand.600">Available Slot: {time}</Text>
        <Divider borderColor="brand.500" my="10px" />
        <Text className='cost' fontSize="md" fontWeight="bold" color="brand.800">Cost: ${cost}</Text>
    </Box>
);


export default MechanicSlot;
