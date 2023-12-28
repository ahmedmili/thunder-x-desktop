// import "laravel-echo/dist/echo";
import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { AdsCarousel } from "../../components/adsCarousel/adsCarousel";
import { ApplicationAd } from "../../components/applicationAd/ApplicationAd";
import { FooterNewsLeter } from "../../components/footerNewsLeter/FooterNewsLetter";
import RestaurantList from "../../components/recommendedRestaurants/recommendedRestaurants";
import { AppProps, Restaurant } from "../../services/types";
import homeStyle from "./home.page.module.scss";


// import "laravel-echo/dist/echo";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  adsHomeSelector,
  categoriesHomeSelector,
  homeLoadingSelector,
  popularHomeSelector,
  recommendedHomeSelector,
} from "../../Redux/slices/home";
import { useAppSelector } from "../../Redux/store";
import MessangerBtnIcon from '../../assets/profile/Discuter/messanger-btn.svg';
import Messanger from "../../components/Popups/Messanger/Messanger";
import CategoryCarousel from "../../components/categoriesCarousel/categoriesCarousel";
import HomeSkeleton from "./skeleton/HomeSkeleton";
import ProductCarousel from "../../components/productCarousel/productCarousel";
import { OrderTracking } from "../../components/order-tracking/orderTracking";
import { JoinUs } from "../../components/joinUs/joinUs";



const HomePage = ({ initialData }: AppProps) => {


  const [messangerPopup, setMessangerPopup] = useState<boolean>(false)
  const ads = initialData ? initialData.ads : useSelector(adsHomeSelector);
  const categories = initialData ? initialData.categories : useSelector(categoriesHomeSelector);
  const recommanded = initialData ? initialData.recommended : useSelector(recommendedHomeSelector);
  const popular = initialData ? initialData.recommended : useSelector(popularHomeSelector);
  const isLoading = initialData ? false : useSelector(homeLoadingSelector);

  const unReadMessages = initialData ? 0 : useAppSelector((state) => state.messanger.unReadedMessages)
  const [unReadedQt, setUnReadedQt] = useState<number>(unReadMessages)

  useEffect(() => {
    setUnReadedQt(unReadMessages)
  }, [unReadMessages])

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);

  const handleCategorySelect = (category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory("");
      setFilteredRestaurants(filteredRestaurants.length > 0 ? filteredRestaurants : recommanded);
    } else {
      setSelectedCategory(category);
      const filteredRestaurants = recommanded.filter(
        (restaurant: Restaurant) => {
          //filter by categorie
          const isInCategory =
            restaurant.parents_cat
              .map((cat: any) => cat.name.toLowerCase())
              .includes(category.toLowerCase()) || category === "";

          const isInSousCategory =
            restaurant.children_cat
              .map((cat: any) => cat.name.toLowerCase())
              .includes(category.toLowerCase()) || category === "";
          return (
            isInCategory || isInSousCategory
          );
        }
      );
      setFilteredRestaurants(filteredRestaurants.length > 0 ? filteredRestaurants : []);
    }
  };
  const handleMessangerPopup = () => {
    setMessangerPopup(!messangerPopup)
  }

  useEffect(() => {
    handleCategorySelect("");
  }, []);


  return (
    <>

      <div className="slider-area product-carousel">
        <ProductCarousel
          ssrCategories={categories}
          onCategorySelect={handleCategorySelect}
        />
      </div>

      <div className={`xxl-12 ${homeStyle.homePageContainer}`}>
        {isLoading ? (
          <div className={homeStyle.homeSkeletonContainer}>

            <HomeSkeleton />
          </div>
        ) : (
          <>
            {/* categories list */}
            {categories ? (
              <CategoryCarousel
                ssrCategories={categories}
                onCategorySelect={handleCategorySelect}
              />
            ) : (
              <div className={homeStyle.homePageContainer}>
                <Skeleton count={12} className="loading-skeleton" />
                <Skeleton count={12} className="loading-skeleton" />
                <Skeleton count={12} className="loading-skeleton" />
              </div>
            )}

            {!isLoading && ads && ads.HOME_1 && (
              <AdsCarousel data={ads.HOME_1} />
            )}
            {/* promo list */}
            {recommanded.length > 0 ? (
              <div className="home-resto-container">
                <RestaurantList
                  listType="discount"
                  restaurants={recommanded}
                />
              </div>
            ) : (
              <></>
            )}
            <br></br>
            {popular.length > 0 ? (
              <div className={`home-resto-container ${homeStyle.popularRestos}`}>
                <RestaurantList
                  listType="popular"
                  restaurants={popular}
                />
              </div>
            ) : (
              <></>
            )}


            <ApplicationAd />

            {!isLoading && ads && ads.HOME_2 && (
              <AdsCarousel data={ads.HOME_2} />
            )}

            {/* recommanded list */}
            {recommanded ? (
              <div className="home-resto-container">
                <RestaurantList
                  listType="recommanded"
                  restaurants={recommanded}
                />
              </div>
            ) : (
              <></>
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
              {/* <button className='phone-popup-btn' onClick={handlePhonePopup} style={{ backgroundImage: `url(${PhoneBtnIcon})` }}></button> */}
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
