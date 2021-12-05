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
// import { green } from "@mui/material/colors";
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

const COLOR_MAP: Record<
  string,
  "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"
> = {
  PROCESSING: "warning",
  CREATED: "default",
  COMPLETED: "success",
};

// const NEXT_STEP = {
//   PROCESSING: "COMPLETED",
//   CREATED: "PROCESSING",
// };
//
// const StepActionButton = (props: {
//   orderId: number;
//   step: string;
//   handleChangeStatusOrder: any;
// }) => {
//   const { orderId, step, handleChangeStatusOrder } = props;
//   if (step === "CREATED") {
//     return (
//       <Button
//         variant="outlined"
//         onClick={() => handleChangeStatusOrder(orderId, "processing")}
//       >
//         Đang Nấu
//       </Button>
//     );
//   }
//   if (step === "PROCESSING") {
//     return (
//       <Button
//         variant="outlined"
//         onClick={() => handleChangeStatusOrder(orderId, "completed")}
//       >
//         Hoàn Thành
//       </Button>
//     );
//   }
//   if (step === "COMPLETED") {
//     return (
//       <Button onClick={() => handleChangeStatusOrder(orderId, "created")}>
//         Tạo lại Order
//       </Button>
//     );
//   }
//   return <div>Không xác định</div>;
// };

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
            color={COLOR_MAP[order.status ? order.status : "processing"]}
          />
        </TableCell>
        <TableCell align="center">
          {/* eslint-disable-next-line no-nested-ternary */}
          {order.status === "COMPLETED" ? null : order.status === "CREATED" ? (
            <Button
              onClick={() => handleChangeStatusOrder(order.id, "processing")}
            >
              Bắt đầu nấu
            </Button>
          ) : (
            <Button
              onClick={() => handleChangeStatusOrder(order.id, "complete")}
            >
              Hoàn thành
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

const getStatusValue = (status: string | undefined) => {
  switch (status) {
    case "CREATED":
      return 1;
    case "PROCESSING":
      return 2;
    case "COMPLETED":
      return 3;
    default:
      return 0;
  }
};

const Manage = () => {
  const [orders, setOrders] = useState<OrderInfo[]>([]);
  async function fetchOrders() {
    const fetchedOrder: OrderInfo[] = await getDineInOrder();
    if (fetchedOrder) {
      fetchedOrder.sort(
        (a, b) => getStatusValue(a.status) - getStatusValue(b.status)
      );
    }
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
