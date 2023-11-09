// import "laravel-echo/dist/echo";
import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { AdsCarousel } from "../../components/adsCarousel/adsCarousel";
import { ApplicationAd } from "../../components/applicationAd/ApplicationAd";
import { FooterNewsLeter } from "../../components/footerNewsLeter/FooterNewsLetter";
import RestaurantList from "../../components/recommendedRestaurants/recommendedRestaurants";
import { Restaurant } from "../../services/types";
import "./home.page.module.scss";

// const googleMapKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
import { Container } from "@mui/material";

// import "laravel-echo/dist/echo";
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

const HomePage = () => {

  const ads = useSelector(adsHomeSelector);
  const categories = useSelector(categoriesHomeSelector);
  const recommanded = useSelector(recommendedHomeSelector);
  const isLoading = useSelector(homeLoadingSelector);
  const theme = useAppSelector((state) => state.home.theme)
  const [template, setTemplate] = useState<number>(theme)

  const restaurantsList = useAppSelector(
    (state) => state.restaurant.restaurants
  );

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>(
    []
  );

  useEffect(() => {
    setTemplate(theme)
  }, [theme])

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

  useEffect(() => {
    handleCategorySelect("");
  }, []);


  return (
    <>
      <Container  className={`containerr ${template === 1 && "dark-background"}`}>
        {isLoading ? (
          <HomeSkeleton />
        ) : (
          <>
            {/* categories list */}
            {categories ? (
              <CategoryCarousel
                onCategorySelect={handleCategorySelect}
              />
            ) : (
              <div className="skeleton-container">
                <Skeleton count={12} className="loading-skeleton" />
                <Skeleton count={12} className="loading-skeleton" />
                <Skeleton count={12} className="loading-skeleton" />
              </div>
            )}

            {!isLoading && ads && ads.HOME_1 && (
              <AdsCarousel data={ads.HOME_1} />
            )}
            {/* promo list */}

            {restaurantsList.length > 0 ? (
              <div className="home-resto-container">
                <RestaurantList
                  listType="discount"
                  restaurants={restaurantsList}
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
          </>
        )}
      </Container>
      <FooterNewsLeter />
    </>
  );
};

export default React.memo(HomePage);
