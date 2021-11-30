import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import TableOrderLayout from "../layout/TableOrderLayout";
import Welcome from "../App/Welcome";
import Manage from "../App/Manage";

const TableOrderRoute = () => (
  <HashRouter>
    <Routes>
      <Route path="/" element={<TableOrderLayout />}>
        <Route path="dine-in/:tableId" element={<Welcome />} />
        <Route path="manage" element={<Manage />} />
      </Route>
    </Routes>
  </HashRouter>
);

export default TableOrderRoute;
