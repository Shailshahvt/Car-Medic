import { useLocation } from "react-router-dom";
import {
  Box,
  Text,
  VStack,
  Heading,
  Divider,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Icon
} from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import Header from "../../components/header";

const Confirmation = () => {
  const { state } = useLocation();

  if (!state) return <Text>Invalid navigation</Text>;

  return (
    <Box>
      <Header />
      <Box pt="120px" px={4} display="flex" justifyContent="center">
        <Card
          maxW="lg"
          borderRadius="xl"
          boxShadow="lg"
          p={6}
          border="1px solid"
          borderColor="gray.200"
          backgroundColor="white"
        >
          <CardHeader textAlign="center">
            <VStack spacing={2}>
              <Icon as={CheckCircleIcon} boxSize={10} color="green.400" />
              <Heading size="lg" color="green.600">
                Booking Confirmed!
              </Heading>
              <Text fontSize="sm" color="gray.500">
                Thank you for scheduling with us.
              </Text>
            </VStack>
          </CardHeader>

          <Divider my={4} />

          <CardBody>
            <VStack align="start" spacing={3}>
              <Text>
                <strong>Booking ID:</strong> {state.bookingId}
              </Text>
              <Text>
                <strong>Mechanic:</strong> {state.mechanic.businessName}
              </Text>
              <Text>
                <strong>Hourly Rate:</strong> ${state.mechanic.hourlyRate}
              </Text>
            </VStack>
          </CardBody>

          <CardFooter justifyContent="center">
            <Button colorScheme="green" onClick={() => window.location.href = '/'}>
              Back to Home
            </Button>
          </CardFooter>
        </Card>
      </Box>
    </Box>
  );
};

export default Confirmation;
