import React, { useEffect, useState } from "react";
import {
  Alert,
  AppBar,
  // Avatar,
  Box,
  Button,
  ButtonBase,
  Card,
  CardMedia,
  Collapse,
  // ButtonGroup,
  // Button,
  Container,
  // Divider,
  Drawer,
  Grid,
  IconButton,
  // Grid,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  List,
  ListItem,
  // ListItemAvatar,
  ListItemText,
  // Paper,
  // ListSubheader,
  Stack,
  styled,
  // Modal,
  Tab,
  Tabs,
  Toolbar,
  Typography,
  // Paper,
} from "@mui/material";
import RestaurantIcon from "@mui/icons-material/Restaurant";
// import SendIcon from "@mui/icons-material/Send";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { useParams } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
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

const ImageButton = styled(ButtonBase)(() => ({
  position: "relative",
  height: 100,
  borderRadius: 10,
  overflow: "hidden",
  "&:hover, &.Mui-focusVisible": {
    zIndex: 1,
    "& .MuiImageBackdrop-root": {
      opacity: 0.15,
    },
    "& .MuiImageMarked-root": {
      opacity: 0,
    },
    "& .MuiTypography-root": {
      border: "4px solid currentColor",
    },
  },
}));

const ImageSrc = styled("span")({
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundSize: "cover",
  backgroundPosition: "center 40%",
});

// const Image = styled("span")(({ theme }) => ({
//   position: "absolute",
//   left: 0,
//   right: 0,
//   top: 0,
//   bottom: 0,
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   color: theme.palette.common.white,
// }));
//
// const ImageBackdrop = styled("span")(({ theme }) => ({
//   position: "absolute",
//   left: 0,
//   right: 0,
//   top: 0,
//   bottom: 0,
//   backgroundColor: theme.palette.common.black,
//   opacity: 0.4,
//   transition: theme.transitions.create("opacity"),
// }));

export interface OrderItem {
  dish: DishInfo;
  number: number;
}

