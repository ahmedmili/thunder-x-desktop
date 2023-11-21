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
  recommendedHomeSelector,
} from "../../Redux/slices/home";
import { useAppSelector } from "../../Redux/store";
import CategoryCarousel from "../../components/categoriesCarousel/categoriesCarousel";
import HomeSkeleton from "./skeleton/HomeSkeleton";



const HomePage = ({ initialData }: AppProps) => {

  const ads = initialData ? initialData.ads : useSelector(adsHomeSelector);
  const categories = initialData ? initialData.categories : useSelector(categoriesHomeSelector);
  const recommanded = initialData ? initialData.recommended : useSelector(recommendedHomeSelector);
  const isLoading = initialData ? false : useSelector(homeLoadingSelector);

  const restaurantsList = useAppSelector((state) => state.restaurant.restaurants);

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
      </div>

      <FooterNewsLeter />
    </>
  );
};

export default React.memo(HomePage);
