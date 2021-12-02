import React, { useEffect, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  ButtonGroup,
  // Button,
  Container,
  Divider,
  Drawer,
  IconButton,
  // Grid,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  List,
  ListItem,
  // ListItemAvatar,
  ListItemText,
  // ListSubheader,
  Stack,
  // Modal,
  Tab,
  Tabs,
  Typography,
  // Paper,
} from "@mui/material";
// import SendIcon from "@mui/icons-material/Send";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { useParams } from "react-router-dom";
import { DishInfo, DishTypeInfo, UNKNOWN_DISH_INFO } from "../dishes";
import { getAllDishInfo, getAllDishType } from "../services/DishServices";
import {
  createDineInOrder,
  DineInOrderRequest,
  OrderRequestItem,
} from "../api/DineInOrderApi";

const formatDishImg = (imgCode: string, dishType: string) =>
  `${process.env.PUBLIC_URL}/img/dishes/${dishType}/${imgCode}.jpg`;

const formatVnd = (amount: number) => `${amount.toLocaleString()} VND`;

const addOrderItem = (
  currentOrder: OrderItem[],
  addDish: DishInfo
): OrderItem[] => {
  const idx = currentOrder.findIndex((order) => order.dish.id === addDish.id);
  const newOrder = [...currentOrder];
  if (idx === -1) {
    newOrder.push({ dish: addDish, number: 1 });
  } else {
    newOrder[idx].number += 1;
  }
  return newOrder;
};

// const removeOrderItem = (
//   currentOrder: OrderItem[],
//   addDish: DishInfo
// ): OrderItem[] => {
//   const idx = currentOrder.findIndex((order) => order.dish.id === addDish.id);
//   const newOrder = [...currentOrder];
//   if (idx !== -1) {
//     newOrder[idx].number -= 1;
//     if (newOrder[idx].number === 0) {
//       newOrder.splice(idx, 1);
//     }
//   }
//   return currentOrder;
// };

export interface OrderItem {
  dish: DishInfo;
  number: number;
}

