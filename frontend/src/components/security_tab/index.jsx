import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  HStack,
  Divider,
  useColorModeValue,
  InputGroup,
  InputRightElement,
  Icon,
  FormErrorMessage,
  Alert,
  AlertIcon
} from '@chakra-ui/react';
import { MdOutlineRemoveRedEye, MdOutlineVisibilityOff } from 'react-icons/md';

const SecurityTab = ({ userData, onUpdate, isLoading }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  const handleTogglePassword = () => setShowPassword(!showPassword);
  const handleToggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
    
    // Check if passwords match
    if (name === 'newPassword' || name === 'confirmPassword') {
      if (name === 'newPassword' && formData.confirmPassword && value !== formData.confirmPassword) {
        setErrors(prev => ({
          ...prev,
          confirmPassword: "Passwords do not match"
        }));
      } else if (name === 'confirmPassword' && value !== formData.newPassword) {
        setErrors(prev => ({
          ...prev,
          confirmPassword: "Passwords do not match"
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          confirmPassword: null
        }));
      }
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }
    
    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onUpdate({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      
      // Reset form
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setIsChangingPassword(false);
    }
  };
  
  const bgColor = useColorModeValue("gray.50", "gray.700");
  
  return (
    <Box>
      <HStack justify="space-between" mb={6}>
        <Text fontSize="lg" fontWeight="medium">Security Settings</Text>
        {!isChangingPassword && (
          <Button 
            onClick={() => setIsChangingPassword(true)}
            colorScheme="orange"
            variant="outline"
            size="sm"
          >
            Change Password
          </Button>
        )}
      </HStack>
      
      {isChangingPassword ? (
        <Box as="form" onSubmit={handleSubmit}>
          <VStack align="stretch" spacing={5}>
            <FormControl id="currentPassword" isRequired isInvalid={!!errors.currentPassword}>
              <FormLabel>Current Password</FormLabel>
              <InputGroup>
                <Input
                  name="currentPassword"
                  type={showPassword ? "text" : "password"}
                  value={formData.currentPassword}
                  onChange={handleChange}
                  borderColor="brand.500"
                />
                <InputRightElement>
                  <Icon
                    as={showPassword ? MdOutlineVisibilityOff : MdOutlineRemoveRedEye}
                    cursor="pointer"
                    onClick={handleTogglePassword}
                    color="gray.500"
                  />
                </InputRightElement>
              </InputGroup>
              {errors.currentPassword && (
                <FormErrorMessage>{errors.currentPassword}</FormErrorMessage>
              )}
            </FormControl>
            
            <FormControl id="newPassword" isRequired isInvalid={!!errors.newPassword}>
              <FormLabel>New Password</FormLabel>
              <InputGroup>
                <Input
                  name="newPassword"
                  type={showPassword ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={handleChange}
                  borderColor="brand.500"
                />
                <InputRightElement>
                  <Icon
                    as={showPassword ? MdOutlineVisibilityOff : MdOutlineRemoveRedEye}
                    cursor="pointer"
                    onClick={handleTogglePassword}
                    color="gray.500"
                  />
                </InputRightElement>
              </InputGroup>
              {errors.newPassword && (
                <FormErrorMessage>{errors.newPassword}</FormErrorMessage>
              )}
            </FormControl>
            
            <FormControl id="confirmPassword" isRequired isInvalid={!!errors.confirmPassword}>
              <FormLabel>Confirm New Password</FormLabel>
              <InputGroup>
                <Input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  borderColor="brand.500"
                />
                <InputRightElement>
                  <Icon
                    as={showConfirmPassword ? MdOutlineVisibilityOff : MdOutlineRemoveRedEye}
                    cursor="pointer"
                    onClick={handleToggleConfirmPassword}
                    color="gray.500"
                  />
                </InputRightElement>
              </InputGroup>
              {errors.confirmPassword && (
               <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
             )}
           </FormControl>
           
           <HStack justifyContent="flex-end" spacing={4} pt={4}>
             <Button 
               variant="ghost"
               onClick={() => {
                 setIsChangingPassword(false);
                 setFormData({
                   currentPassword: '',
                   newPassword: '',
                   confirmPassword: ''
                 });
               }}
             >
               Cancel
             </Button>
             <Button 
               type="submit"
               colorScheme="orange"
               isLoading={isLoading}
             >
               Update Password
             </Button>
           </HStack>
         </VStack>
       </Box>
     ) : (
       <VStack align="stretch" spacing={5} bg={bgColor} p={5} borderRadius="md">
         <Box>
           <Text fontWeight="medium" fontSize="sm" color="gray.500">Email Verification</Text>
           <HStack mt={2}>
             <Text>{userData?.emailVerified ? 'Verified' : 'Not verified'}</Text>
             {!userData?.emailVerified && (
               <Button size="xs" colorScheme="orange">
                 Verify Email
               </Button>
             )}
           </HStack>
         </Box>
         
         <Divider />
         
         <Box>
           <Text fontWeight="medium" fontSize="sm" color="gray.500">Password</Text>
           <Text>••••••••</Text>
         </Box>

         {/* This is for a later use as a two-factor authentication */}
         {/* <Divider />
         
         <Box>
           <Text fontWeight="medium" fontSize="sm" color="gray.500">Two-Factor Authentication</Text>
           <HStack mt={2}>
             <Text>Not enabled</Text>
             <Button size="xs" colorScheme="orange" variant="outline">
               Enable
             </Button>
           </HStack>
         </Box> */}
         
         <Divider />
         
         <Box>
           <Text fontWeight="medium" fontSize="sm" color="gray.500" mb={2}>Account Security Tips</Text>
           <Alert status="info" borderRadius="md">
             <AlertIcon />
             <Text fontSize="sm">
               Use a strong, unique password for enhanced security.
             </Text>
           </Alert>
         </Box>
       </VStack>
     )}
   </Box>
 );
};

export default SecurityTab;