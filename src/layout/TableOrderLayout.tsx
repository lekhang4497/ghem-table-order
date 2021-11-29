import React from "react";
import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import { Outlet, useParams } from "react-router-dom";
import RestaurantIcon from "@mui/icons-material/Restaurant";

const TableOrderLayout = () => {
  const { tableId } = useParams();
  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <RestaurantIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Ghém Table {tableId}
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
      <Outlet />
    </div>
  );
};

export default TableOrderLayout;
