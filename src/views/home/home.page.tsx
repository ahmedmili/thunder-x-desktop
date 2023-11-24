import "laravel-echo/dist/echo";
import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { AdsCarousel } from "../../components/adsCarousel/adsCarousel";
import { ApplicationAd } from "../../components/applicationAd/ApplicationAd";
import { FooterNewsLeter } from "../../components/footerNewsLeter/FooterNewsLetter";
import RestaurantList from "../../components/recommendedRestaurants/recommendedRestaurants";
import { Restaurant } from "../../services/types";
import homeStyle from "./home.page.module.scss";


import "laravel-echo/dist/echo";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  adsHomeSelector,
  categoriesHomeSelector,
  homeLoadingSelector,
  recommendedHomeSelector,
} from "../../Redux/slices/home";
import { useAppSelector } from "../../Redux/store";
import CategoryCarousel from "../../components/categoriesCarousel/categoriesCarousel";
import HomeSkeleton from "./skeleton/HomeSkeleton";
import Messanger from "../../components/Popups/Messanger/Messanger";
import MessangerBtnIcon from '../../assets/profile/Discuter/messanger-btn.svg';

const HomePage = () => {

  const ads = useSelector(adsHomeSelector);
  const categories = useSelector(categoriesHomeSelector);
  const recommanded = useSelector(recommendedHomeSelector);
  const isLoading = useSelector(homeLoadingSelector);
  const [messangerPopup, setMessangerPopup] = useState<boolean>(false)

  const restaurantsList = useAppSelector(
    (state) => state.restaurant.restaurants
  );

  const unReadMessages = useAppSelector((state) => state.messanger.unReadedMessages)
  const [unReadedQt, setUnReadedQt] = useState<number>(unReadMessages)

  useEffect(() => {
    setUnReadedQt(unReadMessages)
  }, [unReadMessages])

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>(
    []
  );



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
    console.log('open messanger')
    setMessangerPopup(!messangerPopup)
  }

  useEffect(() => {
    handleCategorySelect("");
  }, []);


  return (
    <>

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
                {unReadedQt > 0 && (
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
      <FooterNewsLeter />
    </>
  );
};

export default React.memo(HomePage);
