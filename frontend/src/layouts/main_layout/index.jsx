import React from "react";
import { Box } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import Header from "../../components/header";
import Sidebar from "../../components/sidebar";

// Routes where Sidebar should be hidden
const hideSidebarRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password"
];

const MainLayout = ({ children }) => {
  const location = useLocation();
  const showSidebar = !hideSidebarRoutes.includes(location.pathname);

  return (
    <Box>
      <Header />
      <Box display="flex">
        {showSidebar && <Sidebar />}
        <Box flex="1" ml={showSidebar ? "240px" : "0"} pt="80px" px={6}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