const Welcome = () => {
  const { tableId } = useParams();
  const [dishes, setDishes] = useState<DishInfo[]>([]);
  const [isSubmitting, setIsSubmiting] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [dishTypes, setDishTypes] = useState<DishTypeInfo[]>([]);
  const [dishModalOpen, setDishModalOpen] = useState(false);
  const [dishInModal, setDishInModal] = useState<DishInfo>(UNKNOWN_DISH_INFO);
  const [currentOrder, setCurrentOrder] = useState<OrderItem[]>([]);
  // setDishInModal(dishInModal);
  const [currentType, setCurrentType] = useState("unknown");
  async function fetchDishes() {
    const fetchedDishes = await getAllDishInfo();
    setDishes(fetchedDishes);
    const fetchedTypes = await getAllDishType();
    setCurrentType(fetchedTypes[0].value);
    setDishTypes(fetchedTypes);
  }
  const handleTypeChange = (_: React.SyntheticEvent, newType: string) => {
    setCurrentType(newType);
  };
  // eslint-disable-next-line no-unused-vars
  const handleDishClick = (dish: DishInfo) => {
    setDishModalOpen(true);
    setDishInModal(dish);
  };
  const handleDishModalClose = () => {
    setDishModalOpen(false);
    // setDishInModal(dish);
  };
  const handleAddDish = (dish: DishInfo) => {
    const newOrder = addOrderItem(currentOrder, dish);
    setCurrentOrder(newOrder);
    setDishModalOpen(false);
  };
  const handleIncreaseItemNumber = (itemIdx: number) => {
    const newOrder = [...currentOrder];
    newOrder[itemIdx].number += 1;
    setCurrentOrder(newOrder);
  };
  const handleDecreaseItemNumber = (itemIdx: number) => {
    const newOrder = [...currentOrder];
    newOrder[itemIdx].number -= 1;
    if (newOrder[itemIdx].number === 0) {
      newOrder.splice(itemIdx, 1);
    }
    setCurrentOrder(newOrder);
  };
  async function handleSubmitOrder() {
    const orderRequestItems: OrderRequestItem[] = currentOrder.map((item) => ({
      dishCode: item.dish.id,
      quantity: item.number,
    }));
    const request: DineInOrderRequest = {
      items: orderRequestItems,
      tableName: tableId || "0",
    };
    try {
      setIsSubmiting(true);
      const response = await createDineInOrder(request);
      if (response.code === 1) {
        setOrderId(response.orderId);
        setCurrentOrder([]);
      } else {
        setOrderId(-1);
      }
    } finally {
      setIsSubmiting(false);
    }
  }
  useEffect(() => {
    fetchDishes();
  }, []);
  return (
    <div>
      {tableId ? null : (
        <Alert severity="error">
          Số bàn không xác định, vui lòng liên hệ nhân viên.
        </Alert>
      )}
      {orderId === -1 ? (
        <Alert severity="error">Lỗi đặt món, vui lòng liên hệ nhân viên.</Alert>
      ) : null}
      {orderId && orderId !== -1 ? (
        <Alert severity="success">
          Đặt món thành công! Mã đặt món: {orderId}. Ghém đã nhận được order của
          quý khách và bếp đang chuẩn bị. Xin cảm ơn.
        </Alert>
      ) : null}
      <Box sx={{ mb: 2 }}>
        <img
          width="100%"
          src={`${process.env.PUBLIC_URL}/img/banner/check-in.jpg`}
          alt="Check in on FB to get 10% discount"
        />
      </Box>
      <Container maxWidth="sm">
        {/* <Box */}
        {/*  sx={{ */}
        {/*    display: "flex", */}
        {/*    justifyContent: "center", */}
        {/*    mb: 2, */}
        {/*    height: "10vh", */}
        {/*  }} */}
        {/* > */}
        {/*  <img */}
        {/*    src={`${process.env.PUBLIC_URL}/img/logo.png`} */}
        {/*    alt="logo" */}
        {/*    height="100%" */}
        {/*  /> */}
        {/* </Box> */}
        {currentOrder.length !== 0 ? (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ mb: 2 }}>
              <Divider>MÓN ĐÃ CHỌN</Divider>
            </Box>
            <List dense>
              {currentOrder.map((item, index) => (
                <ListItem
                  key={`${item.dish.id}-${item.number}`}
                  secondaryAction={
                    <Stack spacing={0.5} direction="row" alignItems="center">
                      <IconButton
                        edge="end"
                        color="error"
                        onClick={() => handleDecreaseItemNumber(index)}
                        sx={{ margin: 0 }}
                      >
                        <RemoveIcon />
                      </IconButton>
                      <Avatar
                        sx={{
                          bgcolor: "primary.main",
                          width: 28,
                          height: 28,
                          fontSize: 14,
                        }}
                        variant="rounded"
                      >
                        {item.number}
                      </Avatar>
                      <IconButton
                        edge="end"
                        color="success"
                        onClick={() => handleIncreaseItemNumber(index)}
                      >
                        <AddIcon />
                      </IconButton>
                    </Stack>
                  }
                >
                  {/* <ListItemAvatar> */}
                  {/*  <Avatar sx={{ bgcolor: "primary.main" }}> */}
                  {/*    {item.number} */}
                  {/*  </Avatar> */}
                  {/* </ListItemAvatar> */}
                  <ListItemText primary={item.dish.name} />
                </ListItem>
              ))}
            </List>
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 2 }}
              disabled={isSubmitting}
              onClick={() => handleSubmitOrder()}
            >
              Gửi Order
            </Button>
          </Box>
        ) : null}
        <Box sx={{ mb: 2 }}>
          <Divider>MENU</Divider>
        </Box>
        <Box sx={{ mb: 3 }}>
          <Tabs
            value={currentType}
            onChange={handleTypeChange}
            variant="scrollable"
            scrollButtons
            allowScrollButtonsMobile
            aria-label="scrollable auto tabs example"
          >
            {dishTypes.map((item) => (
              <Tab key={item.value} value={item.value} label={item.name} />
            ))}
          </Tabs>
        </Box>
        <ImageList cols={3}>
          {dishes
            .filter((item) => item.type === currentType)
            .map((item) => (
              <ImageListItem
                key={item.id}
                onClick={() => handleDishClick(item)}
              >
                <img
                  width="100%"
                  src={formatDishImg(item.image, item.type)}
                  alt={item.name}
                  loading="lazy"
                />
                <ImageListItemBar
                  title={item.name}
                  subtitle={formatVnd(item.price)}
                />
              </ImageListItem>
            ))}
        </ImageList>
        <Drawer
          anchor="bottom"
          open={dishModalOpen}
          onClose={handleDishModalClose}
        >
          <Box sx={{ py: 2 }}>
            <Container maxWidth="sm">
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "flex-start",
                }}
              >
                <img
                  width="60%"
                  src={formatDishImg(dishInModal.image, dishInModal.type)}
                  alt="test"
                  loading="lazy"
                />
              </Box>
              <Typography variant="h5" sx={{ mt: 2 }} textAlign="center">
                {dishInModal.name}
              </Typography>

              <Typography
                textAlign="center"
                id="modal-modal-description"
                sx={{ mt: 1 }}
                variant="h6"
              >
                {formatVnd(dishInModal.price)}
              </Typography>
              <ButtonGroup
                sx={{ mt: 2 }}
                disableElevation
                fullWidth
                variant="contained"
                aria-label="outlined primary button group"
              >
                <Button
                  onClick={() => setDishModalOpen(false)}
                  variant="outlined"
                >
                  Quay lại
                </Button>
                <Button onClick={() => handleAddDish(dishInModal)}>
                  Thêm vào order
                </Button>
              </ButtonGroup>
            </Container>
          </Box>
        </Drawer>
        {/* <Modal open={dishModalOpen} onClose={handleDishModalClose}> */}
        {/*  <Box> */}
        {/*    <Typography id="modal-modal-title" variant="h6" component="h2"> */}
        {/*      Text in a modal */}
        {/*    </Typography> */}
        {/*    <Typography id="modal-modal-description" sx={{ mt: 2 }}> */}
        {/*      Duis mollis, est non commodo luctus, nisi erat porttitor ligula. */}
        {/*    </Typography> */}
        {/*  </Box> */}
        {/* </Modal> */}
      </Container>
    </div>
  );
};

export default Welcome;
