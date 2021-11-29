import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import TableOrderLayout from "../layout/TableOrderLayout";
import Welcome from "../App/Welcome";

const TableOrderRoute = () => (
  <HashRouter>
    <Routes>
      <Route path="/" element={<TableOrderLayout />}>
        <Route path="dine-in/:tableId" element={<Welcome />} />
      </Route>
    </Routes>
  </HashRouter>
);

export default TableOrderRoute;
