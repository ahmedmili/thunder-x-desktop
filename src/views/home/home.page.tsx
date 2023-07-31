import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import {
  selectHomeData,
  selectIsDelivery,
} from '../../Redux/slices/homeDataSlice';
import React from 'react';
import { Restaurant } from '../../services/types';
import RestaurantList from '../../components/recommendedRestaurants/recommendedRestaurants';
import 'laravel-echo/dist/echo';
import { distance } from '../../services/distance'
import './home.page.scss'
import { useDispatch } from 'react-redux';
import { AdsCarousel } from '../../components/adsCarousel/adsCarousel';
import { ApplicationAd } from '../../components/applicationAd/ApplicationAd';
import { FooterNewsLeter } from '../../components/footerNewsLeter/FooterNewsLetter';

// const googleMapKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
import {Container } from "@mui/material";


import {  useAppSelector } from "../../Redux/store";
import {useEffect, useState } from "react";
import CategoryCarousel from "../../components/categoriesCarousel/categoriesCarousel";
import { useTranslation } from "react-i18next";
import "laravel-echo/dist/echo";


const HomePage = () => {
  const dispatch = useDispatch();

  const { t } = useTranslation();
  // const location = useAppSelector((state) => state.location.position);
  const homeData = useAppSelector(selectHomeData);
  const restaurantsList = useAppSelector((state) => state.restaurant.restaurants);
  const isLoading = useAppSelector((state) => state.homeData.loading);
  const distanceFilter = useAppSelector((state) => state.restaurant.distanceFilter)
  const textFilter = useAppSelector((state) => state.restaurant.searchQuery)

  const isDelivery = useAppSelector(selectIsDelivery);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>(
    []
  );

  const handleCategorySelect = (category: string) => {
    if (selectedCategory === category) {
      // User clicked on the same category again, so show the restaurants that correspond to the state of isDelivery
      setSelectedCategory("");
      const filteredRestaurants = homeData?.recommended.filter(
        (restaurant: Restaurant) => {
          let restoLat = restaurant.lat
          let restoLong = restaurant.lat
          let dis = distance(restoLat, restoLong)
          const hasDelivery = isDelivery && restaurant.delivery === 1;
          const hasTakeAway = !isDelivery && restaurant.take_away === 1;
          const searchText = restaurant.name.toLowerCase().includes(textFilter.toLowerCase())
          return (hasDelivery || hasTakeAway) && (dis <= distanceFilter) && searchText;

        }

      );
      setFilteredRestaurants(filteredRestaurants ? filteredRestaurants : []);
    } else {
      setSelectedCategory(category);
      const filteredRestaurants = homeData?.today_offers.filter(
        (restaurant: Restaurant) => {
          const isInCategory =
            restaurant.parents_cat
              .map((cat: any) => cat.name.toLowerCase())
              .includes(category.toLowerCase()) || category === "";
          const hasDelivery = isDelivery && restaurant.delivery === 1;
          const hasTakeAway = !isDelivery && restaurant.take_away === 1;
          let restoLat = restaurant.lat;
          let restoLong = restaurant.lat;
          let dis = distance(restoLat, restoLong);
          const searchText = restaurant.name
            .toLowerCase()
            .includes(textFilter.toLowerCase());
          console.log(searchText);
          console.log(textFilter);
          return (
            isInCategory &&
            (hasDelivery || hasTakeAway) &&
            dis <= distanceFilter &&
            searchText
          );
        }
      );
      setFilteredRestaurants(filteredRestaurants ? filteredRestaurants : []);
    }
  };

  useEffect(() => {
    handleCategorySelect('');
    // console.log(homeData)
  }, [homeData?.today_offers, isDelivery, distanceFilter, textFilter]);

  return (
    <>

      <Container maxWidth='lg' className="containerr">
        {
          isLoading ? (
            <div className='skeleton-container'>
              <Skeleton count={12} className='loading-skeleton' />
              <Skeleton count={12} className='loading-skeleton' />
              <Skeleton count={12} className='loading-skeleton' />
            </div>
          ) : (
            <>

              {/* categories list */}
              {
                homeData?.categories ? (

                  <CategoryCarousel
                    onCategorySelect={handleCategorySelect}
                    categories={homeData?.categories} />
                ) : (
                  <div className='skeleton-container'>
                    <Skeleton count={12} className='loading-skeleton' />
                    <Skeleton count={12} className='loading-skeleton' />
                    <Skeleton count={12} className='loading-skeleton' />
                  </div>
                )
              }


              {!isLoading && homeData && homeData.ads.HOME_1 && (
                <AdsCarousel data={homeData.ads.HOME_1} />
              )
              }
              {/* promo list */}

              {
                restaurantsList.length > 0 ? (
                  <div className='home-resto-container' >
                    <RestaurantList listType='discount' restaurants={restaurantsList} />
                  </div>
                ) : (<></>)
              }

              <ApplicationAd />

              {!isLoading && homeData && homeData.ads.HOME_2 && (
                <AdsCarousel data={homeData.ads.HOME_2} />
              )
              }

              {/* recommanded list */}
              {
                homeData?.recommended ? (
                  <div className='home-resto-container' >
                    <RestaurantList listType='recommanded' restaurants={homeData?.recommended} />
                  </div>
                ) : (<></>
                )
              }

              {!isLoading && homeData && homeData.ads.HOME_3 && (
                <AdsCarousel data={homeData.ads.HOME_3} />
              )
              }
            </>
          )}
        </Container>
        <FooterNewsLeter />
      </>
      );
};

      export default React.memo(HomePage);
