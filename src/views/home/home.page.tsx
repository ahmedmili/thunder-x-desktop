import { Box, CircularProgress, Container } from '@mui/material';
import { useAppSelector } from '../../Redux/store';

import {  useEffect, useState } from 'react';
import CategoryCarousel from '../../components/categoriesCarousel/categoriesCarousel';
import {
  selectHomeData,
  selectIsDelivery,
} from '../../Redux/slices/homeDataSlice';
import React from 'react';
import { Restaurant } from '../../services/types';
import { CarouselProvider, Slide, Slider } from 'pure-react-carousel';
import RestaurantList from '../../components/recommendedRestaurants/recommendedRestaurants';
import { useTranslation } from 'react-i18next';
import FAQList from '../../components/faq/faq';
import 'laravel-echo/dist/echo';
import { distance } from '../../services/distance'
import './home.page.css'

const HomePage = () => {

  const { t } = useTranslation();
  const homeData = useAppSelector(selectHomeData);
  const isLoading = useAppSelector((state) => state.homeData.loading);
  const distanceFilter = useAppSelector((state) => state.restaurant.distanceFilter)
  const textFilter = useAppSelector((state) => state.restaurant.searchQuery)
  const isDelivery = useAppSelector(selectIsDelivery);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>(
    []
  );

  const handleCategorySelect = (category: string) => {
    
    if (selectedCategory === category) {
      // User clicked on the same category again, so show the restaurants that correspond to the state of isDelivery
      setSelectedCategory('');
      const filteredRestaurants = homeData?.recommended.filter(
        (restaurant: Restaurant) => {
          let restoLat = restaurant.lat
          let restoLong = restaurant.lat
          let dis = distance(restoLat, restoLong)
          const hasDelivery = isDelivery && restaurant.delivery === 1;
          const hasTakeAway = !isDelivery && restaurant.take_away === 1;
          const searchText = restaurant.name.toLowerCase().includes(textFilter.toLowerCase())

          console.log(searchText)
          console.log(textFilter)
          return (hasDelivery || hasTakeAway) && ((dis <= distanceFilter) && searchText);
        }
        );
        setFilteredRestaurants(filteredRestaurants ? filteredRestaurants : []);
        console.log(filteredRestaurants)
        
      } else {
      setSelectedCategory(category);
      const filteredRestaurants = homeData?.recommended.filter(
        (restaurant: Restaurant) => {
          const isInCategory =
            restaurant.parents_cat
              .map((cat: any) => cat.name.toLowerCase())
              .includes(category.toLowerCase()) || category === '';
          const hasDelivery = isDelivery && restaurant.delivery === 1;
          const hasTakeAway = !isDelivery && restaurant.take_away === 1;
          let restoLat = restaurant.lat
          let restoLong = restaurant.lat
          let dis = distance(restoLat, restoLong)
          const searchText = restaurant.name.toLowerCase().includes(textFilter.toLowerCase())
          console.log(searchText)
          console.log(textFilter)
          return isInCategory && (hasDelivery || hasTakeAway) && (dis <= distanceFilter) && searchText;
        }
      );
      setFilteredRestaurants(filteredRestaurants ? filteredRestaurants : []);
      console.log(filteredRestaurants)

    }
  };

  useEffect(() => {
    handleCategorySelect('');
  }, [homeData?.recommended, isDelivery,distanceFilter,textFilter]);

  return (
    <Container maxWidth='lg' className="containerr">
      {
        isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <div style={{ padding: '4px' }}>
              <CategoryCarousel
                onCategorySelect={handleCategorySelect}
                categories={homeData?.categories}
              />
            </div>
            <div style={{ padding: '4px' }}>
              <RestaurantList restaurants={filteredRestaurants} />
            </div>
          </>
        )}
      {/* {!isLoading && homeData && homeData.ads && (
        <div style={{ maxWidth: '1000px', margin: '5rem' }}>
          <CarouselProvider
            naturalSlideWidth={850}
            naturalSlideHeight={300}
            totalSlides={
              homeData?.ads.HOME_1.length +
              homeData?.ads.HOME_2.length +
              homeData?.ads.HOME_3.length
            }
            visibleSlides={1}
            step={1}
            infinite={true}
            isPlaying={true}
            lockOnWindowScroll={true}>
            <Slider>
              {homeData.ads.HOME_1.map((ad: any) => (
                <Slide key={ad.id} index={ad.id - 1}>
                  <img
                    style={{
                      objectFit: 'contain',
                      width: '100%',
                      height: '100%',
                    }}
                    src={ad.image}
                    alt={`Ad ${ad.id}`}
                    loading='lazy'
                  />
                </Slide>
              ))}
              {homeData.ads.HOME_2.map((ad: any) => (
                <Slide key={ad.id} index={ad.id - 1}>
                  <img
                    style={{
                      objectFit: 'contain',
                      width: '100%',
                      height: '100%',
                    }}
                    src={ad.image}
                    alt={`Ad ${ad.id}`}
                  />
                </Slide>
              ))}
              {homeData.ads.HOME_3.map((ad: any) => (
                <Slide key={ad.id} index={ad.id - 1}>
                  <img
                    style={{
                      objectFit: 'contain',
                      width: '100%',
                      height: '100%',
                    }}
                    src={ad.image}
                    alt={`Ad ${ad.id}`}
                  />
                </Slide>
              ))}
            </Slider>
          </CarouselProvider>
        </div>
      )}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <FAQList />
      </div> */}
    </Container>
  );
};

export default React.memo(HomePage);
