import React from "react";
import {
  AppBar,
  Box,
  // IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { Outlet, useParams } from "react-router-dom";
// import RestaurantIcon from "@mui/icons-material/Restaurant";

const TableOrderLayout = () => {
  const { tableId } = useParams();
  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="static"
          color="transparent"
          elevation={0}
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Toolbar>
            {/* <IconButton */}
            {/*  size="large" */}
            {/*  edge="start" */}
            {/*  color="inherit" */}
            {/*  aria-label="menu" */}
            {/*  sx={{ mr: 2 }} */}
            {/* > */}
            {/*  <RestaurantIcon /> */}
            {/* </IconButton> */}
            <img
              src={`${process.env.PUBLIC_URL}/img/logo_no_text.png`}
              alt="logo"
              style={{ maxHeight: 40 }}
            />

            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, ml: 1 }}
              fontWeight={300}
            >
              Table {tableId}
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
      <Outlet />
    </div>
  );
};

export default TableOrderLayout;
