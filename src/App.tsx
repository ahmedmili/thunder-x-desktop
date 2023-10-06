import { CssBaseline } from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import { Suspense, lazy, useCallback, useEffect, useState } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Layout from "./components/layout/layout";

import { useAppDispatch, useAppSelector } from "./Redux/store";

import {
  setIsDelivery
} from "./Redux/slices/homeDataSlice";

import jwt_decode from "jwt-decode";
import {
  setCartItems,
  setDeliveryPrice,
  setSupplier,
} from "./Redux/slices/cart/cartSlice";
import { fetchHomeData } from "./Redux/slices/home";
import { addMessangerSuccess } from "./Redux/slices/messanger";
import { setRestaurants } from "./Redux/slices/restaurantSlice";
import { login, logout, setUser } from "./Redux/slices/userSlice";
import "./app.scss";
import Header from "./components/Header/Header";
import Footer from "./components/footer/footer";
import Annonces from "./components/layout/Profile/All_Annonces/All_Annonces";
import ArchivedCommands from "./components/layout/Profile/Archivedcommands/ArchivedCommands";
import ConfigPage from "./components/layout/Profile/ConfigPage/ConfigPage";
import Discuter from "./components/layout/Profile/Discuter/Discuter";
import Favors from "./components/layout/Profile/Favors/Favors";
import FidelitePage from "./components/layout/Profile/FidelitePage/FidelitePage";
import Profile from "./components/layout/Profile/Profile";
import Menu from "./components/menus/menus";
import { LocationService } from "./services/api/Location.api";
import { supplierServices } from "./services/api/suppliers.api";
import { userService } from "./services/api/user.api";
import { localStorageService } from "./services/localStorageService";
import eventEmitter from "./services/thunderEventsService";
import { Message, Restaurant } from "./services/types";
import channelListener from "./services/web-socket";
import FilterPage from "./views/filtre/FilterPage";
import HomeSkeleton from "./views/home/skeleton/HomeSkeleton";

//lazy loading
const HomePage = lazy(() => import("./views/home/home.page"));
const LoginPage = lazy(() => import("./views/login/login.page"));
const RegisterPage = lazy(() => import("./views/RegisterPage"));
const ProfilePage = lazy(() => import("./views/profile/profile.page"));
const UnauthorizePage = lazy(
  () => import("./views/unauthorize/unauthorize.page")
);
const CartPage = lazy(() => import("./views/cart/cart.page"));
const OrderTrackingPage = lazy(() => import("./views/track/trackorder.page"));
const ConfirmNumberPage = lazy(() => import("./views/ConfirmNumberPage"));
const WelcomePage = lazy(() => import("./views/WelcomePage"));
const ForgotPasswordPage = lazy(() => import("./views/ForgotPasswordPage"));

