import React from "react";
import "react-loading-skeleton/dist/skeleton.css";
import { AdsCarousel } from "../../components/adsCarousel/adsCarousel";
import { ApplicationAd } from "../../components/applicationAd/ApplicationAd";
import { FooterNewsLeter } from "../../components/footerNewsLeter/FooterNewsLetter";
import { AppProps } from "../../services/types";
import homeStyle from "./home.page.module.scss";


// import "laravel-echo/dist/echo";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  adsHomeSelector,
  homeLoadingSelector
} from "../../Redux/slices/home";
import { useAppSelector } from "../../Redux/store";
import MessangerBtnIcon from '../../assets/profile/Discuter/messanger-btn.svg';
import Messanger from "../../components/Popups/Messanger/Messanger";
import { OrderTracking } from "../../components/order-tracking/orderTracking";
import ProductCarousel from "../../components/productCarousel/productCarousel";
import HomeSkeleton from "./skeleton/HomeSkeleton";
import { JoinUs } from "../../components/joinUs/joinUs";
import CategoryCarousel from "../../components/categoriesCarousel/categoriesCarousel";
import Skeleton from "react-loading-skeleton";



const HomePage = ({ initialData }: AppProps) => {


  const [messangerPopup, setMessangerPopup] = useState<boolean>(false)
  const ads = initialData ? initialData.ads : useSelector(adsHomeSelector);
  const categories = initialData ? initialData.categories : [];
  const isLoading = initialData ? false : useSelector(homeLoadingSelector);

  const unReadMessages = initialData ? 0 : useAppSelector((state) => state.messanger.unReadedMessages)
  const [unReadedQt, setUnReadedQt] = useState<number>(unReadMessages)

  useEffect(() => {
    setUnReadedQt(unReadMessages)
  }, [unReadMessages])

  const handleMessangerPopup = () => {
    setMessangerPopup(!messangerPopup)
  }

  return (
    <>


      <div className={`xxl-12 ${homeStyle.homePageContainer}`}>
        {isLoading ? (
          <div className={homeStyle.homeSkeletonContainer}>

            <HomeSkeleton />
          </div>
        ) : (
          <>

            <div className="slider-area product-carousel">
              <ProductCarousel
                ssrCategories={categories}
                // onCategorySelect={handleCategorySelect}
                onCategorySelect={() => { }}
              />
            </div>


            {!isLoading && ads && ads.HOME_1 && (
              <AdsCarousel data={ads.HOME_1} />
            )}

            <ApplicationAd />

            {!isLoading && ads && ads.HOME_2 && (
              <AdsCarousel data={ads.HOME_2} />
            )}

            {!isLoading && ads && ads.HOME_3 && (
              <AdsCarousel data={ads.HOME_3} />
            )}

            <div className={homeStyle.bulles}>
              <button className={homeStyle.messangerPopupBtn} onClick={handleMessangerPopup} style={{ backgroundImage: `url(${MessangerBtnIcon})` }}>
                {unReadedQt > 0 && initialData && (
                  <div className={homeStyle.messangerBullNotifIcon}>
                    {unReadedQt}
                  </div>
                )}
              </button>
            </div>
            {
              messangerPopup &&
              <Messanger className={homeStyle.discuterMessangerPopup} close={handleMessangerPopup} />
            }


          </>
        )}
      </div>

      <OrderTracking />
      <JoinUs />
      <FooterNewsLeter />
    </>
  );
};

export default React.memo(HomePage);
