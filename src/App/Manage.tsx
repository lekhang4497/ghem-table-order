import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Collapse,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
// import { DishInfo } from "../dishes";
import { getDineInOrder, changeOrderStatus } from "../api/DineInOrderApi";

interface DishItem {
  id: number;
  name: string;
  englishName: string;
  price: number;
  code: string;
  type: string;
}
interface OrderInfo {
  id: number;
  tableName: string;
  createdDate?: string;
  status?: string;
  items: {
    id?: number;
    dish: DishItem;
    quantity: number;
  }[];
}

// eslint-disable-next-line react/no-unused-prop-types
function Row(props: { order: OrderInfo; onChange: any }) {
  const { order, onChange } = props;
  const [open, setOpen] = React.useState(false);

  async function handleChangeStatusOrder(orderId: number, status: string) {
    await changeOrderStatus(orderId, status);
    onChange();
  }

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {/* eslint-disable-next-line react/destructuring-assignment */}
          {order.id}
        </TableCell>
        <TableCell align="right">{order.tableName}</TableCell>
        <TableCell align="right">
          <Chip
            label={order.status}
            color={order.status === "COMPLETED" ? "success" : "default"}
          />
        </TableCell>
        <TableCell align="center">
          {order.status !== "COMPLETED" ? (
            <Button
              variant="outlined"
              onClick={() => handleChangeStatusOrder(order.id, "complete")}
            >
              Complete
            </Button>
          ) : (
            <Button
              onClick={() => handleChangeStatusOrder(order.id, "created")}
            >
              Incomplete
            </Button>
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Order
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Quantity</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell component="th" scope="row">
                        {item.dish.name}
                      </TableCell>
                      <TableCell>{item.quantity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

const Manage = () => {
  const [orders, setOrders] = useState<OrderInfo[]>([]);
  async function fetchOrders() {
    const fetchedOrder = await getDineInOrder();
    setOrders(fetchedOrder);
  }
  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>ID</TableCell>
              <TableCell align="right">Table name</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <Row
                key={order.id}
                order={order}
                onChange={() => fetchOrders()}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Manage;
