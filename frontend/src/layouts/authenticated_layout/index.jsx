/**
 * This layout is used for authenticated pages, 
 * combining a header and a sidebar with the main content area.
 * 
 * Author: Ahmed Aredah
 */

import React from 'react';
import { Box } from '@chakra-ui/react';
import Header from '../../components/header';
import Sidebar from '../../components/sidebar';

// Layout for authenticated pages (header + sidebar)
const AuthenticatedLayout = ({ children }) => {
  return (
    <Box>
      <Header />
      <Sidebar />
      <Box
        pt="80px" // Space for header
        minH="calc(100vh - 80px)"
        w="calc(100% - 240px)"
        ml="auto"
      >
        {children}
      </Box>
    </Box>
  );
};

export default AuthenticatedLayout;