type Position = {
  coords: {
    latitude: number;
    longitude: number;
  };
};
function App() {
  const dispatch = useAppDispatch();

  var favorsList: number[] = [];
  const location = useAppSelector((state) => state.location.position);
  const deliv = useAppSelector((state) => state.homeData.isDelivery);
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

  const getClientFavors = async () => {
    const { status, data } = await userService.getClientFavorits()
    var favs: any = []
    data.success && data.data.map((i: Restaurant) => {
      favs.push(i.id)
    })
    favorsList = favs
  }

  const getSupplierData = async () => {
    const { status, data } = await supplierServices.all_annonces();
    if (status === 200) {
      var suppliersList: Restaurant[] = [];
      let dataList = data.data;
      dataList.map((resto: any, index: number) => {
        if (resto.supplier) {
          let rest = resto.supplier;
          if (favorsList.includes(rest.id)) {
            rest.favor = true;
          } else {
            rest.favor = false;
          }
          suppliersList.push(rest);
        }
      });
      dispatch(setRestaurants(suppliersList));
    }
  };

  useEffect(() => {
    let isLoggedIn = localStorageService.getUserToken();
    isLoggedIn?.length! > 0 && getClientFavors();
    isLoggedIn?.length! > 0 && getSupplierData();
  }, [updateTrigger]);

  // get home data 

  useEffect(() => {
    const current_location = localStorageService.getCurrentLocation();
    if (current_location) {
      dispatch({
        type: "SET_LOCATION",
        payload: JSON.parse(current_location),
      });
    }
    if (location?.coords) {
      dispatch(
        fetchHomeData(deliv == true ? 0 : 1, location?.coords.longitude, location?.coords.latitude)
      );
      let isLoggedIn = localStorageService.getUserToken();
      isLoggedIn?.length! > 0 && getSupplierData();
    }
  }, [deliv, location?.coords?.latitude]);

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

  // prepare default location 
  useEffect(() => {
    const location = localStorageService.getCurrentLocation();
    if (!location) {
      navigator.geolocation.getCurrentPosition(
        (position: Position) => {
          const { latitude, longitude } = position.coords;
          LocationService.geoCode(latitude, longitude).then(data => {
            dispatch({
              type: "SET_LOCATION",
              payload: {
                ...data
              },
            });
          });
        },
        (error: GeolocationPositionError) => {
          toast.error(error.message)
        }
      );
    }
  }, []);

  useEffect(() => {
    const deliv = localStorageService.getDelivery();

    !deliv && (() => {
      localStorageService.setDelivery(0);
    })
    deliv == "0" ? dispatch(setIsDelivery(true)) : dispatch(setIsDelivery(false));

  }, []);

  // check auth
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
  }, [])

  // handle recive admin message
  const newMessage = async (message: Message) => {
    dispatch(addMessangerSuccess(message))
  }
  // webSocket create instance
  useEffect(() => {
    channelListener()
    eventEmitter.on('NEW_ADMIN_MESSAGE', newMessage);
    return () => {
      eventEmitter.off('NEW_ADMIN_MESSAGE', newMessage);
    }
  }, [])



  const theme = useAppSelector((state) => state.home.theme)
  const [template, setTemplate] = useState<number>(theme)
  useEffect(() => {
    setTemplate(theme)
  }, [theme])

  return (
    <div className={`${template === 1 && "dark-background"}`}>
      <CssBaseline />
      <ToastContainer />
      <Suspense fallback={
        <>
          <Header />
          <HomeSkeleton />
          <Footer />
        </>
        // <CircularProgress style={{ alignSelf: "center" }} />
      }>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="/supplier-store/:id/*" element={<Menu />} />
            {/* <Route path="/product" element={<MenuOptions />} /> */}
            <Route path="/cart" element={<CartPage />} />
            <Route path="/search" element={<FilterPage />} />
            {/* Private Route */}
            <Route path="track-order" element={<OrderTrackingPage />} />
          </Route>
          <Route element={<ProtectedRoute children={undefined} />}>
            <Route path="/profile" element={<Profile />}>
              <Route index element={<ConfigPage />} />
              <Route path="/profile/annonces" element={<Annonces />} />
              <Route path="/profile/archivedCommands" element={<ArchivedCommands />} />
              <Route path="/profile/discuter" element={<Discuter />} />
              <Route path="/profile/Favors" element={<Favors />} />
              <Route path="/profile/Fidelite" element={<FidelitePage />} />
            </Route>
          </Route>

          <Route path="unauthorized" element={<UnauthorizePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="confirm" element={<ConfirmNumberPage />} />
          <Route path="welcome" element={<WelcomePage />} />
          <Route path="forgotpassword" element={<ForgotPasswordPage />} />
        </Routes>
      </Suspense>
    </div>
  );
}

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
  const [passable, setPassable] = useState<boolean>(true)

  useEffect(() => {
    setPassable(isAuthenticated)
  }, [isAuthenticated])

  if (!passable) {
    return <Navigate to="/unauthorized" replace />;
  } else {
    return children ? <>{children}</> : <Outlet />;
  }
}

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