const Welcome = () => {
  const { tableId } = useParams();
  const [dishes, setDishes] = useState<DishInfo[]>([]);
  const [isSubmitting, setIsSubmiting] = useState(false);
  // const [orderId, setOrderId] = useState<number | null>(null);
  const [dishTypes, setDishTypes] = useState<DishTypeInfo[]>([]);
  const [dishModalOpen, setDishModalOpen] = useState(false);
  const [dishInModal, setDishInModal] = useState<DishInfo>(UNKNOWN_DISH_INFO);
  const [currentOrder, setCurrentOrder] = useState<OrderItem[]>([]);
  const [orderDrawerOpen, setOrderDrawerOpen] = useState(false);
  const [orderResult, setOrderResult] = useState<{
    success: boolean;
    orderId?: number;
    display: boolean;
  }>({
    success: false,
    display: false,
  });
  // setDishInModal(dishInModal);
  const [currentType, setCurrentType] = useState("unknown");
  async function fetchDishes() {
    const fetchedDishes = await getAllDishInfo();
    setDishes(fetchedDishes);
    const fetchedTypes = await getAllDishType();
    setCurrentType(fetchedTypes[3].value);
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
        // setOrderId(response.orderId);
        setCurrentOrder([]);
        setOrderResult({
          success: true,
          display: true,
          orderId: response.orderId,
        });
      } else {
        // setOrderId(-1);
        setOrderResult({
          success: true,
          display: true,
          orderId: response.orderId,
        });
      }
    } catch (ex) {
      setOrderResult({
        success: false,
        display: true,
      });
    } finally {
      setIsSubmiting(false);
      setOrderDrawerOpen(false);
    }
  }
  const orderResultAction = (
    <IconButton
      aria-label="close"
      color="inherit"
      size="small"
      onClick={() => {
        setOrderResult({ ...orderResult, display: false });
      }}
    >
      <CloseIcon fontSize="inherit" />
    </IconButton>
  );

  const orderDishCount = currentOrder.reduce(
    (sum, order) => sum + order.number,
    0
  );
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
      {/* {orderId === -1 ? ( */}
      {/*  <Alert severity="error">Lỗi đặt món, vui lòng liên hệ nhân viên.</Alert> */}
      {/* ) : null} */}
      {/* {orderId && orderId !== -1 ? ( */}
      {/*  <Alert severity="success"> */}
      {/*    Đặt món thành công! Mã đặt món: {orderId}. Ghém đã nhận được order của */}
      {/*    quý khách và bếp đang chuẩn bị. Xin cảm ơn. */}
      {/*  </Alert> */}
      {/* ) : null} */}

      {/* <Box sx={{ mb: 2 }}> */}
      {/*  <img */}
      {/*    width="100%" */}
      {/*    src={`${process.env.PUBLIC_URL}/img/banner/check-in.jpg`} */}
      {/*    alt="Check in on FB to get 10% discount" */}
      {/*  /> */}
      {/* </Box> */}
      <Container maxWidth="sm">
        <Collapse in={orderResult.display}>
          <Box sx={{ mt: 2 }}>
            {orderResult.success ? (
              <Alert severity="success" action={orderResultAction}>
                Đặt món thành công! Mã đặt món: {orderResult.orderId}. Ghém đã
                nhận được order của quý khách và bếp đang chuẩn bị. Xin cảm ơn.
              </Alert>
            ) : (
              <Alert severity="error" action={orderResultAction}>
                Lỗi đặt món, vui lòng liên hệ nhân viên.
              </Alert>
            )}
          </Box>
        </Collapse>
        <Box sx={{ mt: 2, mb: 2 }}>
          <ImageButton
            focusRipple
            style={{
              width: "100%",
            }}
          >
            <ImageSrc
              style={{
                backgroundImage: `url(${process.env.PUBLIC_URL}/img/banner/check-in.jpg)`,
              }}
            />
            {/* <ImageBackdrop className="MuiImageBackdrop-root" /> */}
          </ImageButton>
        </Box>
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
        {/* {currentOrder.length !== 0 ? (

        ) : null} */}
        {/* <Box sx={{ mb: 2 }}> */}
        {/*  <Divider>MENU</Divider> */}
        {/* </Box> */}
        <Box sx={{ mb: 3, borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={currentType}
            onChange={handleTypeChange}
            variant="scrollable"
            scrollButtons
            allowScrollButtonsMobile
            aria-label="scrollable auto tabs example"
          >
            {dishTypes.map((item) => (
              <Tab
                sx={{ textTransform: "none" }}
                key={item.value}
                value={item.value}
                label={item.name}
              />
            ))}
          </Tabs>
        </Box>
        {/* <Box sx={{ mt: 2, mb: 2 }}> */}
        {/*  <Stack */}
        {/*    direction="row" */}
        {/*    spacing={2} */}
        {/*    overflow="scroll" */}
        {/*    sx={{ */}
        {/*      "::-webkit-scrollbar": { */}
        {/*        display: "none", */}
        {/*      }, */}
        {/*    }} */}
        {/*  > */}
        {/*    {dishTypes.map((item) => ( */}
        {/*      <ImageButton */}
        {/*        focusRipple */}
        {/*        key={item.name} */}
        {/*        style={{ */}
        {/*          height: "48px", */}
        {/*          flex: "0 0 96px", */}
        {/*        }} */}
        {/*      > */}
        {/*        <ImageSrc */}
        {/*          style={{ */}
        {/*            backgroundImage: `url(${process.env.PUBLIC_URL}/img/dishes/${item.value}/avatar.jpg)`, */}
        {/*          }} */}
        {/*        /> */}
        {/*        <ImageBackdrop className="MuiImageBackdrop-root" /> */}
        {/*        <Image> */}
        {/*          <Typography */}
        {/*            component="span" */}
        {/*            variant="subtitle1" */}
        {/*            color="inherit" */}
        {/*            sx={{ */}
        {/*              position: "relative", */}
        {/*              p: 4, */}
        {/*              pt: 2, */}
        {/*              pb: (theme) => `calc(${theme.spacing(1)} + 6px)`, */}
        {/*            }} */}
        {/*          > */}
        {/*            {item.name} */}
        {/*          </Typography> */}
        {/*        </Image> */}
        {/*      </ImageButton> */}
        {/*    ))} */}
        {/*  </Stack> */}
        {/* </Box> */}
        <ImageList cols={3}>
          {dishes
            .filter((item) => item.type === currentType)
            .map((item) => (
              <ImageListItem
                sx={{
                  borderColor: "divider",
                  borderWidth: 1,
                  borderStyle: "solid",
                }}
                key={item.id}
                onClick={() => handleDishClick(item)}
              >
                <Box>
                  <img
                    width="100%"
                    src={formatDishImg(item.image, item.type)}
                    alt={item.name}
                    loading="lazy"
                  />
                </Box>
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
          <Box sx={{ py: 3 }}>
            {/* <Box */}
            {/*  sx={{ */}
            {/*    bgcolor: "primary.main", */}
            {/*    height: 5, */}
            {/*    mb: 3, */}
            {/*  }} */}
            {/* /> */}
            <Container maxWidth="sm">
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  my: 2,
                }}
              >
                <Card sx={{ maxWidth: "60%" }} variant="outlined">
                  <CardMedia
                    component="img"
                    image={formatDishImg(dishInModal.image, dishInModal.type)}
                    alt="green iguana"
                  />
                </Card>
                {/* <Box */}
                {/*  sx={{ */}
                {/*    width: "60%", */}
                {/*    overflow: "hidden", */}
                {/*    borderRadius: 10, */}
                {/*    borderColor: "divider", */}
                {/*    borderWidth: 1, */}
                {/*    borderStyle: "solid", */}
                {/*  }} */}
                {/* > */}
                {/*  <img */}
                {/*    width="100%" */}
                {/*    src={formatDishImg(dishInModal.image, dishInModal.type)} */}
                {/*    alt="test" */}
                {/*    loading="lazy" */}
                {/*  /> */}
                {/* </Box> */}
              </Box>
              {/* <Typography variant="h5" sx={{ mt: 2 }} textAlign="center"> */}
              {/*  {dishInModal.name} */}
              {/* </Typography> */}

              {/* <Typography */}
              {/*  textAlign="center" */}
              {/*  id="modal-modal-description" */}
              {/*  sx={{ mt: 1 }} */}
              {/*  variant="h6" */}
              {/* > */}
              {/*  {formatVnd(dishInModal.price)} */}
              {/* </Typography> */}
              <Typography
                variant="h5"
                component="div"
                textAlign="center"
                fontWeight={700}
                gutterBottom
              >
                {dishInModal.name}
              </Typography>
              <Typography
                // variant="h6"
                fontWeight={600}
                fontSize="1.2rem"
                color="text.secondary"
                textAlign="center"
              >
                {formatVnd(dishInModal.price)}
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={6}>
                  <Button fullWidth onClick={() => setDishModalOpen(false)}>
                    Quay lại
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    onClick={() => handleAddDish(dishInModal)}
                    variant="contained"
                  >
                    Thêm vào order
                  </Button>
                </Grid>
              </Grid>
              {/* <ButtonGroup */}
              {/*  sx={{ mt: 2 }} */}
              {/*  disableElevation */}
              {/*  fullWidth */}
              {/*  variant="contained" */}
              {/*  aria-label="outlined primary button group" */}
              {/* > */}
              {/*  <Button */}
              {/*    onClick={() => setDishModalOpen(false)} */}
              {/*    variant="outlined" */}
              {/*  > */}
              {/*    Quay lại */}
              {/*  </Button> */}
              {/*  <Button onClick={() => handleAddDish(dishInModal)}> */}
              {/*    Thêm vào order */}
              {/*  </Button> */}
              {/* </ButtonGroup> */}
            </Container>
          </Box>
        </Drawer>
        {currentOrder.length > 0 && (
          <AppBar
            position="fixed"
            color="primary"
            sx={{ top: "auto", bottom: 0 }}
            onClick={() => setOrderDrawerOpen(true)}
          >
            <Toolbar>
              <IconButton color="inherit" aria-label="open drawer">
                <RestaurantIcon />
              </IconButton>
              <Typography
                variant="h6"
                component="div"
                sx={{ flexGrow: 1, ml: 1 }}
              >
                Xem món đã đặt và order ({orderDishCount})
              </Typography>
            </Toolbar>
          </AppBar>
        )}
        <Drawer
          anchor="bottom"
          open={orderDrawerOpen}
          onClose={() => setOrderDrawerOpen(false)}
        >
          <Box sx={{ py: 3 }}>
            <Container maxWidth="sm">
              {/* <Box sx={{ mb: 2 }}> */}
              {/* <Box sx={{ mb: 2 }}> */}
              {/*  <Divider>MÓN ĐÃ CHỌN</Divider> */}
              {/* </Box> */}
              <Typography variant="h6" component="div" fontWeight={700}>
                Món đã đặt
              </Typography>
            </Container>
            <List>
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
                      <Box
                        sx={{
                          borderColor: "divider",
                          borderStyle: "solid",
                          borderWidth: 1,
                          fontSize: 14,
                          width: 24,
                          height: 24,
                          lineHeight: "24px",
                          textAlign: "center",
                        }}
                      >
                        {item.number}
                      </Box>
                      {/* <Avatar */}
                      {/*  sx={{ */}
                      {/*    bgcolor: "primary.main", */}
                      {/*    width: 28, */}
                      {/*    height: 28, */}
                      {/*    fontSize: 14, */}
                      {/*  }} */}
                      {/*  variant="rounded" */}
                      {/* > */}
                      {/*  {item.number} */}
                      {/* </Avatar> */}
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
            <Container maxWidth="sm">
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 2 }}
                disabled={isSubmitting}
                onClick={() => handleSubmitOrder()}
              >
                Gửi Order
              </Button>
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
