import { CircularProgress, CssBaseline } from "@mui/material";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import Layout from "./components/layout/layout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAppDispatch, useAppSelector } from "./Redux/store";
import {
  selectIsDelivery,
  setData as setHomeData,
  setLoading as setHomeDataLoading,
} from "./Redux/slices/homeDataSlice";
import {
  setCartItems,
  setDeliveryPrice,
  setSupplier,
} from "./Redux/slices/cart/cartSlice";
import Menu from "./components/menus/menus";
import { setUser, login, logout } from "./Redux/slices/user/userSlice";
import jwt_decode from "jwt-decode";
import WebSocket from "./services/websocket";
import eventEmitter from "./services/thunderEventsService";
import "./app.scss";
import { localStorageService } from "./services/localStorageService";
import { homedataService } from "./services/api/homeData.api";

//lazy loading
const HomePage = lazy(() => import("./views/home/home.page"));
const LoginPage = lazy(() => import("./views/login/login.page"));
const RegisterPage = lazy(() => import("./views/register/register.page"));
const ProfilePage = lazy(() => import("./views/profile/profile.page"));
const UnauthorizePage = lazy(
  () => import("./views/unauthorize/unauthorize.page")
);
const CartPage = lazy(() => import("./views/cart/cart.page"));
const OrderTrackingPage = lazy(() => import("./views/track/trackorder.page"));
const ConfirmNumberPage = lazy(
  () => import("./views/confirmNumber/confirmNumber.page")
);

function App() {
  const location = useAppSelector((state) => state.location.position);
  const dispatch = useAppDispatch();
  const isDelivery = useAppSelector(selectIsDelivery);
  const [updateTrigger, setUpdateTrigger] = useState(false);
  const updateHomeData = useCallback(() => {
    setUpdateTrigger((prev) => !prev);
  }, []);

  useEffect(() => {
    eventEmitter.on("homeDataChanged", updateHomeData);

    return () => {
      eventEmitter.off("homeDataChanged", updateHomeData);
    };
  }, [updateHomeData]);
  useEffect(() => {
    getHomeData();
  }, [updateTrigger]);
  const getHomeData = async () => {
    const { status, data } = await homedataService.getHomeData(
      isDelivery,
      location?.coords.longitude,
      location?.coords.latitude
    );
    if (status === 200) {
      dispatch(setHomeDataLoading(false));
      dispatch(setHomeData(data.data));
    }
  };

  useEffect(() => {
    const current_location = localStorageService.getCurrentLocation();
    if (current_location) {
      dispatch({
        type: "SET_LOCATION",
        payload: JSON.parse(current_location),
      });
    }
    if (location?.coords) {
      getHomeData();
    }
  }, [location?.coords?.latitude]);

  useEffect(() => {
    let tmp_cart = localStorageService.getCart();
    if (tmp_cart !== null) {
      const cartItems = JSON.parse(localStorageService.getCart() || "[]");
      const supplier = JSON.parse(localStorageService.getSupplier() || "[]");
      dispatch(setCartItems(cartItems));
      dispatch(setSupplier(supplier));
      dispatch(setDeliveryPrice(supplier.delivery_price));
    }
  }, []);

  useEffect(() => {
    const token = localStorageService.getUserToken();
    const _isAuthenticated = verifyToken(JSON.stringify(token));

    if (token) {
      const decodedToken: any = jwt_decode(token);
      dispatch(setUser(decodedToken.user));
      dispatch(login(token));
    }
    if (!_isAuthenticated) {
      dispatch(logout());
    }
  }, []);

  useEffect(() => {
    const socket = WebSocket.getInstance();
  }, []);

  return (
    <>
      <CssBaseline />
      <ToastContainer />
      <Suspense fallback={<CircularProgress style={{ alignSelf: "center" }} />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="/supplier-store/:id/*" element={<Menu />} />
            <Route path="cart" element={<CartPage />} />

            {/* Private Route */}
            <Route path="track-order" element={<OrderTrackingPage />} />
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="unauthorized" element={<UnauthorizePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="confirm" element={<ConfirmNumberPage />} />
        </Routes>
      </Suspense>
    </>
  );
}

const ProtectedRoute = (children: any) => {
  const isAuthenticated = useAppSelector(
    (state) => state.userState.isAuthenticated
  );
  if (!isAuthenticated) {
    return <Navigate to="/unauthorized" replace />;
  }
  return children ? <>{children}</> : <Outlet />;
};

export const verifyToken = (token: string): boolean => {
  try {
    const decoded: { exp: number } = jwt_decode(token);
    if (decoded.exp < Date.now() / 1000) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
};

export default App;
