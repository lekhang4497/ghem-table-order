import React from "react";
import "./App.css";
import { createTheme, ThemeProvider } from "@mui/material";
import TableOrderRoute from "./routes/TableOrderRoute";

const theme = createTheme({
  typography: {
    fontFamily: '"Open Sans", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  palette: {
    primary: {
      light: "#ff8a50",
      main: "#ff5722",
      dark: "#c41c00",
      contrastText: "#fafafa",
    },
    secondary: {
      light: "#66ffa6",
      main: "#00e676",
      dark: "#00b248",
      contrastText: "#000000",
    },
  },
  components: {
    MuiAppBar: {
      defaultProps: {
        // color: "transparent",
        // elevation: 0,
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 10,
          padding: "15px 20px",
          fontWeight: 600,
          fontSize: 14,
          lineHeight: "16px",
        },
      },
      defaultProps: {
        disableElevation: true,
      },
    },
  },
});

const App = () => (
  <ThemeProvider theme={theme}>
    <TableOrderRoute />
  </ThemeProvider>
);

export default App;
