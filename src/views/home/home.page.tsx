import React from "react";
import "react-loading-skeleton/dist/skeleton.css";
import { FooterNewsLeter } from "../../components/footerNewsLeter/FooterNewsLetter";
import { Ads, AppProps, Restaurant } from "../../services/types";
import homeStyle from "./home.page.module.scss";


// import "laravel-echo/dist/echo";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import {
  adsHomeSelector,
  homeLoadingSelector
} from "../../Redux/slices/home";
import { handleMessanger } from "../../Redux/slices/messanger";
import { useAppSelector } from "../../Redux/store";
import MessangerBtnIcon from '../../assets/profile/Discuter/messanger-btn.svg';
import HomPageAds from "../../components/HomPageAds/HomPageAds";
import Messanger from "../../components/Popups/Messanger/Messanger";
import SpinnerPopup from "../../components/Popups/Spinner/SpinnerPopup";
import { JoinUs } from "../../components/joinUs/joinUs";
import { OrderTracking } from "../../components/order-tracking/orderTracking";
import ProductCarousel from "../../components/productCarousel/productCarousel";
import { supplierServices } from "../../services/api/suppliers.api";
import { localStorageService } from "../../services/localStorageService";
import { checkSsr } from "../../utils/utils";
import HomeSkeleton from "./skeleton/HomeSkeleton";


interface homePageAds {
  HOME_1: Ads[],
  HOME_2: Ads[],
  HOME_3: Ads[],
}

const HomePage = ({ initialData }: AppProps) => {

  const dispatch = useDispatch()

  const [suppliers, setSuppliers] = useState<Restaurant[]>([])
  const [homeAds, setHomeAds] = useState<homePageAds>()
  const ads = initialData ? initialData.ads : useSelector(adsHomeSelector);
  const categories = initialData ? initialData.categories : [];
  const isLoading = initialData ? false : useSelector(homeLoadingSelector);
  const [ssrLoading, setSsrLoading] = useState<boolean>(true)

  const unReadMessages = initialData ? 0 : useAppSelector((state) => state.messanger.unReadedMessages)
  const isMessagesOpen = useAppSelector((state) => state.messanger.isOpen)

  const locationState = useAppSelector((state) => state.location.position)
  const [unReadedQt, setUnReadedQt] = useState<number>(unReadMessages)
  const isLoggedIn = localStorageService.getUserToken()
  const navigate = useNavigate()

  useEffect(() => {
    setUnReadedQt(unReadMessages)
  }, [unReadMessages])

  const handleMessangerPopup = () => {
    dispatch(handleMessanger())

  }
  useEffect(() => {
    const location = localStorageService.getCurrentLocation()
    location && navigate('/search/', { replace: true })

  }, [locationState])

  const handleSsr = () => {
    let isSsr = checkSsr()
    setSsrLoading(isSsr)
    setTimeout(() => {
      let currentLocation = localStorageService.getCurrentLocation()
      let isSsr = checkSsr()
      if (isSsr) {
        setSsrLoading(true)
      } else {
        if (currentLocation) {
          navigate('/search/', { replace: true })
        } else {
        }
        setSsrLoading(false)
      }
    }, 1000 * 3)
  }


  useEffect(() => {
    handleSsr()
  }, [])

  const getSuppliers = async () => {

    const { status, data } = await supplierServices.getSuppliersAndAds()
    data.success && setSuppliers(data.data.suppliers)
    data.success && setHomeAds(data.data.ads)

  }

  useEffect(() => {
    getSuppliers()
  }, [])
  return (
    <>
      <div className="slider-area product-carousel">
        <ProductCarousel
          suppliers={suppliers}
        />
      </div>

      <div className={`xxl-12 ${homeStyle.homePageContainer}`}>
        {isLoading ? (
          <div className={homeStyle.homeSkeletonContainer}>

            <HomeSkeleton />
          </div>
        ) : (
          <>
            {
              homeAds && homeAds.HOME_2 && <HomPageAds homeAds={homeAds!.HOME_2} />
            }
            {
              (isLoggedIn) && (
                <div className={homeStyle.bulles}>
                  <button className={homeStyle.messangerPopupBtn} onClick={handleMessangerPopup} style={{ backgroundImage: `url(${MessangerBtnIcon})` }}>
                    {unReadedQt > 0 && initialData && (
                      <div className={homeStyle.messangerBullNotifIcon}>
                        {unReadedQt}
                      </div>
                    )}
                  </button>
                </div>
              )
            }

            {
              (isMessagesOpen && isLoggedIn) &&
              <Messanger className={homeStyle.discuterMessangerPopup} close={handleMessangerPopup} />
            }

          </>
        )}
      </div>

      <OrderTracking />
      <JoinUs />
      <FooterNewsLeter />
      {
        ssrLoading && <SpinnerPopup />
      }
    </>


  );
};

export default React.memo(HomePage);
